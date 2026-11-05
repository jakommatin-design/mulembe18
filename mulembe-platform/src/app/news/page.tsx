import { Metadata } from "next";
import { Bell, AlertTriangle, Info, Calendar } from "lucide-react";
import { announcementRepository } from "@/server/repositories/announcement.repository";

export const metadata: Metadata = {
  title: "News & Community Bulletins | Mulembe National Platform",
  description:
    "Official bulletins, elder council resolutions, bursary alerts, and emergency welfare notices from the Mulembe National Platform.",
  openGraph: {
    title: "News & Community Bulletins | Mulembe National Platform",
    description:
      "Stay informed with verified communications from the National Secretariat and County Desks.",
  },
};

export default async function NewsPage() {
  const { items: announcements } = await announcementRepository.list({ limit: 50 });

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case "urgent":
        return (
          <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 text-uppercase small d-inline-flex align-items-center gap-1">
            <AlertTriangle size={12} /> Urgent Notice
          </span>
        );
      case "important":
        return (
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 text-uppercase small d-inline-flex align-items-center gap-1">
            <Bell size={12} /> Important
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill bg-info bg-opacity-25 text-info border border-info border-opacity-50 text-uppercase small d-inline-flex align-items-center gap-1">
            <Info size={12} /> Routine Bulletin
          </span>
        );
    }
  }

  return (
    <main className="container py-5">
      {/* Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 text-uppercase mb-3">
            Official Dispatches
          </span>
          <h1
            className="display-4 fw-bold text-light mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            News & Community Bulletins
          </h1>
          <p className="lead text-secondary">
            Verified updates from the National Council of Elders, County Steering Desks, and
            chapter secretariats.
          </p>
        </div>
      </div>

      {/* Announcements Stream */}
      {announcements.length === 0 ? (
        <div className="glass-panel p-5 text-center my-4">
          <Bell size={40} className="text-secondary mb-3" />
          <h4 className="fw-bold text-light">No Active Notices</h4>
          <p className="text-secondary mb-0">
            There are no public announcements currently active. Check back later for official
            communiqués.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {announcements.map((item) => (
            <div key={item.id} className="col-12">
              <div
                className={`glass-panel p-4 p-md-5 ${
                  item.priority === "urgent" ? "border-danger border-opacity-50" : ""
                }`}
              >
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    {item.countyCode && (
                      <span className="badge rounded-pill bg-light bg-opacity-10 text-light border border-light border-opacity-25 small">
                        County {item.countyCode}
                      </span>
                    )}
                  </div>
                  <span className="small text-secondary d-flex align-items-center gap-1">
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString("en-KE", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3
                  className="h3 fw-bold text-light mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-secondary mb-0"
                  style={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  {item.content}
                </p>

                {item.expiresAt && (
                  <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 small text-secondary">
                    Active through:{" "}
                    <strong>
                      {new Date(item.expiresAt).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatches Note */}
      <div className="glass-card p-4 mt-5 text-center">
        <p className="small text-secondary mb-0">
          Want to submit a chapter notice or benevolent request? Registered chapter secretaries can
          publish notices via the leadership portal.
        </p>
      </div>
    </main>
  );
}

