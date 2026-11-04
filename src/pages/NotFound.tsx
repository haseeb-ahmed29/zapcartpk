import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="max-w-md w-full text-center bg-card p-8 rounded-xl shadow-[var(--card-shadow)] border border-border">
        <h1 className="mb-2 text-5xl font-bold font-display text-card-foreground">404</h1>
        <p className="text-xl font-medium text-card-foreground mb-2">Oops! Page not found</p>
        <p className="text-sm text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
