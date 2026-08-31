/* =====================================================
   BÁCH SƠN TỬU
   PRODUCT API
   SUPABASE
   CACHE-FIRST + BACKGROUND UPDATE
===================================================== */


/* =====================================================
   1. SUPABASE CLIENT
===================================================== */

function getSupabaseClient() {

    if (!window.supabaseClient) {

        console.error(
            "PRODUCT API: SUPABASE CLIENT KHÔNG TỒN TẠI."
        );

        return null;
    }

    return window.supabaseClient;
}


/* =====================================================
   2. CACHE
===================================================== */

const PRODUCT_CACHE_KEY =
    "bachson_products_cache";


/*
   Thời gian cache:
   5 phút
*/

const PRODUCT_CACHE_TIME =
    5 * 60 * 1000;


/* =====================================================
   3. ĐỌC CACHE
===================================================== */

function getProductsFromCache() {

    try {

        const saved =
            localStorage.getItem(
                PRODUCT_CACHE_KEY
            );


        /* Không có cache */

        if (!saved) {

            return null;

        }


        const cache =
            JSON.parse(saved);


        /* Cache không hợp lệ */

        if (
            !cache ||
            !Array.isArray(cache.data)
        ) {

            return null;

        }


        return cache;

    }
    catch (error) {

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

                timestamp:
                    Date.now(),

                data:
                    data

            })

        );

        console.log(
            "Đã lưu sản phẩm vào cache."
        );

    }
    catch (error) {

        console.error(
            "Lỗi lưu cache sản phẩm:",
            error
        );

    }

}


/* =====================================================
   5. TẠO SLUG
===================================================== */

function createProductSlug(name) {

    if (!name) {

        return "";

    }


    return name

        .toString()

        /* Bỏ dấu */

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        /* Chữ thường */

        .toLowerCase()

        /* Xóa khoảng trắng đầu cuối */

        .trim()

        /* đ → d */

        .replace(
            /đ/g,
            "d"
        )

        /* Chỉ giữ chữ, số và dấu - */

        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )

        /* Khoảng trắng → - */

        .replace(
            /\s+/g,
            "-"
        )

        /* Nhiều - → một - */

        .replace(
            /-+/g,
            "-"
        );

}

/* =====================================================
   CHUYỂN MÃ DANH MỤC → TÊN HIỂN THỊ
===================================================== */

function getCategoryName(category) {

    if (!category) {
        return "";
    }

    const categoryMap = {

        "ruou-sim-u-chum":
            "RƯỢU SIM Ủ CHUM",

        "ruou-truyen-thong":
            "RƯỢU TRUYỀN THỐNG",

        "ruou-trai-cay":
            "RƯỢU TRÁI CÂY",

        "qua-tang":
            "QUÀ TẶNG",

        "ruou-nau-thu-cong":
            "RƯỢU NẤU THỦ CÔNG",

        "ruou-nho-u-chum":
            "RƯỢU NHO Ủ CHUM"
    };

    return (
        categoryMap[category] ||
        category
    );
}

/* =====================================================
   6. CHUẨN HÓA DỮ LIỆU
      SUPABASE
          ↓
      WEBSITE FORMAT
===================================================== */

function normalizeProduct(product) {

    if (!product) {

        return null;

    }


    return {

        /* =================================================
           ID
        ================================================= */

        id:
            product.id || "",


        /* =================================================
           MÃ SẢN PHẨM
        ================================================= */

        productCode:
            product.product_code || "",


        /* =================================================
           TÊN
        ================================================= */

        name:
            product.name || "",


        /* =================================================
           SLUG
        ================================================= */

        slug:
            product.slug ||
            createProductSlug(
                product.name
            ),


        /* =================================================
           DANH MỤC
        ================================================= */

        category:
            getCategoryName(
                product.category ||
                product.category_id ||
                "",
            ),

        /* =================================================
           DUNG TÍCH
        ================================================= */

        volume:
            product.volume || "",


        /* =================================================
           GIÁ BÁN
        ================================================= */

        price:
            Number(
                product.price ?? 0
            ),


        /* =================================================
           GIÁ CŨ
        ================================================= */

        oldPrice:
            Number(
                product.old_price ?? 0
            ),


        /* =================================================
           GIÁ VỐN
           Chủ yếu dùng cho quản trị
        ================================================= */

        costPrice:
            Number(
                product.cost_price ?? 0
            ),


        /* =================================================
           HÌNH ẢNH
        ================================================= */

        image:
            String(product.image_url || "").trim(),


        /* =================================================
           MÔ TẢ NGẮN
        ================================================= */

        shortDescription:
            product.short_description ||
            product.description ||
            "",


        /* =================================================
           MÔ TẢ CHI TIẾT
        ================================================= */

        description:
            product.description || "",


        /* =================================================
           TỒN KHO
        ================================================= */

        stock:
            Number(
                product.stock ?? 0
            ),


        /* =================================================
           TRẠNG THÁI
        ================================================= */

        status:
            product.status || "Active",


        /* =================================================
           SẢN PHẨM NỔI BẬT
        ================================================= */

        featured:
            product.featured === true ||
            product.featured === "true",


        /* =================================================
           NGÀY TẠO
        ================================================= */

        createdAt:
            product.created_at || null

    };

}


