import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardIndexPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in?redirectUrl=/dashboard");
  }

  // Route to specific role tier dashboard
  switch (user.role) {
    case "super_admin":
    case "national_admin":
      redirect("/dashboard/national");
    case "county_coordinator":
      redirect("/dashboard/county");
    case "chapter_chair":
    case "chapter_secretary":
      redirect("/dashboard/chapter");
    default:
      redirect("/profile");
  }
}

