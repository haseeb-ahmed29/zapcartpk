import { useLocation } from "react-router-dom";
import { useEffect } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
