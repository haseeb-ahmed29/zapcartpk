import { describe, it, expect } from "vitest";
import { supabase, validateSupabaseUrl } from "@/integrations/supabase/client";

describe("Supabase Client Security", () => {
  it("initializes supabase client safely with configured env variables", () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  describe("validateSupabaseUrl (CWE-319 Protocol Validation)", () => {
    it("accepts valid https URL", () => {
      expect(validateSupabaseUrl("https://project.supabase.co")).toBe("https://project.supabase.co");
    });

    it("accepts local http URL for local development", () => {
      expect(validateSupabaseUrl("http://localhost:54321")).toBe("http://localhost:54321");
      expect(validateSupabaseUrl("http://127.0.0.1:54321")).toBe("http://127.0.0.1:54321");
    });

    it("rejects unencrypted remote http URL to prevent cleartext credential leakage", () => {
      expect(() => validateSupabaseUrl("http://project.supabase.co")).toThrow(
        /Insecure Supabase URL protocol: 'http:'. Must use 'https:'./
      );
    });

    it("rejects unsafe non-http schemes like javascript: or ftp:", () => {
      expect(() => validateSupabaseUrl("javascript:alert(1)")).toThrow(/Insecure Supabase URL protocol/);
      expect(() => validateSupabaseUrl("ftp://supabase.co")).toThrow(/Insecure Supabase URL protocol/);
    });

    it("rejects malformed URLs", () => {
      expect(() => validateSupabaseUrl("not-a-valid-url")).toThrow(/Invalid Supabase URL format/);
    });
  });
});
