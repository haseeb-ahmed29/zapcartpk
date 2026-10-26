# Sentinel Security Journal

## 2026-03-08 - Supabase Client Environment Variable Validation
**Vulnerability:** Supabase client was created directly using `import.meta.env` variables without checking if they are defined. If missing, `createClient` was invoked with `undefined` parameters, causing confusing runtime failures during authentication or query executions.
**Learning:** In frontend client SDKs (like `@supabase/supabase-js`), missing environment configuration at build or runtime should fail fast with clear errors before any network requests or auth operations attempt to run.
**Prevention:** Always validate critical environment variables at client instantiation time before initializing external service SDKs.
