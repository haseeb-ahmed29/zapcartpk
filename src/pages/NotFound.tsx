import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, FileQuestion } from "lucide-react";

// Security: Sanitize pathname to prevent Log Injection / CRLF Injection (CWE-117)
// Removes carriage returns, line feeds, and ASCII control characters (0-31, 127)
const sanitizePath = (path: string): string =>
  Array.from(path)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    const sanitizedPath = sanitizePath(location.pathname);
    console.error("404 Error: User attempted to access non-existent route:", sanitizedPath);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md p-6 bg-card rounded-xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
          <FileQuestion className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-4xl font-display font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
