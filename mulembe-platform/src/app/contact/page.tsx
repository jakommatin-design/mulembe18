import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { geographyRepository } from "@/server/repositories/geography.repository";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact National Secretariat | Mulembe National Platform",
  description:
    "Official contact channels for the Mulembe National Platform Secretariat, Regional Desks, and Elder Council inquiries.",
  openGraph: {
    title: "Contact National Secretariat | Mulembe National Platform",
    description:
      "Direct your questions, chapter charter petitions, or benevolent welfare inquiries to our leadership desks.",
  },
};

export default async function ContactPage() {
  const counties = await geographyRepository.getAllCounties();
  const countyOptions = counties.map((c) => ({
    code: c.code,
    name: c.name,
  }));

  return (
    <main className="container py-5">
      {/* Header */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 text-uppercase mb-3">
            National Secretariat
          </span>
          <h1
            className="display-4 fw-bold text-light mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Connect With Our Desks
          </h1>
          <p className="lead text-secondary">
            Whether inquiring about your digital membership ID, seeking elder counsel, or proposing
            a new chapter in your locality, we stand ready to assist.
          </p>
        </div>
      </div>

      <div className="row g-5">
        {/* Left Column: Contact Channels & Hubs */}
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-4">
            {/* Headquarters Card */}
            <div className="glass-panel p-4">
              <h4 className="fw-bold text-light mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                National Secretariat Headquarters
              </h4>
              <div className="d-flex flex-column gap-3 small text-secondary">
                <div className="d-flex align-items-start gap-3">
                  <MapPin size={20} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-light d-block">Secretariat Chambers</strong>
                    <span>Mulembe Cultural House, Upper Hill, Nairobi, Kenya</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <Mail size={20} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-light d-block">Official Email</strong>
                    <span>secretariat@mulembe.org / info@mulembe.org</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <Phone size={20} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-light d-block">Secretariat Helpline</strong>
                    <span>+254 700 000 000 / +254 722 000 000</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <Clock size={20} className="text-warning flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-light d-block">Working Hours</strong>
                    <span>Monday &ndash; Friday: 8:30 AM &ndash; 5:00 PM EAT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Desks */}
            <div className="glass-card p-4">
              <h5 className="fw-bold text-light mb-3">Regional Coordination Desks</h5>
              <div className="d-flex flex-column gap-3 small text-secondary">
                <div className="p-3 rounded glass-panel">
                  <strong className="text-light d-block">Western Kenya Heartland Desk</strong>
                  <span>Bukhungu Social Hall, Kakamega Town</span>
                  <span className="d-block text-warning small mt-1">western@mulembe.org</span>
                </div>

                <div className="p-3 rounded glass-panel">
                  <strong className="text-light d-block">Coast Regional Desk</strong>
                  <span>Mombasa Cultural Centre, Mvita</span>
                  <span className="d-block text-warning small mt-1">coast@mulembe.org</span>
                </div>

                <div className="p-3 rounded glass-panel">
                  <strong className="text-light d-block">Global Diaspora Liaison</strong>
                  <span>Coordinating UK, US, Canada & Gulf chapters</span>
                  <span className="d-block text-warning small mt-1">diaspora@mulembe.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="col-12 col-lg-7">
          <ContactForm counties={countyOptions} />
        </div>
      </div>
    </main>
  );
}

