import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { announcementRepository } from "@/server/repositories/announcement.repository";
import { notificationRepository } from "@/server/repositories/notification.repository";
import NotificationsList, { NotificationItem } from "@/components/member/NotificationsList";

export const metadata: Metadata = {
  title: "Member Notifications & Bulletins | Mulembe National Platform",
  description: "View community dispatches, county alerts, and welfare notices.",
};

export default async function NotificationsPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in?redirectUrl=/notifications");
  }

  // 1. Fetch member notification preferences
  const prefs = await notificationRepository.getUserPreferences(sessionUser.id);

  // 2. Fetch member direct in-app notifications
  const userNotifsResult = await notificationRepository.listByUser(sessionUser.id, {
    limit: 50,
  });

  // 3. Fetch announcements for member's county / chapter or national
  const { items: announcements } = await announcementRepository.list({
    countyCode: sessionUser.countyCode,
    chapterId: sessionUser.chapterId,
    limit: 50,
  });

  // Combine direct notifications and announcements
  const formattedNotifications: NotificationItem[] = [
    ...userNotifsResult.items.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.message,
      priority: n.priority,
      countyCode: null,
      createdAt: n.createdAt.toISOString(),
      isRead: n.status === "read",
    })),
    ...announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      priority: a.priority,
      countyCode: a.countyCode,
      createdAt: a.createdAt.toISOString(),
      isRead: false,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link
          href="/profile"
          className="btn btn-sm btn-glass d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} /> Member Dashboard
        </Link>
      </div>

      <div className="row justify-content-center text-center mb-4">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-1 text-uppercase mb-2">
            In-App Alerts
          </span>
          <h1
            className="display-5 fw-bold text-light mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Community Notifications & Dispatches
          </h1>
          <p className="lead text-secondary">
            Stay informed on regional welfare assistance, chapter gatherings, and emergency bulletins.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <NotificationsList
            initialNotifications={formattedNotifications}
            initialPreferences={{
              emailEnabled: prefs.emailEnabled,
              smsEnabled: prefs.smsEnabled,
              urgentOnly: prefs.urgentOnly,
              eventReminders: prefs.eventReminders,
              announcements: prefs.announcements,
            }}
          />
        </div>
      </div>
    </main>
  );
}
