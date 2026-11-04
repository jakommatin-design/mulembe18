"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal, Dropdown, Accordion } from "react-bootstrap";

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showModal, setShowModal] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <Link href="/" className="text-decoration-none text-secondary small mb-1 d-inline-block">
            &larr; Back to Platform Home
          </Link>
          <h1 className="h2 fw-bold" style={{ fontFamily: "var(--font-serif)" }}>
            Living Style Guide & Design System
          </h1>
          <p className="text-secondary mb-0">
            Interactive preview of the luxury glassmorphic Bootstrap 5 theme.
          </p>
        </div>
        <div>
          <button onClick={toggleTheme} className="btn btn-glass">
            Toggle Theme: <strong className="text-uppercase">{theme}</strong>
          </button>
        </div>
      </div>

      {/* Surface Primitives */}
      <section className="mb-5">
        <h3 className="h5 fw-bold mb-3 text-secondary text-uppercase tracking-wider">
          1. Glass Surface Primitives
        </h3>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="glass-panel p-4">
              <h5 className="fw-bold">Glass Panel (.glass-panel)</h5>
              <p className="text-secondary mb-0">
                20px backdrop blur, deep translucent base tint, and soft layered box shadow. Ideal for hero containers and major page sections.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="glass-card p-4">
              <h5 className="fw-bold">Glass Card (.glass-card)</h5>
              <p className="text-secondary mb-0">
                16px backdrop blur with interactive hover lift (-4px) and subtle gold border highlight on hover. Used for chapters, members, and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-5">
        <h3 className="h5 fw-bold mb-3 text-secondary text-uppercase tracking-wider">
          2. Buttons & Actions
        </h3>
        <div className="glass-card p-4 d-flex gap-3 flex-wrap align-items-center">
          <button className="btn btn-gold">Primary Gold (.btn-gold)</button>
          <button className="btn btn-glass">Secondary Glass (.btn-glass)</button>
          <button onClick={() => setShowModal(true)} className="btn btn-outline-warning">
            Trigger Glass Modal
          </button>
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
            Verified Chapter Badge
          </span>
        </div>
      </section>

      {/* Interactive React-Bootstrap Components */}
      <section className="mb-5">
        <h3 className="h5 fw-bold mb-3 text-secondary text-uppercase tracking-wider">
          3. React-Bootstrap Interactive Components
        </h3>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="glass-card p-4">
              <h6 className="fw-bold mb-3">Dropdown Menu</h6>
              <Dropdown>
                <Dropdown.Toggle className="btn btn-glass" id="dropdown-basic">
                  Select County Chapter
                </Dropdown.Toggle>
                <Dropdown.Menu className="glass-card mt-2 shadow border-0">
                  <Dropdown.Item href="#/kakamega" className="text-light">037 - Kakamega Central</Dropdown.Item>
                  <Dropdown.Item href="#/bungoma" className="text-light">039 - Bungoma West</Dropdown.Item>
                  <Dropdown.Item href="#/nairobi" className="text-light">047 - Nairobi Metropolis</Dropdown.Item>
                  <Dropdown.Item href="#/mombasa" className="text-light">001 - Mombasa Coastal</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="glass-card p-4">
              <h6 className="fw-bold mb-3">Accessible Accordion</h6>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className="bg-transparent border-0 mb-2">
                  <Accordion.Header>Chapter Autonomy & Scope</Accordion.Header>
                  <Accordion.Body className="text-secondary small">
                    Every local chapter operates within its county jurisdiction while reporting up to the national executive committee.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="bg-transparent border-0">
                  <Accordion.Header>KDPA 2019 Compliance</Accordion.Header>
                  <Accordion.Body className="text-secondary small">
                    All member records are processed strictly for mutual aid, identity verification, and community communication.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Demo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-panel text-light border-0">
        <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-25">
          <Modal.Title style={{ fontFamily: "var(--font-serif)" }}>Glassmorphic Confirmation Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-secondary mb-0">
            This modal illustrates the high-contrast 28px blur backdrop layer designed for RSVP confirmations and administrative approvals.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-secondary border-opacity-25">
          <button className="btn btn-glass" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-gold" onClick={() => setShowModal(false)}>Confirm Action</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

