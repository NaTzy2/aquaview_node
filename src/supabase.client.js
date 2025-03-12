import supabaseJs from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const {createClient} = supabaseJs

const SUPABASE_URL = process.env.DB_URL
const SUPABASE_PW = process.env.DB_PASSWORD
export const supabase = createClient(SUPABASE_URL, SUPABASE_PW)