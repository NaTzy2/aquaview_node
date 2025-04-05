import supabaseJs from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const { createClient } = supabaseJs;

const SUPABASE_URL = process.env.DB_URL;
const SUPABASE_KEY = process.env.DB_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase credentials in environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
