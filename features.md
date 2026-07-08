# ICON Laptop Shop — Feature List

## Phase 1 — Frontend (Customer-Facing)

### Landing Page
- [x] Hero: headline, sub-headline, "Call Us Now" button
- [x] Trust bar: 3 badges (warranty, exact unit, test before pay)
- [x] Featured laptops grid (max 6) — thumbnail, title, price, grade, battery %
- [x] "View All Laptops" → Catalog
- [x] Google Maps embed
- [x] Address, phone (click-to-call), hours
- [x] Footer: catalog + contact links
- [x] Sticky floating "Call Us" on mobile

### Catalog Page
- [x] Grid of available laptops
- [x] Card: thumbnail, title, price, grade badge, battery %, "View Details"
- [x] Sort: Newest, Price Low-High, Price High-Low
- [x] Filter: Brand (All, Dell, HP, Lenovo, Apple, Acer, Asus), RAM (All, 8GB, 16GB, 32GB)
- [x] Pagination: Previous/Next + Load More
- [x] Results count
- [x] Back to Top button

### Product Detail Page
- [x] Main image + thumbnail gallery (5 photos)
- [x] Click thumbnail → update main image
- [x] Click main → lightbox/zoom modal
- [x] Title (Brand + Model + CPU)
- [x] Price
- [x] Grade badge (color-coded)
- [x] Battery health circular gauge + cycle count
- [x] Specs table: CPU, Gen, RAM, Storage, Screen size, Resolution, GPU, OS
- [x] Refurbishment report (checkmark bullet list)
- [x] What's in the box
- [x] Status badge (green/yellow/red)
- [x] "Reserve for In-Store Viewing" button
- [x] "Call Us Now" button
- [x] "We will hold this laptop for 24 hours" text
- [x] "Share on WhatsApp" button

### Reserve Modal
- [x] Name (required), Phone (required, 10+ digits), Email (optional)
- [x] Hold message
- [x] Submit + Cancel buttons
- [x] Success message + auto-close 3s
- [x] Email to shop + confirmation to customer
- [x] Mobile-responsive

### Contact Page
- [x] Address, Google Maps, phone, email, WhatsApp, hours
- [x] Contact form (Name, Email, Message)
- [x] Email on submit + success message

---

## Phase 2 — Admin Panel

### Authentication
- [x] Login page (username + password)
- [x] Session (7 days)
- [x] Logout
- [x] Route protection

### Add Laptop Form
- [x] Brand (dropdown), Model (text)
- [x] CPU: brand, model, generation, full number, cores, clocks
- [x] RAM, Storage, Screen size, Resolution, GPU, OS (dropdowns)
- [x] Price, Purchase cost
- [x] Grade (Mint/Excellent/Good)
- [x] Battery health %, cycle count
- [x] Physical notes (textarea)
- [x] Refurbishment checkboxes (6 items)
- [x] Included items checkboxes
- [x] File upload (up to 5 photos, .jpg/.png)
- [x] Status (Available/Reserved/Sold)
- [x] Save/Publish + Cancel
- [x] Validation + success message

### Manage Listings (Dashboard Table)
- [x] Table: thumbnail, title, price, grade, status, date
- [x] Edit, Delete (with confirmation), Mark as Sold/Available
- [x] Search bar
- [x] Filter: All, Available, Reserved, Sold
- [x] Pagination (20/page)
- [x] "Add New Laptop" button

### Reservations Dashboard
- [x] Table: name, phone, email, laptop, timestamp, status
- [x] Mark as Picked Up / Expired
- [x] Active reservations count
- [x] Sort by newest first

---

## Phase 3 — Backend API

### Endpoints
- [x] `GET /api/laptops` — list available (with filters, sort, pagination)
- [x] `GET /api/laptops/featured` — featured (max 6)
- [x] `GET /api/laptops/:slug` — single laptop
- [x] `POST /api/laptops` — create (admin)
- [x] `PUT /api/laptops/:id` — update (admin)
- [x] `DELETE /api/laptops/:id` — delete (admin)
- [x] `POST /api/reservations` — create reservation
- [x] `GET /api/reservations` — list (admin)
- [x] `PUT /api/reservations/:id` — update status (admin)
- [x] `POST /api/contact` — contact form
- [x] `POST /api/auth/login` — login
- [x] `POST /api/auth/logout` — logout
- [x] `GET /api/auth/me` — check session

### Logic
- [x] Reserve → laptop status → Reserved
- [x] Picked Up/Expired → laptop status → Available
- [x] Sold → hidden from catalog
- [x] Image upload + compression
- [x] Slug auto-generation
- [x] Email notifications (reservation + contact)
