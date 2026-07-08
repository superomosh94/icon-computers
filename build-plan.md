# ICON Laptop Shop — Build Plan (Frontend-First)

## Strategy

Build the complete frontend with mock data first. Backend/API will be added in a later phase. This lets us:
- Validate the full UX before writing backend code
- Use realistic mock data that mirrors the final DB schema
- Swap mock data for API calls later with minimal changes (abstracted via a data layer)

---

## Phase 0: Project Scaffolding

```
icon-shop-website/
├── client/          # React (Vite) frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── data/          # Mock data + data layer
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # Global styles
│   │   └── App.jsx
│   └── public/
├── docs/            # Research, requirements, features, plan
└── server/          # (future) Express API
```

---

## Phase 1: Shared Layout & Foundation

- [x] React + Vite + React Router setup
- [x] Global styles + CSS variables (colors, fonts, spacing)
- [x] Shared layout: Header (logo, nav), Footer
- [x] Mobile nav / hamburger menu
- [x] Sticky mobile "Call Us" button

---

## Phase 2: Customer-Facing Pages

### Landing Page
- [x] Hero section (headline, sub-headline, CTA)
- [x] Trust bar (3 badges)
- [x] Featured laptops (from mock data)
- [x] Google Maps embed
- [x] Address + phone + hours
- [x] "View All Laptops" link

### Catalog Page
- [x] Laptop grid with cards
- [x] Sort dropdown
- [x] Filter dropdowns (Brand, RAM)
- [x] Pagination (Previous/Next)
- [x] Load More button
- [x] Results count + Back to Top

### Product Detail Page
- [x] Image gallery (thumbnails → main)
- [x] Lightbox/zoom modal
- [x] Specs table
- [x] Battery gauge
- [x] Refurbishment report
- [x] Status badge
- [x] Reserve button (opens modal)
- [x] WhatsApp share

### Reserve Modal
- [x] Form with validation
- [x] Success/error states
- [x] Auto-close

### Contact Page
- [x] Info display
- [x] Contact form
- [x] Map embed

---

## Phase 3: Admin Panel

### Auth UI
- [x] Login page
- [x] Route protection (mock)
- [x] Logout

### Manage Listings
- [x] Table with all laptops
- [x] Edit / Delete / Mark Sold actions
- [x] Search + filter
- [x] Pagination

### Add/Edit Laptop Form
- [x] Full structured form
- [x] Image upload (mock)
- [x] Validation

### Reservations Dashboard
- [x] Reservations table
- [x] Mark Picked Up / Expired
- [x] Active count

---

## Phase 4: Polish

- [x] Responsive design (mobile, tablet, desktop)
- [x] Loading / empty / error states
- [x] Smooth transitions
- [x] Color-coded badges
- [x] Battery health gauge

---

## Phase 5: API Integration (Done)

- [x] Express server with middleware (cors, helmet, compression, sessions)
- [x] PostgreSQL database (laptops, reservations, contact_messages, users, sessions)
- [x] All API endpoints (laptops CRUD, reservations, contact, auth, upload)
- [x] Client-side API service layer (src/lib/api.js) with localStorage fallback
- [x] Frontend pages updated to fetch from API (with mock data fallback)
- [x] Session-based auth with login/logout/me
- [x] Image upload with sharp compression to WebP
- [x] Email notifications (dev mode logs to console, production uses SMTP)

## Phase 6: Deploy (Future)

- [ ] Deploy backend to VPS/Railway/Render
- [ ] Deploy frontend build to Vercel/Netlify
- [ ] Set up production SMTP for emails
- [ ] Set up domain + SSL
- [ ] Set up S3/cloud storage for images
