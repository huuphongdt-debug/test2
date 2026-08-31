/* =====================================================
   CHECKOUT - BÁCH SƠN TỬU
   GIỎ HÀNG → CHECKOUT → GOOGLE SHEETS
===================================================== */


/* =====================================================
   1. BIẾN
===================================================== */

let checkoutProducts = [];

let checkoutCart = [];

/* =====================================================
   3. ĐỊNH DẠNG GIÁ
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(price) || 0
    ) + "đ";

}


/* =====================================================
   4. LẤY GIỎ HÀNG
===================================================== */

function getCheckoutCart() {

    try {

        checkoutCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

    } catch (error) {

        console.error(
            "Lỗi đọc giỏ hàng:",
            error
        );

        checkoutCart = [];

    }

}


/* =====================================================
   5. HIỂN THỊ SẢN PHẨM
===================================================== */

function renderCheckoutItems() {

    const container =
        document.querySelector(
            "#checkoutItems"
        );


    if (!container) {

        console.error(
            "Không tìm thấy #checkoutItems"
        );

        return;

    }


    container.innerHTML = "";


    /* =============================================
       GIỎ HÀNG TRỐNG
    ============================================= */

    if (
        checkoutCart.length === 0
    ) {

        container.innerHTML = `

            <p class="checkout-empty">
                Giỏ hàng của bạn đang trống.
            </p>

        `;

        updateCheckoutTotal(0);

        return;

    }


    let subtotal = 0;


    /* =============================================
       HIỂN THỊ TỪNG SẢN PHẨM
    ============================================= */

    checkoutCart.forEach(
        function (cartItem) {


            const product =
                checkoutProducts.find(
                    function (item) {

                        return (
                            String(item.id).trim() ===
                            String(cartItem.id).trim()
                        );

                    }
                );


            if (!product) {

                console.warn(
                    "Không tìm thấy sản phẩm:",
                    cartItem.id
                );

                return;

            }


            const quantity =
                Number(
                    cartItem.quantity
                ) || 0;


            if (quantity <= 0) {

                return;

            }


            const price =
                Number(
                    product.price
                ) || 0;


            const itemTotal =
                price * quantity;


            subtotal +=
                itemTotal;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "checkout-item";


            item.innerHTML = `

                <div class="checkout-item-image">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name || ""}"
                    >

                </div>


                <div class="checkout-item-info">

                    <h3 class="checkout-item-name">
                        ${product.name || ""}
                    </h3>


                    ${
                        product.volume
                            ? `
                                <span class="checkout-item-volume">
                                    ${product.volume}
                                </span>
                              `
                            : ""
                    }


                    <span class="checkout-item-quantity">
                        Số lượng: ${quantity}
                    </span>

                </div>


                <strong class="checkout-item-price">

                    ${formatPrice(itemTotal)}

                </strong>

            `;


            container.appendChild(
                item
            );

        }
    );


    updateCheckoutTotal(
        subtotal
    );

}


/* =====================================================
   6. TỔNG TIỀN
===================================================== */

function updateCheckoutTotal(
    subtotal
) {

    const subtotalElement =
        document.querySelector(
            ".checkout-subtotal"
        );


    const totalElement =
        document.querySelector(
            ".checkout-total-price"
        );


    const shipping = 0;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(
                subtotal
            );

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                subtotal +
                shipping
            );

    }

}


/* =====================================================
   7. TẠO MÃ ĐƠN HÀNG
===================================================== */

function generateOrderCode() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return `BST-${year}${month}${day}-${random}`;

}


/* =====================================================
   8. KIỂM TRA SỐ ĐIỆN THOẠI
===================================================== */

function validatePhone(phone) {

    const phoneRegex =
        /^(03|05|07|08|09)[0-9]{8}$/;


    return phoneRegex.test(
        phone
    );

}


/* =====================================================
   9. TẠO DỮ LIỆU ĐƠN HÀNG
===================================================== */

