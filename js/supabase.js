const SUPABASE_URL =
    "https://udbxxyzwhruqtmhdfpmw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_C7VAE7U9TcEKSKbH1ZHcwA_Bb3hD3Co";


/* =====================================================
   SUPABASE CLIENT
===================================================== */

window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


console.log("================================");
console.log("SUPABASE CLIENT READY");
console.log("================================");