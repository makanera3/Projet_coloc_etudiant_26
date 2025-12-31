import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rpavjstuiocvpjcebrrf.supabase.co";

// 2️⃣ COLLE ICI la anon public key
const supabaseAnonKey = "sb_publishable_QQV5jWFaqPbaJCwh74lWrg_A6PB6yMk";

// Création du client Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);