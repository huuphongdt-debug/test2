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
   2. GOOGLE APPS SCRIPT
===================================================== */

const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbzg8M1Q-2GtK9Noe_IuvYwMehzPYOwyTeUfNWHUTKdl0bF4m0lq4auEpQRzjbgGXbJl/exec";


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


    checkoutCart.forEach(
        function (cartItem) {

            const product =
                checkoutProducts.find(
                    function (item) {

                        return String(item.id).trim() ===
                               String(cartItem.id).trim();

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


            subtotal += itemTotal;


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
                subtotal + shipping
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
            "#customerNote"
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
       KIỂM TRA THÔNG TIN
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


    if (!phone) {

        alert(
            "Vui lòng nhập số điện thoại."
        );

        if (phoneElement) {
            phoneElement.focus();
        }

        return null;

    }


    if (!validatePhone(phone)) {

        alert(
            "Vui lòng nhập số điện thoại hợp lệ."
        );

        if (phoneElement) {
            phoneElement.focus();
        }

        return null;

    }


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

                        return String(item.id).trim() ===
                               String(cartItem.id).trim();

                    }
                );


            if (!product) {
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


            if (quantity <= 0) {
                return;
            }


            items.push({

                id:
                    product.id,

                name:
                    product.name,

                quantity:
                    quantity,

                price:
                    price

            });

        }
    );


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
       TẠO ĐƠN
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
   10. GỬI ĐƠN HÀNG
   FORM POST + IFRAME
   KHÔNG DÙNG FETCH
===================================================== */

async function sendOrder(order) {

    console.log(
        "================================="
    );


    console.log(
        "BẮT ĐẦU GỬI ĐƠN HÀNG"
    );


    console.log(
        "MÃ ĐƠN:",
        order.orderCode
    );


    console.log(
        "DỮ LIỆU ĐƠN:",
        order
    );


    console.log(
        "================================="
    );


    try {

        /* =============================================
           TẠO IFRAME ẨN
        ============================================= */

        let iframe =
            document.getElementById(
                "orderSubmitFrame"
            );


        if (!iframe) {

            iframe =
                document.createElement(
                    "iframe"
                );


            iframe.id =
                "orderSubmitFrame";


            iframe.name =
                "orderSubmitFrame";


            iframe.style.display =
                "none";


            document.body.appendChild(
                iframe
            );

        }


        /* =============================================
           TẠO FORM
        ============================================= */

        const form =
            document.createElement(
                "form"
            );


        form.method =
            "POST";


        form.action =
            ORDER_API_URL;


        form.target =
            "orderSubmitFrame";


        form.enctype =
            "application/x-www-form-urlencoded";


        form.style.display =
            "none";


        /* =============================================
           PAYLOAD
        ============================================= */

        const payload =
            document.createElement(
                "input"
            );


        payload.type =
            "hidden";


        payload.name =
            "payload";


        payload.value =
            JSON.stringify(order);


        form.appendChild(
            payload
        );


        /* =============================================
           THÊM FORM VÀO TRANG
        ============================================= */

        document.body.appendChild(
            form
        );


        console.log(
            "PAYLOAD GỬI GOOGLE SHEETS:",
            order
        );


        /* =============================================
           SUBMIT
        ============================================= */

        form.submit();


        console.log(
            "ĐÃ GỬI FORM ĐẾN GOOGLE APPS SCRIPT"
        );


        /* =============================================
           CHỜ XỬ LÝ
        ============================================= */

        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    3000
                );

            }
        );


        /* =============================================
           XÓA FORM
        ============================================= */

        form.remove();


        console.log(
            "ĐÃ HOÀN TẤT GỬI ĐƠN:",
            order.orderCode
        );


        return true;


    } catch (error) {

        console.error(
            "LỖI GỬI ĐƠN:",
            error
        );


        return false;

    }

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


    /* Tránh gắn sự kiện nhiều lần */

    if (
        form.dataset.initialized ===
        "true"
    ) {

        return;

    }


    form.dataset.initialized =
        "true";


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =========================================
               KIỂM TRA GIỎ
            ========================================= */

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

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.dataset.oldText =
                    submitButton.textContent;

                submitButton.textContent =
                    "Đang gửi đơn...";

            }


            /* =========================================
               GỬI ĐƠN
            ========================================= */

            const success =
                await sendOrder(
                    order
                );


            /* =========================================
               MỞ KHÓA NÚT NẾU LỖI
            ========================================= */

            if (!success) {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        submitButton.dataset.oldText ||
                        "Đặt hàng";

                }


                alert(

                    "Không thể kết nối đến hệ thống đặt hàng.\n\n" +
                    "Vui lòng thử lại sau."

                );

                return;

            }


            /* =========================================
               XÓA GIỎ HÀNG
            ========================================= */

            localStorage.removeItem(
                "cart"
            );


            checkoutCart = [];


            /* =========================================
               CẬP NHẬT GIỎ HÀNG
            ========================================= */

            if (
                typeof updateCartCount ===
                "function"
            ) {

                updateCartCount();

            }


            /* =========================================
               THÔNG BÁO
            ========================================= */

            alert(

                "ĐẶT HÀNG THÀNH CÔNG!\n\n" +

                "Mã đơn hàng: " +
                order.orderCode +

                "\n\n" +

                "Bách Sơn Tửu sẽ liên hệ với bạn " +
                "để xác nhận đơn hàng."

            );


            /* =========================================
               VỀ TRANG CHỦ
            ========================================= */

            window.location.href =
                "index.html";

        }
    );

}


/* =====================================================
   12. TẢI DỮ LIỆU SẢN PHẨM
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

        /* =============================================
           LẤY PRODUCTS
        ============================================= */

        if (
            typeof getProducts !==
            "function"
        ) {

            throw new Error(
                "Không tìm thấy hàm getProducts()."
            );

        }


        checkoutProducts =
            await getProducts();


        /* =============================================
           KIỂM TRA PRODUCTS
        ============================================= */

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


        /* =============================================
           HIỂN THỊ
        ============================================= */

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