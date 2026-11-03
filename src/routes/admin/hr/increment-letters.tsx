import { createFileRoute } from "@tanstack/react-router";
import AdminIncrementLetters from "@/pages/admin/hr/AdminIncrementLetters";

export const Route = createFileRoute("/admin/hr/increment-letters")({
  component: AdminIncrementLetters,
});