function createOrderData() {

    const nameElement =
        document.querySelector(
            "#customerName"
        );


    const phoneElement =
        document.querySelector(
            "#customerPhone"
        );


    const addressElement =
        document.querySelector(
            "#customerAddress"
        );


    const noteElement =
        document.querySelector(
            "#orderNote"
        );


    const name =
        nameElement
            ? nameElement.value.trim()
            : "";


    const phone =
        phoneElement
            ? phoneElement.value.trim()
            : "";


    const address =
        addressElement
            ? addressElement.value.trim()
            : "";


    const note =
        noteElement
            ? noteElement.value.trim()
            : "";


    /* =============================================
       KIỂM TRA HỌ TÊN
    ============================================= */

    if (!name) {

        alert(
            "Vui lòng nhập họ và tên."
        );


        if (nameElement) {

            nameElement.focus();

        }


        return null;

    }


    /* =============================================
       KIỂM TRA SỐ ĐIỆN THOẠI
    ============================================= */

    if (!phone) {

        alert(
            "Vui lòng nhập số điện thoại."
        );


        if (phoneElement) {

            phoneElement.focus();

        }


        return null;

    }


    if (
        !validatePhone(phone)
    ) {

        alert(
            "Vui lòng nhập số điện thoại hợp lệ."
        );


        if (phoneElement) {

            phoneElement.focus();

        }


        return null;

    }


    /* =============================================
       KIỂM TRA ĐỊA CHỈ
    ============================================= */

    if (!address) {

        alert(
            "Vui lòng nhập địa chỉ nhận hàng."
        );


        if (addressElement) {

            addressElement.focus();

        }


        return null;

    }


    /* =============================================
       TẠO DANH SÁCH SẢN PHẨM
    ============================================= */

    const items = [];


    checkoutCart.forEach(
        function (cartItem) {

            const product =
                checkoutProducts.find(
                    function (item) {

                        return (
                            String(item.id).trim() ===
                            String(cartItem.id).trim()
                        );

                    }
                );


            if (!product) {

                console.warn(
                    "Không tìm thấy sản phẩm:",
                    cartItem.id
                );

                return;

            }


            const quantity =
                Number(
                    cartItem.quantity
                ) || 0;


            const price =
                Number(
                    product.price
                ) || 0;


            if (
                quantity <= 0
            ) {

                return;

            }


            items.push({

                id:
                    product.id,

                code:
                    product.code || "",

                name:
                    product.name,

                volume:
                    product.volume || "",

                quantity:
                    quantity,

                price:
                    price

            });

        }
    );


    /* =============================================
       KIỂM TRA SẢN PHẨM
    ============================================= */

    if (
        items.length === 0
    ) {

        alert(
            "Không có sản phẩm hợp lệ trong giỏ hàng."
        );

        return null;

    }


    /* =============================================
       TÍNH TỔNG
    ============================================= */

    let subtotal = 0;


    items.forEach(
        function (item) {

            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        }
    );


    const shipping = 0;


    const total =
        subtotal +
        shipping;


    /* =============================================
       TẠO ĐƠN HÀNG
    ============================================= */

    const order = {

        orderCode:
            generateOrderCode(),

        customerName:
            name,

        customerPhone:
            phone,

        customerAddress:
            address,

        note:
            note,

        items:
            items,

        shipping:
            shipping,

        total:
            total,

        payment:
            "Chưa thanh toán",

        status:
            "Chờ xử lý",

        createdAt:
            new Date().toISOString()

    };


    return order;

}

/* =====================================================
   LƯU ĐƠN HÀNG VÀO SUPABASE
   YÊU CẦU ĐĂNG NHẬP
===================================================== */

async function sendOrderToSupabase(order) {

    console.log(
        "================================="
    );

    console.log(
        "BẮT ĐẦU LƯU ĐƠN HÀNG SUPABASE"
    );

    console.log(
        "MÃ ĐƠN:",
        order.orderCode
    );

    console.log(
        "DỮ LIỆU:",
        order
    );

    console.log(
        "================================="
    );


    /* =================================================
       1. LẤY SUPABASE CLIENT
    ================================================= */

    const supabaseClient =
        getSupabaseClient();


    if (!supabaseClient) {

        throw new Error(
            "Không tìm thấy kết nối Supabase."
        );

    }


    console.log(
        "SUPABASE CLIENT OK"
    );


    /* =================================================
       2. LẤY USER ĐANG ĐĂNG NHẬP
    ================================================= */

    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        console.error(
            "LỖI LẤY USER:",
            userError
        );

        throw new Error(
            "Vui lòng đăng nhập trước khi đặt hàng."
        );

    }


    console.log(
        "USER ĐANG ĐĂNG NHẬP:",
        user.id
    );

    console.log(
        "EMAIL:",
        user.email
    );
