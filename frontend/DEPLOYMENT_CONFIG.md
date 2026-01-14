# Deployment Configuration for /vizy/ Subdirectory

This document outlines the configuration changes made for deploying the Vizy app under the `/vizy/` subdirectory on Netlify.

## Changes Made

### 1. Vite Configuration (`vite.config.ts`)

**Changed:**
```typescript
base: "/vizy/", // Base path for deployment under /vizy/ subdirectory
```

**Impact:**
- All asset paths (JS, CSS, images) are automatically prefixed with `/vizy/`
- Vite rewrites all asset references during build
- HTML file references are updated automatically

### 2. React Router Configuration (`src/App.tsx`)

**Changed:**
```typescript
<Router basename="/vizy">
```

**Impact:**
- All routes are prefixed with `/vizy/`
- Navigation works correctly under the subdirectory
- Browser history is handled properly

### 3. Netlify Redirects (`public/_redirects`)

**Updated with proper SPA redirects:**
- Static assets (JS, CSS, images) are served directly with 200 status
- `manifest.json` is served as JSON (not redirected)
- Service worker (`sw.js`) is served directly
- All other routes redirect to `index.html` for SPA routing

**Key Rules:**
```
/vizy/assets/* 200          # Asset files
/vizy/*.js 200              # JavaScript files
/vizy/*.css 200             # CSS files
/vizy/manifest.json 200     # Manifest (served as JSON)
/vizy/sw.js 200             # Service worker
/vizy/* /vizy/index.html 200 # SPA routing
```

### 4. Manifest.json (`public/manifest.json`)

**Updated paths:**
- `start_url`: `/vizy/`
- `scope`: `/vizy/`
- All icon paths: `/vizy/VIZY.png`, `/vizy/vizy.svg`
- Shortcut URLs: `/vizy/reminders`, `/vizy/`

### 5. Index.html

**Updated references:**
- Manifest link: `/vizy/manifest.json`
- Favicon: `/vizy/vizy.png`
- Apple touch icon: `/vizy/vizy.png`
- Service worker registration: `/vizy/sw.js` with scope `/vizy/`

## How It Works

1. **Build Process:**
   - Vite builds with `base: "/vizy/"`
   - All asset paths are automatically prefixed
   - HTML references are updated

2. **Netlify Deployment:**
   - Files are deployed to `/vizy/` directory
   - `_redirects` file ensures proper routing
   - Static assets are served directly
   - SPA routes redirect to `index.html`

3. **Runtime:**
   - React Router uses `basename="/vizy"` for routing
   - All navigation is relative to `/vizy/`
   - Service worker scope is `/vizy/`

## Testing

After deployment, verify:

1. **Asset Loading:**
   - Open browser DevTools → Network tab
   - Check that JS/CSS files load from `/vizy/assets/`
   - Verify no 404 errors

2. **Routing:**
   - Navigate to `/vizy/`
   - Test all routes (login, home, settings, etc.)
   - Verify browser back/forward buttons work

3. **Manifest:**
   - Check `/vizy/manifest.json` loads correctly
   - Verify it's served with `Content-Type: application/json`
   - Test PWA installation

4. **Service Worker:**
   - Check `/vizy/sw.js` loads correctly
   - Verify service worker registers with correct scope

## Troubleshooting

### Assets Not Loading
- Check that `base: "/vizy/"` is set in `vite.config.ts`
- Verify `_redirects` file is in `public/` directory
- Ensure Netlify is serving files from `/vizy/` directory

### Routes Not Working
- Verify `basename="/vizy"` in Router component
- Check that `_redirects` has the SPA redirect rule
- Ensure redirect rule is last (most specific rules first)

### Manifest Not Loading
- Check `/vizy/manifest.json` is accessible
- Verify `_redirects` has `/vizy/manifest.json 200` rule
- Check browser console for errors

## Notes

- The `base` path must end with `/` (e.g., `/vizy/` not `/vizy`)
- Router `basename` should not have trailing slash (e.g., `/vizy` not `/vizy/`)
- All paths in `manifest.json` must use absolute paths starting with `/vizy/`
- Service worker scope must match the base path
