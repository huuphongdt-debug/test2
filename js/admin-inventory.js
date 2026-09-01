console.log("=================================");
console.log("ADMIN INVENTORY JS: ĐÃ KẾT NỐI");
console.log("=================================");

console.log(
    "SUPABASE CLIENT:",
    supabaseClient
);

if (!supabaseClient) {

    console.error(
        "❌ KHÔNG TÌM THẤY SUPABASE CLIENT"
    );

} else {

    console.log(
        "✅ SUPABASE CLIENT OK"
    );

}


/* =====================================================
   BƯỚC 3.2.4
   ĐỌC DỮ LIỆU TỒN KHO
===================================================== */

async function loadInventoryData() {

    console.log("=================================");
    console.log("KHO: ĐANG ĐỌC INVENTORY");
    console.log("=================================");


    const {
        data,
        error
    } = await supabaseClient
        .from("inventory")
        .select(`
            id,
            product_id,
            quantity,
            updated_at
        `);


    if (error) {

        console.error(
            "❌ LỖI ĐỌC INVENTORY:",
            error
        );

        return;

    }


    console.log(
        "✅ INVENTORY DATA:",
        data
    );


    console.log(
        "SỐ DÒNG INVENTORY:",
        data.length
    );


    const totalQuantity =
        data.reduce(
            function(total, item) {

                return (
                    total +
                    (Number(item.quantity) || 0)
                );

            },
            0
        );


    console.log(
        "📦 TỔNG SỐ LƯỢNG TỒN:",
        totalQuantity
    );

    /* =========================================
   HIỂN THỊ TỔNG TỒN LÊN DASHBOARD
========================================= */

const totalStockElement =
    document.getElementById(
        "inventoryTotalQuantity"
    );

if (totalStockElement) {

    totalStockElement.textContent =
        totalQuantity.toLocaleString(
            "vi-VN"
        );

}

}



/* =====================================================
   BƯỚC 3.2.5
   LẤY GIÁ VỐN SẢN PHẨM
===================================================== */

async function loadInventoryValue() {

    console.log("=================================");
    console.log("KHO: ĐANG TẢI GIÁ VỐN");
    console.log("=================================");


    /* =========================================
       1. LẤY INVENTORY
    ========================================= */

    const {
        data: inventoryData,
        error: inventoryError
    } = await supabaseClient
        .from("inventory")
        .select(`
            product_id,
            quantity
        `);


    if (inventoryError) {

        console.error(
            "❌ LỖI INVENTORY:",
            inventoryError
        );

        return;

    }


    /* =========================================
       2. LẤY PRODUCTS
    ========================================= */

    const {
        data: productsData,
        error: productsError
    } = await supabaseClient
        .from("products")
        .select(`
            id,
            product_code,
            name,
            cost_price
        `);


    if (productsError) {

        console.error(
            "❌ LỖI PRODUCTS:",
            productsError
        );

        return;

    }


    console.log(
        "✅ PRODUCTS DATA:",
        productsData
    );


    /* =========================================
       3. TÍNH GIÁ TRỊ TỒN
    ========================================= */

    let totalInventoryValue = 0;


    inventoryData.forEach(
        function(item) {

            const product =
                productsData.find(
                    function(product) {

                        return (
                            product.id ===
                            item.product_id
                        );

                    }
                );


            if (!product) {

                console.warn(
                    "⚠️ Không tìm thấy product:",
                    item.product_id
                );

                return;

            }


            const quantity =
                Number(item.quantity) || 0;


            const costPrice =
                Number(product.cost_price) || 0;


            const itemValue =
                quantity * costPrice;


            totalInventoryValue +=
                itemValue;


            console.log(
                product.product_code,
                "| Tồn:",
                quantity,
                "| Giá vốn:",
                costPrice,
                "| Giá trị:",
                itemValue
            );

        }
    );


    /* =========================================
       4. KẾT QUẢ
    ========================================= */

    console.log(
        "💰 TỔNG GIÁ TRỊ TỒN KHO:",
        totalInventoryValue
    );


    console.log(
        "💰 ĐỊNH DẠNG:",
        totalInventoryValue.toLocaleString(
            "vi-VN"
        ) + "đ"
    );
/* =========================================
   HIỂN THỊ GIÁ TRỊ TỒN LÊN DASHBOARD
========================================= */

const inventoryValueElement =
    document.getElementById(
        "inventoryTotalValue"
    );

if (inventoryValueElement) {

    inventoryValueElement.textContent =
        totalInventoryValue.toLocaleString(
            "vi-VN"
        ) + "đ";

}
}

/* =====================================================
   BƯỚC 3.2.6
   SẢN PHẨM SẮP HẾT HÀNG
===================================================== */