// Lấy thông tin user trong public.users
const { data: publicUser, error: publicUserError } =
    await supabaseClient
        .from("users")
        .select("id, user_id, name, email, phone, role, status")
        .eq("auth_user_id", user.id)
        .single();

if (publicUserError || !publicUser) {
    console.error("LỖI LẤY PUBLIC USER:", publicUserError);
    throw new Error("Không tìm thấy thông tin tài khoản.");
}

console.log("PUBLIC USER:", publicUser);
console.log("PUBLIC USER DB ID:", publicUser.id);

    /* =================================================
       3. TẠO ID ĐƠN HÀNG
    ================================================= */

    const orderUUID =
        crypto.randomUUID();


    /* =================================================
       4. TẠO DỮ LIỆU ORDERS
    ================================================= */

    const orderData = {

        id:
            orderUUID,

        order_id:
            order.orderCode,

        user_id: publicUser.id,

        customer_name:
            order.customerName,

        customer_phone:
            order.customerPhone,

        customer_email:
            user.email || null,

        address:
            order.customerAddress,

        note:
            order.note || "",

        subtotal:
            order.items.reduce(
                function (sum, item) {

                    return sum +
                        (
                            Number(item.price) *
                            Number(item.quantity)
                        );

                },
                0
            ),

        shipping_fee:
            Number(order.shipping) || 0,

        total:
            Number(order.total) || 0,

        payment_method:
            "COD",

        payment_status:
            "Pending",

        order_status:
            "Pending"

    };


    console.log(
        "ORDER DATA:",
        orderData
    );


    /* =================================================
       4. INSERT ORDERS
       
       KHÔNG .select()
       KHÔNG .single()
    ================================================= */

    const {
        error: orderError
    } = await supabaseClient

        .from("orders")

        .insert(orderData);


    /* =================================================
       5. KIỂM TRA ORDERS
    ================================================= */

    if (orderError) {

        console.error(
            "LỖI TẠO ORDERS:",
            orderError
        );

        throw new Error(
            "Không thể tạo đơn hàng: " +
            orderError.message
        );

    }


    console.log(
        "ĐÃ TẠO ORDERS:",
        orderUUID
    );


    /* =================================================
       6. TẠO ORDER ITEMS
    ================================================= */

    const orderItems =
        order.items.map(
            function (item) {

                return {

                    order_id:
                        orderUUID,

                    product_id:
                        item.id || null,

                    product_code:
                        item.code || "",

                    product_name:
                        item.name,

                    quantity:
                        Number(item.quantity),

                    price:
                        Number(item.price),

                    total:
                        Number(item.price) *
                        Number(item.quantity)

                };

            }
        );


    console.log(
        "ORDER ITEMS:",
        orderItems
    );


    /* =================================================
       7. INSERT ORDER ITEMS
    ================================================= */

    const {
        error: itemsError
    } = await supabaseClient

        .from("order_items")

        .insert(orderItems);


    /* =================================================
       8. KIỂM TRA ORDER ITEMS
    ================================================= */

    if (itemsError) {

        console.error(
            "LỖI TẠO ORDER_ITEMS:",
            itemsError
        );


        /*
           XÓA ĐƠN HÀNG NẾU ORDER ITEMS THẤT BẠI
        */

        await supabaseClient

            .from("orders")

            .delete()

            .eq(
                "id",
                orderUUID
            );


        throw new Error(
            "Không thể lưu sản phẩm trong đơn hàng: " +
            itemsError.message
        );

    }


    console.log(
        "ĐÃ TẠO ORDER_ITEMS"
    );


    /* =================================================
       9. HOÀN TẤT
    ================================================= */

    return {

        order: {

            id:
                orderUUID,

            order_id:
                order.orderCode

        },

        items:
            orderItems

    };

}
/* =====================================================
   11. XỬ LÝ FORM ĐẶT HÀNG
===================================================== */

