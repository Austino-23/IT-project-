# ResolveHub — Digital Complaint Management & Case Resolution System

ResolveHub is a comprehensive, production-grade frontend complaint management and dispute resolution platform built with semantic HTML5, pure CSS3 design systems, and vanilla JavaScript (no frontend framework dependencies). It is fully responsive across desktop, tablet, and mobile devices and designed for seamless integration with a Django backend and relational SQL database.

---

## 🚀 Live App & Publishing Options

### 1. In Google AI Studio (Instant Live Link)
- **Shared App URL**: Click the **Share** or **Publish** button in the top navigation bar of Google AI Studio Build to share the live application link or manage public access.
- Changes build automatically and are served directly from Cloud Run.

### 2. Standalone Static Hosting (GitHub Pages, Vercel, Netlify, Cloudflare Pages)
ResolveHub requires no build pipeline to run statically:
- **Direct deployment**: Upload the contents of the `resolvehub/` directory directly to any static host (e.g. GitHub Pages, Netlify drop, Vercel, or Apache/Nginx).
- **Vite build export**: Run `npm run build` to generate the minified `dist/` bundle with bundled assets.

### 3. Integrating with Django & SQL Database
The frontend structure is organized for straightforward Django integration:
- **Templates**: Move HTML files to your Django app's `templates/` folder (e.g., `templates/resolvehub/`).
- **Static Assets**: Place `css/`, `js/`, and `images/` into `static/` and update references using `{% static 'path' %}`.
- **Form Endpoints**: Forms feature semantic `id` and `name` attributes matching standard Django ModelForm field specifications for complaints, users, categories, departments, and audit logs.

---

## 📁 20-Page Application Architecture

### Public & Authentication Portal (5 Pages)
1. `index.html` — Public Homepage, hero case tracking search, stats, featured categories, and workflow steps.
2. `about.html` — About ResolveHub, mission, institutional transparency, resolution SLA standards, and governance.
3. `categories.html` — Complaint categorization index, department routing policies, SLAs, and search filters.
4. `contact.html` — Ombudsman & support contact, department directory, emergency escalation hotline, and inquiry form.
5. `auth.html` — Unified authentication portal with Login, Citizen/Student Registration, and Password Reset tabs.

### User / Citizen Portal (6 Pages)
6. `user/dashboard.html` — User Overview, KPI metrics, recent filings, and quick complaint modal.
7. `user/submit.html` — Multi-step complaint submission wizard with evidence upload, department routing, and privacy toggles.
8. `user/complaints.html` — Case directory with status filters, search, sorting, and pagination.
9. `user/case.html` — Interactive Case Detail with resolution timeline, messaging thread, officer notes, and evidence viewer.
10. `user/notifications.html` — Case notification center, SLA breach alerts, and filter controls.
11. `user/profile.html` — Account profile, security preferences, 2FA settings, and notification channels.

### Staff / Officer Portal (4 Pages)
12. `staff/dashboard.html` — Caseworker workspace, assigned caseload KPIs, SLA urgency alerts, and queue.
13. `staff/cases.html` — Caseworker case queue with department filter, priority flags, and bulk assignment tools.
14. `staff/case.html` — Caseworker adjudication console, investigation worklog, status transitions, and resolution drafting.
15. `staff/reports.html` — Caseworker turnaround metrics, closure statistics, and departmental SLA compliance charts.

### Admin / Management Portal (5 Pages)
16. `admin/dashboard.html` — Executive command center, institutional resolution KPIs, trends, and category breakdown.
17. `admin/cases.html` — Master case management table, escalation reassignment, priority overrides, and audit trails.
18. `admin/users.html` — User & officer administration, role-based access control (Citizen, Staff, Admin), and account moderation.
19. `admin/management.html` — Category management, department routing rules, SLA threshold configuration, and resolution teams.
20. `admin/settings.html` — Institutional system settings, email notification gateways, security policies, and backup logs.

---

## 🛠️ Local Development

```bash
# Install dependencies (Vite dev server)
npm install

# Start local dev server on port 3000
npm run dev

# Run production build
npm run build

# Type check
npm run lint
```