/* =====================================================
   7. TẢI SẢN PHẨM TỪ SUPABASE
===================================================== */

async function fetchProductsFromSupabase() {

    console.log(
        "Đang tải sản phẩm từ Supabase..."
    );


    /* =================================================
       LẤY CLIENT
    ================================================= */

    const supabaseClient =
        getSupabaseClient();


    if (!supabaseClient) {

        throw new Error(
            "Supabase client chưa được khởi tạo."
        );

    }


    /* =================================================
       TRUY VẤN PRODUCTS
    ================================================= */

    const {
        data,
        error
    } = await supabaseClient

        .from("products")

        .select(`
            id,
            product_code,
            name,
            slug,
            category,
            volume,
            price,
            old_price,
            cost_price,
            image_url,
            short_description,
            description,
            stock,
            status,
            featured,
            created_at
        `)

        /*
           Chỉ lấy sản phẩm đang hoạt động
        */

        .eq(
            "status",
            "Active"
        )

        /*
           Sản phẩm mới tạo trước
        */

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    /* =================================================
       KIỂM TRA LỖI SUPABASE
    ================================================= */

    if (error) {

        console.error(
            "SUPABASE PRODUCT ERROR:",
            error
        );

        throw new Error(
            error.message ||
            "Không thể tải sản phẩm từ Supabase."
        );

    }


    /* =================================================
       KIỂM TRA DATA
    ================================================= */

    if (!Array.isArray(data)) {

        throw new Error(
            "Dữ liệu sản phẩm từ Supabase không hợp lệ."
        );

    }


    console.log(
        `Supabase trả về ${data.length} sản phẩm.`
    );


    /* =================================================
       NORMALIZE
    ================================================= */

    const normalizedProducts =
        data

            .map(
                normalizeProduct
            )

            .filter(
                product =>
                    product !== null
            );


    /* =================================================
       DEBUG
    ================================================= */

    if (
        normalizedProducts.length > 0
    ) {

        console.log(
            "Sản phẩm sau normalize:",
            normalizedProducts[0]
        );

    }


    return normalizedProducts;

}


/* =====================================================
   8. CẬP NHẬT SẢN PHẨM Ở NỀN
===================================================== */

async function updateProductsInBackground() {

    try {

        console.log(
            "Đang cập nhật sản phẩm từ Supabase ở nền..."
        );


        /* =================================================
           TẢI DỮ LIỆU MỚI
        ================================================= */

        const freshData =
            await fetchProductsFromSupabase();


        /* =================================================
           LƯU CACHE
        ================================================= */

        saveProductsToCache(
            freshData
        );


        console.log(
            "Đã cập nhật sản phẩm từ Supabase."
        );


        /* =================================================
           THÔNG BÁO CHO PRODUCTS.JS
        ================================================= */

        window.dispatchEvent(

            new CustomEvent(
                "productsUpdated",
                {
                    detail:
                        freshData
                }
            )

        );

    }
    catch (error) {

        console.warn(
            "Không thể cập nhật sản phẩm nền:",
            error
        );

    }

}


/* =====================================================
   9. HÀM CHÍNH
===================================================== */

