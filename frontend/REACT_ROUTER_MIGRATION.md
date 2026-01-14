# React Router Data Router Migration Guide

This document outlines the migration path from the current React Router setup to React Router v7's data router pattern.

## Current Setup

Currently using:
- `BrowserRouter` with JSX route definitions
- Component-based routing
- Manual data fetching in components

## Benefits of Data Router Migration

1. **Automatic Code Splitting**: Routes are automatically code-split
2. **Parallel Data Loading**: Loaders run in parallel, improving performance
3. **Optimistic UI Updates**: Built-in support for optimistic updates
4. **Better Error Handling**: Route-level error boundaries
5. **Type Safety**: Better TypeScript support with typed loaders

## Migration Steps

### 1. Update Router Setup

**Before:**
```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
```

**After:**
```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader, // Optional: pre-fetch data
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### 2. Add Loaders for Data Fetching

**Example:**
```tsx
// Load user profile data before rendering Home
async function homeLoader() {
  const { currentUser } = await getAuth();
  if (!currentUser) {
    throw redirect("/login");
  }
  
  const profile = await getUserProfile(currentUser.uid);
  return { profile };
}

// In Home component
function Home() {
  const { profile } = useLoaderData();
  // Use profile data
}
```

### 3. Migrate Protected Routes

**Before:**
```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
```

**After:**
```tsx
{
  path: "/",
  element: <Home />,
  loader: async () => {
    const { currentUser } = await getAuth();
    if (!currentUser) {
      throw redirect("/login");
    }
    return {};
  },
}
```

### 4. Add Error Boundaries

```tsx
{
  path: "/",
  element: <Home />,
  loader: homeLoader,
  errorElement: <ErrorPage />, // Route-level error boundary
}
```

## Recommended Migration Order

1. **Phase 1**: Migrate router setup (low risk)
   - Replace `BrowserRouter` with `createBrowserRouter`
   - Keep existing components unchanged

2. **Phase 2**: Add loaders for main routes (medium risk)
   - Home page
   - Settings page
   - User profile data

3. **Phase 3**: Add error boundaries (low risk)
   - Route-level error handling
   - Global error boundary

4. **Phase 4**: Optimize with deferred data (advanced)
   - Use `defer()` for non-critical data
   - Implement Suspense boundaries

## Example: Complete Migration

```tsx
import { createBrowserRouter, RouterProvider, useLoaderData } from "react-router-dom";
import { lazy } from "react";
import { getAuth } from "firebase/auth";
import { getUserProfile } from "./services/userProfileService";

// Lazy load components
const Home = lazy(() => import("./components/home-component/home"));
const Settings = lazy(() => import("./components/settings-component/settings"));

// Loaders
async function homeLoader() {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw redirect("/login");
  }
  
  const profile = await getUserProfile(user.uid);
  return { profile };
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/settings",
    element: <Settings />,
    loader: async () => {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw redirect("/login");
      }
      return {};
    },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

## Considerations

1. **Context Providers**: Keep them outside the router
2. **Authentication**: Handle in loaders or middleware
3. **Code Splitting**: Already handled with lazy loading
4. **TypeScript**: Use typed loaders for better type safety

## Resources

- [React Router v7 Documentation](https://reactrouter.com/)
- [Data Router Guide](https://reactrouter.com/en/main/routers/create-browser-router)
- [Loader Documentation](https://reactrouter.com/en/main/route/loader)
