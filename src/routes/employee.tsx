import { createFileRoute } from "@tanstack/react-router";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";

export const Route = createFileRoute("/employee")({
  component: EmployeeDashboard,
});
