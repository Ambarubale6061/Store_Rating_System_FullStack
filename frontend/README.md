# Store Rating System — Frontend

React + Vite + TypeScript SPA for the Store Rating System, covering all three roles (Admin, User, Store Owner) behind a single login, plus a public marketing landing page for signed-out visitors.

## Stack

React, Vite, TypeScript, React Router, Axios, React Hook Form, Zod, Tailwind CSS v4, TanStack Table, React Hot Toast, lucide-react.

## Getting started

```bash
npm install
cp .env.example .env   # points VITE_API_BASE_URL at the backend, default http://localhost:5000/api
npm run dev             # http://localhost:5173
```

Make sure the backend is running and seeded first (see the backend's own README / setup guide — this frontend expects it at `VITE_API_BASE_URL`).

## Structure

```
src/
  components/
    common/    Button, Input, Modal, Pagination, SearchBar, StarRating, RoleBadge, EmptyState, ErrorState, Skeleton, PageLoader
    forms/     LoginForm, SignupForm, ChangePasswordForm, UserForm, StoreForm
    landing/   LandingNavbar, HeroSection, FeaturesSection, AboutSection, ContactSection, LandingFooter
    layout/    Navbar, Sidebar (authenticated dashboard shell)
    tables/    DataTable (TanStack Table wrapper, server-side sort/paginate)
  pages/
    LandingPage.tsx    Public marketing page (hero, features, about, contact) for signed-out visitors
    HomePage.tsx       Root route ("/") — shows LandingPage to guests, redirects signed-in users to their dashboard
    auth/      LoginPage, SignupPage
    admin/     AdminDashboardPage, AdminUsersPage, AdminUserDetailPage, AdminStoresPage
    user/      UserStoresPage
    storeOwner/ StoreOwnerDashboardPage
  layouts/     AuthLayout (split-screen branding + form), DashboardLayout (Navbar + Sidebar shell)
  routes/      ProtectedRoute, RoleProtectedRoute, GuestRoute
  context/     AuthContext (tokens, current user, login/signup/logout)
  hooks/       useAuth, useDebounce
  services/    apiClient (Axios + token refresh), authService, userService, storeService, ratingService, dashboardService
  utils/       validationSchemas (Zod — mirrors backend rules exactly)
  types/       auth, user, store, rating, api
```

## Route protection

Every route in the app falls into exactly one of three guards, so there is no path that can be reached without going through an authentication/authorization check:

- **`GuestRoute`** — wraps `/login` and `/signup`. If a user is already authenticated and types either URL directly, they're redirected to `/` (which sends them to their dashboard) instead of seeing the auth forms again.
- **`ProtectedRoute`** — wraps every dashboard route (`/change-password` and everything nested under it). If there's no authenticated user, it redirects to `/login`, **remembering the originally-requested URL** so `LoginForm` can send the user back there after a successful login instead of always dropping them on `/`.
- **`RoleProtectedRoute`** — nested inside `ProtectedRoute`, scoped per role (`/admin/*` → `ADMIN`, `/user/*` → `USER`, `/store-owner/*` → `STORE_OWNER`). An authenticated user of the wrong role is redirected to `/unauthorized` rather than seeing the page.

All three guards check `isLoading` from `AuthContext` first and render a `PageLoader` while it's true — this prevents a flash of protected content (or an incorrect redirect) during the brief moment on page load where the app is still verifying an existing token against `/auth/me`.

**Note on defense in depth:** these guards stop the _UI_ from rendering to someone who shouldn't see it, which is what this pass focused on. The actual data is only ever as safe as the API serving it — and every endpoint here is independently protected server-side by JWT verification and role checks in the backend, so even a direct API call (bypassing the frontend entirely) is rejected the same way. Route guards and API auth are both required; neither alone is sufficient.

## Notable behavior

- **Token refresh**: on a 401 from an expired access token, the Axios response interceptor silently exchanges the refresh token once and retries the original request; if that also fails, it clears tokens and redirects to `/login`.
- **Rating submission**: clicking a star in the "My Rating" column on the User's store list calls the same submit endpoint whether it's a first-time rating or an update (the backend upserts).
- **Search & sort** on every admin/user list are server-side (debounced search, click-to-sort column headers) so they scale with real data instead of loading everything client-side.

## Scripts

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build locally     |
