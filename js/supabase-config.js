// ==========================================
// BÁCH SƠN TỬU - SUPABASE CONFIG
// ==========================================

(function () {

    "use strict";

    console.log("=================================");
    console.log("ĐANG KHỞI TẠO SUPABASE CLIENT...");
    console.log("=================================");


    // ==========================================
    // 1. KIỂM TRA SUPABASE LIBRARY
    // ==========================================

    if (!window.supabase) {

        console.error(
            "SUPABASE CONFIG: KHÔNG TÌM THẤY SUPABASE LIBRARY."
        );

        console.error(
            "Hãy kiểm tra <script src=\"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2\"></script>"
        );

        return;
    }


    // ==========================================
    // 2. THÔNG TIN SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://udbxxyzwhruqtmhdfpmw.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_C7VAE7U9TcEKSKbH1ZHcwA_Bb3hD3Co";


    // ==========================================
    // 3. KIỂM TRA THÔNG TIN
    // ==========================================

    if (
        !SUPABASE_URL ||
        !SUPABASE_KEY
    ) {

        console.error(
            "SUPABASE CONFIG: THIẾU SUPABASE URL HOẶC KEY."
        );

        return;
    }


    // ==========================================
    // 4. TẠO SUPABASE CLIENT
    // ==========================================

    try {

        window.supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        // ==========================================
        // 5. KIỂM TRA CLIENT
        // ==========================================

        if (!window.supabaseClient) {

            console.error(
                "SUPABASE CONFIG: KHÔNG TẠO ĐƯỢC CLIENT."
            );

            return;
        }


        console.log(
            "SUPABASE CLIENT READY"
        );

        console.log(
            "Supabase URL:",
            SUPABASE_URL
        );

        console.log(
            "================================="
        );


    }
    catch (error) {

        console.error(
            "SUPABASE CONFIG ERROR:",
            error
        );

    }

})();