async function loadLowStockProducts() {

    console.log("=================================");
    console.log("KHO: ĐANG KIỂM TRA SẢN PHẨM SẮP HẾT");
    console.log("=================================");

    /* =========================================
       NGƯỠNG SẮP HẾT
    ========================================= */

    const LOW_STOCK_LIMIT = 10;


    /* =========================================
       1. LẤY INVENTORY
    ========================================= */

    const {
        data: inventoryData,
        error: inventoryError
    } = await supabaseClient
        .from("inventory")
        .select(`
            product_id,
            quantity
        `);


    if (inventoryError) {

        console.error(
            "❌ LỖI ĐỌC INVENTORY:",
            inventoryError
        );

        return;

    }


    /* =========================================
       2. LẤY PRODUCTS
    ========================================= */

    const {
        data: productsData,
        error: productsError
    } = await supabaseClient
        .from("products")
        .select(`
            id,
            product_code,
            name,
            stock
        `);


    if (productsError) {

        console.error(
            "❌ LỖI ĐỌC PRODUCTS:",
            productsError
        );

        return;

    }


    /* =========================================
       3. TÌM SẢN PHẨM SẮP HẾT
    ========================================= */

    const lowStockProducts =
        inventoryData
            .map(function(item) {

                const product =
                    productsData.find(
                        function(product) {

                            return (
                                product.id ===
                                item.product_id
                            );

                        }
                    );


                if (!product) {
                    return null;
                }


                return {

                    product_id:
                        product.id,

                    product_code:
                        product.product_code,

                    name:
                        product.name,

                    quantity:
                        Number(item.quantity) || 0

                };

            })
            .filter(function(item) {

                return (
                    item &&
                    item.quantity <=
                    LOW_STOCK_LIMIT
                );

            })
            .sort(function(a, b) {

                return (
                    a.quantity -
                    b.quantity
                );

            });


    console.log(
        "⚠️ SẢN PHẨM SẮP HẾT:",
        lowStockProducts
    );


    /* =========================================
       4. HIỂN THỊ SỐ LƯỢNG
    ========================================= */

    const lowStockCount =
        document.getElementById(
            "inventoryLowStock"
        );


    if (lowStockCount) {

        lowStockCount.textContent =
            lowStockProducts.length;

    }


    /* =========================================
       5. HIỂN THỊ DANH SÁCH
    ========================================= */

    const lowStockList =
        document.getElementById(
            "lowStockList"
        );


    if (!lowStockList) {

        console.warn(
            "⚠️ Không tìm thấy lowStockList"
        );

        return;

    }


    /* =========================================
       KHÔNG CÓ SẢN PHẨM SẮP HẾT
    ========================================= */

    if (
        lowStockProducts.length === 0
    ) {

        lowStockList.innerHTML = `
            <div class="inventory-empty">
                Không có sản phẩm sắp hết hàng.
            </div>
        `;

        return;

    }


    /* =========================================
       HIỂN THỊ DANH SÁCH
    ========================================= */

    lowStockList.innerHTML =
        lowStockProducts
            .map(function(product) {

                return `
                    <div class="low-stock-item">

                        <div class="low-stock-info">

                            <strong>
                                ${product.product_code}
                            </strong>

                            <span>
                                ${product.name}
                            </span>

                        </div>


                        <div class="low-stock-quantity">

                            <strong>
                                ${product.quantity}
                            </strong>

                            <span>
                                sản phẩm
                            </span>

                        </div>

                    </div>
                `;

            })
            .join("");


    console.log(
        "✅ ĐÃ HIỂN THỊ SẢN PHẨM SẮP HẾT"
    );

}

/* =====================================================
   BƯỚC 3.3
   THỐNG KÊ NHẬP KHO
===================================================== */

async function loadStockInStats() {

    console.log("=================================");
    console.log("KHO: ĐANG TẢI THỐNG KÊ NHẬP KHO");
    console.log("=================================");


    /* =========================================
       1. LẤY CÁC PHIẾU NHẬP ĐANG DRAFT
    ========================================= */

    const {
        data: receiptData,
        error: receiptError
    } = await supabaseClient
        .from("stock_receipts")
        .select(`
            id,
            receipt_code,
            status,
            total_value
        `)
        .eq("status", "DRAFT");


    if (receiptError) {

        console.error(
            "❌ LỖI ĐỌC PHIẾU NHẬP:",
            receiptError
        );

        return;

    }


    console.log(
        "📋 PHIẾU NHẬP ĐANG DRAFT:",
        receiptData
    );


    const draftReceiptCount =
        receiptData.length;


    console.log(
        "🚚 SỐ PHIẾU ĐANG NHẬP:",
        draftReceiptCount
    );


    /* =========================================
       2. HIỂN THỊ SỐ PHIẾU ĐANG NHẬP
    ========================================= */

    const incomingCountElement =
        document.getElementById(
            "incomingCount"
        );


    if (incomingCountElement) {

        incomingCountElement.textContent =
            draftReceiptCount.toLocaleString(
                "vi-VN"
            );

    }


    /* =========================================
       3. LẤY GIÁ TRỊ NHẬP THỰC TẾ
    ========================================= */

    const {
        data: movementData,
        error: movementError
    } = await supabaseClient
        .from("stock_movements")
        .select(`
            quantity,
            unit_cost,
            total_value,
            type
        `)
        .eq("type", "IN");


    if (movementError) {

        console.error(
            "❌ LỖI ĐỌC STOCK MOVEMENTS:",
            movementError
        );

        return;

    }


    console.log(
        "📦 GIAO DỊCH NHẬP KHO:",
        movementData
    );


    /* =========================================
       4. TÍNH TỔNG GIÁ TRỊ NHẬP
    ========================================= */

    let totalStockInValue = 0;


    movementData.forEach(
        function(item) {

            totalStockInValue +=
                Number(item.total_value) || 0;

        }
    );


    console.log(
        "💰 TỔNG GIÁ TRỊ NHẬP:",
        totalStockInValue
    );


    /* =========================================
       5. HIỂN THỊ GIÁ TRỊ NHẬP
    ========================================= */

    const stockInValueElement =
        document.getElementById(
            "stockInValue"
        );


    if (stockInValueElement) {

        stockInValueElement.textContent =
            totalStockInValue.toLocaleString(
                "vi-VN"
            ) + "đ";

    }

}

loadInventoryData();
loadInventoryValue();
loadStockInStats();
loadLowStockProducts();
