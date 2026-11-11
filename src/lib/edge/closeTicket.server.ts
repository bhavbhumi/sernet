import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { canManageSupportTickets, getTicketRatingUrl } from "@/lib/ticketClosure";
import { requireAdmin } from "./adminAuth.server";
import { serverEnv } from "./env.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-admin-key, content-type",
};

const inputSchema = z.object({ ticketId: z.string().uuid() });

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Closes one ticket and sends its fixed closure/rating email to the stored requester. */
export const handle = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const denied = await requireAdmin(req, corsHeaders, "staff");
  if (denied) return denied;

  try {
    const { ticketId } = inputSchema.parse(await req.json());
    const supabaseAdmin = createClient(
      serverEnv("SUPABASE_URL")!,
      serverEnv("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
      if (userError || !user) return json({ error: "Unauthorized" }, 401);
      const [{ data: role }, { data: permission }] = await Promise.all([
        supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabaseAdmin.from("staff_permissions").select("allowed_modules").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!canManageSupportTickets(role?.role, permission?.allowed_modules)) {
        return json({ error: "You do not have permission to close support tickets." }, 403);
      }
    }

    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("support_tickets")
      .select("id,ticket_number,subject,status,contact_name,contact_email,created_by,resolved_at,closed_at")
      .eq("id", ticketId)
      .maybeSingle();
    if (ticketError) throw ticketError;
    if (!ticket) return json({ error: "Ticket not found." }, 404);
    if (ticket.status === "closed") {
      return json({ closed: true, alreadyClosed: true, emailSent: false, emailReason: "already_closed" });
    }

    const closedAt = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from("support_tickets")
      .update({
        status: "closed",
        closed_at: closedAt,
        resolved_at: ticket.resolved_at || closedAt,
      })
      .eq("id", ticketId)
      .neq("status", "closed");
    if (updateError) throw updateError;

    if (!ticket.contact_email) {
      return json({ closed: true, emailSent: false, emailReason: "no_email" });
    }

    let ratingUrl: string | null = null;
    if (ticket.created_by) {
      const { data: portalProfile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("user_id", ticket.created_by)
        .eq("user_type", "client")
        .eq("status", "active")
        .maybeSingle();
      if (profileError) throw profileError;
      if (portalProfile) ratingUrl = getTicketRatingUrl(ticket.id);
    }

    try {
      const result = await sendTemplateEmail("ticket-closed", ticket.contact_email, {
        templateData: {
          clientName: ticket.contact_name || "SERNET client",
          ticketNumber: ticket.ticket_number,
          ticketSubject: ticket.subject,
          ratingUrl,
        },
        idempotencyKey: `ticket-closed-${ticket.id}-${closedAt}`,
        replyTo: "support@sernetindia.com",
      });
      return json({
        closed: true,
        emailSent: result.sent,
        emailReason: result.sent ? null : result.reason,
        ratingIncluded: Boolean(ratingUrl),
      });
    } catch (emailError) {
      console.error("Ticket closure email failed", {
        ticketId,
        code: emailError instanceof Error && "code" in emailError ? emailError.code : "unknown",
      });
      return json({ closed: true, emailSent: false, emailReason: "delivery_failed" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "A valid ticket is required." }, 400);
    console.error("Ticket closure failed", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "The ticket could not be closed. Please try again." }, 500);
  }
};
