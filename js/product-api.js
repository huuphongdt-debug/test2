/* =====================================================
   BÁCH SƠN TỬU
   PRODUCT API
   CACHE-FIRST + BACKGROUND UPDATE
===================================================== */


/* =====================================================
   1. GOOGLE SHEETS API
===================================================== */

const PRODUCT_API_URL =
    "https://script.google.com/macros/s/AKfycbzg8M1Q-2GtK9Noe_IuvYwMehzPYOwyTeUfNWHUTKdl0bF4m0lq4auEpQRzjbgGXbJl/exec";


/* =====================================================
   2. CACHE
===================================================== */

const PRODUCT_CACHE_KEY =
    "bachson_products_cache";

const PRODUCT_CACHE_TIME =
    5 * 60 * 1000; // 5 phút


/* =====================================================
   3. ĐỌC CACHE
===================================================== */

function getProductsFromCache() {

    try {

        const saved =
            localStorage.getItem(
                PRODUCT_CACHE_KEY
            );

        if (!saved) {
            return null;
        }

        const cache =
            JSON.parse(saved);

        if (
            !cache ||
            !Array.isArray(cache.data)
        ) {
            return null;
        }

        return cache;

    } catch (error) {

        console.error(
            "Lỗi đọc cache sản phẩm:",
            error
        );

        return null;
    }
}


/* =====================================================
   4. LƯU CACHE
===================================================== */

function saveProductsToCache(data) {

    try {

        localStorage.setItem(
            PRODUCT_CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                data: data
            })
        );

    } catch (error) {

        console.error(
            "Lỗi lưu cache sản phẩm:",
            error
        );
    }
}


/* =====================================================
   5. GỌI GOOGLE SHEETS
===================================================== */

async function fetchProductsFromGoogle() {

    const response =
        await fetch(
            PRODUCT_API_URL,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Không thể tải dữ liệu từ Google Sheets."
        );

    }


    const data =
        await response.json();


    if (!Array.isArray(data)) {

        throw new Error(
            "Dữ liệu sản phẩm không hợp lệ."
        );

    }


    return data;
}


/* =====================================================
   6. CẬP NHẬT GOOGLE SHEETS Ở NỀN
===================================================== */

async function updateProductsInBackground() {

    try {

        const freshData =
            await fetchProductsFromGoogle();


        /* Lưu cache mới */

        saveProductsToCache(
            freshData
        );


        console.log(
            "Đã cập nhật sản phẩm từ Google Sheets."
        );


        /*
           Thông báo cho products.js
           dữ liệu mới đã có
        */

        window.dispatchEvent(
            new CustomEvent(
                "productsUpdated",
                {
                    detail: freshData
                }
            )
        );


    } catch (error) {

        console.warn(
            "Không thể cập nhật dữ liệu nền:",
            error
        );

    }

}


/* =====================================================
   7. HÀM CHÍNH
===================================================== */

async function getProducts() {

    const cache =
        getProductsFromCache();


    /* =================================================
       CÓ CACHE
    ================================================= */

    if (cache) {

        const cacheAge =
            Date.now() -
            Number(cache.timestamp || 0);


        /*
           CACHE CÒN MỚI
           → dùng ngay
           → không cần gọi Google
        */

        if (
            cacheAge <
            PRODUCT_CACHE_TIME
        ) {

            return cache.data;

        }


        /*
           CACHE CŨ
           → vẫn dùng ngay
           → Google Sheets cập nhật nền
        */

        updateProductsInBackground();


        return cache.data;
    }


    /* =================================================
       CHƯA CÓ CACHE
    ================================================= */

    console.log(
        "Chưa có cache. Đang tải sản phẩm..."
    );


    const freshData =
        await fetchProductsFromGoogle();


    saveProductsToCache(
        freshData
    );


    return freshData;
}


/* =====================================================
   8. XÓA CACHE KHI CẦN
===================================================== */

function clearProductsCache() {

    localStorage.removeItem(
        PRODUCT_CACHE_KEY
    );

    console.log(
        "Đã xóa cache sản phẩm."
    );
}