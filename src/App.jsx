import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "nextstep-applications";
const statuses = ["Applied", "Interview", "Selected", "Rejected"];

const starterApplications = [
  {
    id: "a1",
    company: "Notion",
    role: "Frontend Engineer",
    location: "New York, NY",
    salary: "$145k – $180k",
    status: "Interview",
    applied: "2026-09-28",
    color: "lavender",
  },
  {
    id: "a2",
    company: "Linear",
    role: "Product Engineer",
    location: "Remote",
    salary: "$130k – $165k",
    status: "Applied",
    applied: "2026-09-25",
    color: "violet",
  },
  {
    id: "a3",
    company: "Stripe",
    role: "Software Engineer, UI",
    location: "San Francisco, CA",
    salary: "$160k – $210k",
    status: "Selected",
    applied: "2026-09-22",
    color: "blue",
  },
  {
    id: "a4",
    company: "Figma",
    role: "Frontend Developer",
    location: "Remote",
    salary: "$140k – $185k",
    status: "Interview",
    applied: "2026-09-19",
    color: "orange",
  },
  {
    id: "a5",
    company: "Vercel",
    role: "Design Engineer",
    location: "Remote",
    salary: "$135k – $175k",
    status: "Rejected",
    applied: "2026-09-16",
    color: "ink",
  },
  {
    id: "a6",
    company: "Webflow",
    role: "Product Designer",
    location: "San Francisco, CA",
    salary: "$125k – $160k",
    status: "Applied",
    applied: "2026-09-12",
    color: "teal",
  },
];

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const shapes = {
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
    edit: (
      <>
        <path d="m15 5 4 4M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
  };
  return <svg {...common}>{shapes[name]}</svg>;
}

function readApplications() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterApplications;
  } catch {
    return starterApplications;
  }
}

function prettyDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function App() {
  const [applications, setApplications] = useState(readApplications);
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [dialogApplication, setDialogApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const counts = useMemo(
    () => ({
      total: applications.length,
      Interviews: applications.filter(
        (application) => application.status === "Interview",
      ).length,
      Selected: applications.filter(
        (application) => application.status === "Selected",
      ).length,
      Rejected: applications.filter(
        (application) => application.status === "Rejected",
      ).length,
    }),
    [applications],
  );

  const filteredApplications = useMemo(
    () =>
      applications
        .filter(
          (application) =>
            activeStatus === "All" || application.status === activeStatus,
        )
        .filter((application) =>
          `${application.company} ${application.role} ${application.location} ${application.status}`
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
        )
        .sort((first, second) => second.applied.localeCompare(first.applied)),
    [applications, activeStatus, query],
  );

  function openNewDialog() {
    setDialogApplication(null);
    setDialogOpen(true);
  }

  function saveApplication(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    if (dialogApplication) {
      setApplications((current) =>
        current.map((application) =>
          application.id === dialogApplication.id
            ? { ...application, ...values }
            : application,
        ),
      );
    } else {
      setApplications((current) => [
        {
          id: crypto.randomUUID(),
          ...values,
          color: ["lavender", "blue", "orange", "teal"][current.length % 4],
        },
        ...current,
      ]);
    }
    setDialogOpen(false);
  }

  function deleteApplication(id) {
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#main" aria-label="Nextstep home">
          <span className="brand-mark">
            <Icon name="arrow" size={19} />
          </span>
          <span>
            nextstep<span className="brand-period">.</span>
          </span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <button className="nav-item nav-item-active" type="button">
          <Icon name="briefcase" />
          Applications<span className="nav-count">{applications.length}</span>
        </button>
        <div className="sidebar-bottom">
          <div className="profile-avatar">JD</div>
          <div className="profile-copy">
            <strong>Jamie Davis</strong>
            <span>Personal workspace</span>
          </div>
          <button
            className="profile-menu"
            type="button"
            aria-label="Account menu"
          >
            ···
          </button>
        </div>
      </aside>

      <main className="main-content" id="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Applications
          </div>
          <div className="today-label">
            <span className="today-dot" />
            YOUR JOB SEARCH, IN ONE PLACE
          </div>
        </header>
        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">MONDAY, OCTOBER 5, 2026</p>
              <h1>Applications</h1>
              <p className="heading-subtitle">Keep your next move moving.</p>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={openNewDialog}
            >
              <Icon name="plus" size={17} />
              Add application
            </button>
          </section>

          <section className="stats-grid" aria-label="Application summary">
            <article className="stat-card stat-total">
              <div className="stat-top">
                <span>Total applications</span>
                <span className="stat-symbol">
                  <Icon name="briefcase" size={17} />
                </span>
              </div>
              <div className="stat-value">
                {counts.total}
                <span className="stat-caption">in your pipeline</span>
              </div>
              <div className="stat-rule">
                <span
                  style={{ width: `${Math.min(counts.total * 5, 100)}%` }}
                />
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Interviews</span>
                <span className="stat-symbol symbol-yellow">02</span>
              </div>
              <div className="stat-value">
                {counts.Interviews}
                <span className="stat-caption">conversations started</span>
              </div>
              <div className="stat-foot">
                <span className="mini-dot dot-yellow" />
                Good things are in motion
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Selected</span>
                <span className="stat-symbol symbol-green">↗</span>
              </div>
              <div className="stat-value">
                {counts.Selected}
                <span className="stat-caption">offers received</span>
              </div>
              <div className="stat-foot">
                <span className="mini-dot dot-green" />
                Your hard work is paying off
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Rejected</span>
                <span className="stat-symbol symbol-red">↘</span>
              </div>
              <div className="stat-value">
                {counts.Rejected}
                <span className="stat-caption">on to the next</span>
              </div>
              <div className="stat-foot">
                <span className="mini-dot dot-red" />
                Every no gets you closer
              </div>
            </article>
          </section>

          <section
            className="applications-section"
            aria-label="Job applications"
          >
            <div className="list-header">
              <div>
                <h2>Your pipeline</h2>
                <p>A little progress, every day.</p>
              </div>
              <span className="list-total">
                {filteredApplications.length}{" "}
                {filteredApplications.length === 1
                  ? "application"
                  : "applications"}
              </span>
            </div>
            <div className="list-toolbar">
              <div
                className="status-tabs"
                role="tablist"
                aria-label="Filter by status"
              >
                {["All", ...statuses].map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={activeStatus === status}
                    className={
                      activeStatus === status
                        ? "status-tab selected-tab"
                        : "status-tab"
                    }
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <label className="search-box">
                <Icon name="search" size={17} />
                <input
                  type="search"
                  placeholder="Search companies, roles..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search applications"
                />
                <kbd>/</kbd>
              </label>
            </div>
            <div className="application-table-wrap">
              <table className="application-table">
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>ROLE</th>
                    <th>LOCATION</th>
                    <th>DATE APPLIED</th>
                    <th>STATUS</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <div className="company-cell">
                          <span
                            className={`company-logo logo-${application.color}`}
                          >
                            {application.company.slice(0, 1)}
                          </span>
                          <div className="company-copy">
                            <strong>{application.company}</strong>
                            <span>
                              {application.salary || "Salary not listed"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="role-cell">{application.role}</td>
                      <td>
                        <span className="location-cell">
                          <Icon name="pin" size={14} />
                          {application.location || "Not specified"}
                        </span>
                      </td>
                      <td className="date-cell">
                        {prettyDate(application.applied)}
                      </td>
                      <td>
                        <span
                          className={`status-pill status-${application.status.toLowerCase()}`}
                        >
                          <span />
                          {application.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            aria-label={`Edit ${application.company} application`}
                            title="Edit application"
                            onClick={() => {
                              setDialogApplication(application);
                              setDialogOpen(true);
                            }}
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${application.company} application`}
                            title="Delete application"
                            onClick={() => deleteApplication(application.id)}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredApplications.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">
                    <Icon name="search" size={21} />
                  </span>
                  <h3>No applications found</h3>
                  <p>
                    Try a different search or add a new application to your
                    pipeline.
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setQuery("");
                      setActiveStatus("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <div className="list-footer">
              <span>
                Showing <strong>{filteredApplications.length}</strong> of{" "}
                <strong>{applications.length}</strong> applications
              </span>
              <span>
                Changes are saved automatically{" "}
                <span className="saved-check">✓</span>
              </span>
            </div>
          </section>
          <footer className="page-footer">
            <span>One step at a time.</span>
            <span>Made for the in-between.</span>
          </footer>
        </div>
      </main>

      {dialogOpen && (
        <div
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialogOpen(false);
          }}
        >
          <section
            className="application-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-heading">
              <div>
                <p className="eyebrow">YOUR NEXT OPPORTUNITY</p>
                <h2 id="dialog-title">
                  {dialogApplication
                    ? "Edit application"
                    : "Add an application"}
                </h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close dialog"
                onClick={() => setDialogOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={saveApplication}>
              <div className="form-grid">
                <label className="form-field">
                  Company name
                  <input
                    name="company"
                    required
                    placeholder="e.g. Acme Inc."
                    defaultValue={dialogApplication?.company}
                  />
                </label>
                <label className="form-field">
                  Job title
                  <input
                    name="role"
                    required
                    placeholder="e.g. Product designer"
                    defaultValue={dialogApplication?.role}
                  />
                </label>
                <label className="form-field">
                  Location
                  <input
                    name="location"
                    placeholder="City, state or remote"
                    defaultValue={dialogApplication?.location}
                  />
                </label>
                <label className="form-field">
                  Salary range
                  <input
                    name="salary"
                    placeholder="e.g. $100k – $130k"
                    defaultValue={dialogApplication?.salary}
                  />
                </label>
                <label className="form-field">
                  Status
                  <select
                    name="status"
                    defaultValue={dialogApplication?.status || "Applied"}
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  Date applied
                  <input
                    name="applied"
                    type="date"
                    required
                    defaultValue={
                      dialogApplication?.applied ||
                      new Date().toISOString().slice(0, 10)
                    }
                  />
                </label>
              </div>
              <div className="dialog-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  {dialogApplication ? "Save changes" : "Add application"}
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
