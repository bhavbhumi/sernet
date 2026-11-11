import React from "react";
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface TicketClosedProps {
  clientName?: string;
  ticketNumber?: string;
  ticketSubject?: string;
  ratingUrl?: string | null;
}

function TicketClosedEmail({ clientName, ticketNumber, ticketSubject, ratingUrl }: TicketClosedProps) {
  const greeting = clientName?.trim() ? `Hello ${clientName.trim()},` : "Hello,";
  const reference = ticketNumber || "Your support ticket";

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{reference} has been closed{ratingUrl ? " — please rate your support" : ""}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>SERNET</Text>
          <Heading style={heading}>Your support ticket is closed</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>
            {reference} has now been closed. Thank you for contacting SERNET Support.
          </Text>
          {ticketSubject ? <Text style={subject}><strong>Request:</strong> {ticketSubject}</Text> : null}
          {ratingUrl ? (
            <Section style={ratingSection}>
              <Text style={text}>How was our service on this request? Your rating takes less than a minute.</Text>
              <Button href={ratingUrl} style={button}>Rate this support</Button>
              <Text style={small}>You may be asked to sign in to your client portal first.</Text>
            </Section>
          ) : null}
          <Hr style={divider} />
          <Text style={small}>
            If you need further help with this request, reply to this email or contact SERNET Support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: TicketClosedEmail,
  subject: (data: Record<string, any>) => `${data.ticketNumber || "Your support ticket"} — closed`,
  displayName: "Support ticket closed",
  previewData: {
    clientName: "Asha Shah",
    ticketNumber: "TKT-00001",
    ticketSubject: "Account statement request",
    ratingUrl: "https://sernetindia.com/portal?tab=tickets&ticket=2be2b2f2-e7c4-5c98-ae07-0e61b509f3b9",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", margin: "0", padding: "24px 0" };
const container = { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", margin: "0 auto", maxWidth: "560px", padding: "28px" };
const brand = { color: "#3b82f6", fontSize: "18px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 24px" };
const heading = { color: "#0f172a", fontSize: "24px", lineHeight: "1.3", margin: "0 0 20px" };
const text = { color: "#334155", fontSize: "15px", lineHeight: "1.6", margin: "0 0 16px" };
const subject = { ...text, backgroundColor: "#f8fafc", borderRadius: "6px", padding: "12px 14px" };
const ratingSection = { padding: "8px 0 4px" };
const button = { backgroundColor: "#3b82f6", borderRadius: "6px", color: "#ffffff", display: "inline-block", fontSize: "15px", fontWeight: "600", padding: "12px 20px", textDecoration: "none" };
const small = { color: "#64748b", fontSize: "13px", lineHeight: "1.5", margin: "16px 0 0" };
const divider = { borderColor: "#e2e8f0", margin: "24px 0 0" };