function initCheckoutForm() {

    const form =
        document.querySelector(
            "#checkoutForm"
        );


    if (!form) {

        console.error(
            "Không tìm thấy #checkoutForm"
        );

        return;

    }


    /* =============================================
       TRÁNH GẮN EVENT NHIỀU LẦN
    ============================================= */

    if (
        form.dataset.initialized ===
        "true"
    ) {

        return;

    }


    form.dataset.initialized =
        "true";


    /* =============================================
       SUBMIT
    ============================================= */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =========================================
               KIỂM TRA GIỎ
            ========================================= */

            getCheckoutCart();


            if (
                checkoutCart.length === 0
            ) {

                alert(
                    "Giỏ hàng đang trống."
                );

                return;

            }


            /* =========================================
               TẠO ĐƠN
            ========================================= */

            const order =
                createOrderData();


            if (!order) {

                return;

            }


            /* =========================================
               TÌM NÚT ĐẶT HÀNG
            ========================================= */

            const submitButton =
                form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );


            /* =========================================
               KHÓA NÚT
            ========================================= */

            if (
                submitButton
            ) {

                submitButton.disabled =
                    true;


                submitButton.dataset.oldText =
                    submitButton.textContent;


                submitButton.textContent =
                    "Đang gửi đơn...";

            }


            try {

                /* =====================================
                   GỬI ĐƠN
                ===================================== */

                await sendOrderToSupabase(
                    order
                );


                console.log(
                    "GỬI ĐƠN THÀNH CÔNG:",
                    order.orderCode
                );


                /* =====================================
                   XÓA GIỎ HÀNG
                ===================================== */

                localStorage.removeItem(
                    "cart"
                );


                checkoutCart = [];


                /* =====================================
                   CẬP NHẬT SỐ GIỎ
                ===================================== */

                if (
                    typeof updateCartCount ===
                    "function"
                ) {

                    updateCartCount();

                }


                /* =====================================
                   THÔNG BÁO
                ===================================== */

                alert(

                    "ĐẶT HÀNG THÀNH CÔNG!\n\n" +

                    "Mã đơn hàng: " +

                    order.orderCode +

                    "\n\n" +

                    "Bách Sơn Tửu sẽ liên hệ với bạn " +

                    "để xác nhận đơn hàng."

                );


                /* =====================================
                   VỀ TRANG CHỦ
                ===================================== */

                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "LỖI ĐẶT HÀNG:",
                    error
                );


                /* =====================================
                   MỞ KHÓA NÚT
                ===================================== */

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        false;


                    submitButton.textContent =
                        submitButton.dataset.oldText ||
                        "Đặt hàng";

                }


                alert(

                    "KHÔNG THỂ GỬI ĐƠN HÀNG.\n\n" +

                    error.message +

                    "\n\n" +

                    "Vui lòng thử lại."

                );

            }

        }
    );

}


/* =====================================================
   12. TẢI SẢN PHẨM
===================================================== */

async function loadCheckoutProducts() {

    console.log(
        "BẮT ĐẦU TẢI CHECKOUT"
    );


    /* =============================================
       LẤY GIỎ
    ============================================= */

    getCheckoutCart();


    /* =============================================
       GIỎ TRỐNG
    ============================================= */

    if (
        checkoutCart.length === 0
    ) {

        renderCheckoutItems();

        initCheckoutForm();

        return;

    }


    try {

        /* =========================================
           KIỂM TRA GET PRODUCTS
        ========================================= */

        if (
            typeof getProducts !==
            "function"
        ) {

            throw new Error(
                "Không tìm thấy hàm getProducts()."
            );

        }


        /* =========================================
           TẢI PRODUCTS
        ========================================= */

        checkoutProducts =
            await getProducts();


        /* =========================================
           KIỂM TRA PRODUCTS
        ========================================= */

        if (
            !Array.isArray(
                checkoutProducts
            )
        ) {

            throw new Error(
                "Dữ liệu sản phẩm không hợp lệ."
            );

        }


        if (
            checkoutProducts.length === 0
        ) {

            throw new Error(
                "Không có sản phẩm."
            );

        }


        console.log(
            "ĐÃ TẢI PRODUCTS:",
            checkoutProducts
        );


        /* =========================================
           HIỂN THỊ
        ========================================= */

        renderCheckoutItems();


        initCheckoutForm();


    } catch (error) {

        console.error(
            "LỖI CHECKOUT:",
            error
        );


        const container =
            document.querySelector(
                "#checkoutItems"
            );


        if (container) {

            container.innerHTML = `

                <p class="checkout-empty">
                    Không thể tải thông tin sản phẩm.
                </p>

            `;

        }

    }

}


/* =====================================================
   13. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "CHECKOUT JS ĐÃ CHẠY"
        );


        loadCheckoutProducts();

    }
);