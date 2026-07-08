# ICON Laptop Shop — Requirements Document

## Project Overview

A "Digital Showroom" for **ICON**, a refurbished laptop shop. Customers browse real units with real photos, battery health, and condition grades. They can reserve laptops for in-store viewing and testing.

**MVP Goal:** 10–20 laptops listed. Customer can find a laptop → see real condition → contact/reserve in 2 clicks.

**Core Philosophy:** Sell laptops — the website is a spear, not a Swiss Army knife.

---

## Tech Stack (PERN)

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + React Router + CSS Modules or Tailwind |
| Backend API | Node.js + Express |
| Database | PostgreSQL |
| ORM | Knex.js or raw `pg` |
| Auth | Simple session-based (bcrypt + express-session) |
| Image Storage | Local filesystem (`/uploads`) |
| Email | Nodemailer (SMTP) |
| Hosting | VPS or Railway/Render |

---

## Functional Requirements

### FR1: Landing Page
- Hero section with headline, sub-headline, and "Call Us Now" button
- Trust bar (warranty, exact unit, test before pay)
- Featured laptops section (max 6)
- Google Maps embed + address + hours + phone
- Footer with links to Catalog and Contact

### FR2: Catalog Page
- Grid of available laptops with photos, title, price, grade, battery %
- Sort: Newest, Price Low-High, Price High-Low
- Filter: Brand, RAM
- Pagination (Previous/Next + Load More)
- Results count + Back to Top

### FR3: Product Detail Page
- Image gallery with thumbnails + lightbox zoom
- Title, price, grade badge, battery gauge
- Full specs table (CPU, gen, RAM, storage, screen, GPU, OS)
- Refurbishment report with checkmarks
- What's in the box
- Status badge (Available/Reserved/Sold)
- Reserve button + Call Us button
- WhatsApp share button

### FR4: Reserve Modal
- Name (required), Phone (required, 10+ digits), Email (optional)
- Success message + auto-close after 3s
- Sends email to shop + confirmation to customer
- Changes laptop status to Reserved

### FR5: Contact Page
- Address, map, phone, email, WhatsApp link, hours
- Contact form → email to shop owner

### FR6: Admin — Add Laptop
- Structured form with dropdowns, checkboxes, file upload (up to 5 photos)
- Auto-generated URL slug
- Validation on all fields

### FR7: Admin — Manage Listings
- Table with thumbnail, title, price, grade, status, date
- Edit, Delete (with confirmation), Mark as Sold/Available
- Search + filter + pagination

### FR8: Admin — Reservations Dashboard
- Table: name, phone, email, laptop, timestamp, status
- Mark as Picked Up / Expired
- Count of active reservations today

### FR9: Admin — Authentication
- Login/logout with username + password
- Session persists 7 days
- Admin-only route protection

### FR10: Backend — Reservation Logic
- Reserve → status changes to Reserved
- Picked Up/Expired → status back to Available
- Sold → hidden from frontend
- Email notifications

### FR11: Backend — Image Handling
- Upload, compress/optimize, serve
- Auto-generate clean URLs for laptops

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR1 | Responsive on all screen sizes (desktop, tablet, mobile) |
| NFR2 | CSRF protection on all forms |
| NFR3 | Admin stays logged in for 7 days |
| NFR4 | Images compressed on upload |
| NFR5 | Friendly error messages on failure |
| NFR6 | Mobile sticky "Call Us" button |
| NFR7 | Clean URLs (e.g., /laptop/dell-xps-15-9560) |
