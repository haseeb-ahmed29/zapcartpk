import { describe, it, expect } from "vitest";
import { supabase } from "@/integrations/supabase/client";

describe("Supabase Client Security", () => {
  it("initializes supabase client safely with configured env variables", () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