async function getProducts() {

    /* =================================================
       ĐỌC CACHE
    ================================================= */

    const cache =
        getProductsFromCache();


    /* =================================================
       TRƯỜNG HỢP 1
       CÓ CACHE
    ================================================= */

    if (cache) {

        const cacheAge =
            Date.now() -
            Number(
                cache.timestamp || 0
            );


        /* =================================================
           CACHE CÒN HẠN
        ================================================= */

        if (
            cacheAge <
            PRODUCT_CACHE_TIME
        ) {

            console.log(
                "Sử dụng sản phẩm từ cache."
            );


            return cache.data;

        }


        /* =================================================
           CACHE ĐÃ CŨ
        ================================================= */

        console.log(
            "Cache đã cũ. Cập nhật Supabase ở nền..."
        );


        /*
           Không bắt người dùng chờ.
           Trả cache cũ trước.
        */

        updateProductsInBackground();


        return cache.data;

    }


    /* =================================================
       TRƯỜNG HỢP 2
       CHƯA CÓ CACHE
    ================================================= */

    console.log(
        "Chưa có cache. Đang tải sản phẩm từ Supabase..."
    );


    const freshData =
        await fetchProductsFromSupabase();


    /* =================================================
       LƯU CACHE
    ================================================= */

    saveProductsToCache(
        freshData
    );


    return freshData;

}


/* =====================================================
   10. XÓA CACHE
===================================================== */

function clearProductsCache() {

    localStorage.removeItem(
        PRODUCT_CACHE_KEY
    );


    console.log(
        "Đã xóa cache sản phẩm."
    );

}


/* =====================================================
   11. FORCE REFRESH
   Dùng khi muốn tải lại ngay
===================================================== */

async function refreshProducts() {

    try {

        console.log(
            "Đang tải lại sản phẩm..."
        );


        const freshData =
            await fetchProductsFromSupabase();


        saveProductsToCache(
            freshData
        );


        /*
           Thông báo cho products.js
        */

        window.dispatchEvent(

            new CustomEvent(
                "productsUpdated",
                {
                    detail:
                        freshData
                }
            )

        );


        console.log(
            `Đã tải lại ${freshData.length} sản phẩm.`
        );


        return freshData;

    }
    catch (error) {

        console.error(
            "Không thể refresh sản phẩm:",
            error
        );


        return [];

    }

}


/* =====================================================
   12. TÌM SẢN PHẨM THEO ID
===================================================== */

async function getProductById(productId) {

    const products =
        await getProducts();


    if (!Array.isArray(products)) {

        return null;

    }


    return products.find(

        product =>
            String(product.id).trim() ===
            String(productId).trim()

    ) || null;

}


/* =====================================================
   13. TÌM SẢN PHẨM THEO SLUG
===================================================== */

async function getProductBySlug(slug) {

    const products =
        await getProducts();


    if (!Array.isArray(products)) {

        return null;

    }


    return products.find(

        product =>
            String(product.slug).trim() ===
            String(slug).trim()

    ) || null;

}


/* =====================================================
   14. TÌM SẢN PHẨM THEO PRODUCT CODE
===================================================== */

async function getProductByCode(productCode) {

    const products =
        await getProducts();


    if (!Array.isArray(products)) {

        return null;

    }


    return products.find(

        product =>
            String(
                product.productCode
            ).trim() ===
            String(
                productCode
            ).trim()

    ) || null;

}


/* =====================================================
   15. DEBUG PRODUCT API
===================================================== */

function debugProductAPI() {

    const cache =
        getProductsFromCache();


    console.group(
        "BÁCH SƠN TỬU - PRODUCT API DEBUG"
    );


    console.log(
        "Cache key:",
        PRODUCT_CACHE_KEY
    );


    console.log(
        "Cache:",
        cache
    );


    if (cache) {

        const cacheAge =
            Date.now() -
            Number(
                cache.timestamp || 0
            );


        console.log(
            "Cache age:",
            cacheAge,
            "ms"
        );


        console.log(
            "Cache còn hạn:",
            cacheAge <
            PRODUCT_CACHE_TIME
        );


        console.log(
            "Số sản phẩm:",
            cache.data.length
        );

    }


    console.groupEnd();

}


/* =====================================================
   16. KHỞI ĐỘNG PRODUCT API
===================================================== */

console.log(
    "================================="
);

console.log(
    "BÁCH SƠN TỬU - PRODUCT API"
);

console.log(
    "SUPABASE PRODUCT SYSTEM READY"
);

console.log(
    "CACHE-FIRST + BACKGROUND UPDATE"
);

console.log(
    "================================="
);