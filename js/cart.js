/* =====================================================
   BÁCH SƠN TỬU
   CART SYSTEM
===================================================== */

let products = [];
let cart = [];


/* =====================================================
   1. TẢI SẢN PHẨM
===================================================== */

async function loadCartProducts() {

    /*
       HIỆN GIỎ HÀNG NGAY LẬP TỨC
       Không chờ Google Sheets
    */

    loadCart();


    /*
       TẢI DỮ LIỆU SẢN PHẨM Ở NỀN
    */

    try {

        products = await getProducts();


        /*
           Sau khi có dữ liệu mới
           cập nhật lại giỏ hàng
        */

        renderCart();


        console.log(
            "Đã cập nhật sản phẩm cho Cart."
        );


    } catch (error) {

        console.warn(
            "Không thể cập nhật sản phẩm nền:",
            error
        );

    }

}


/* =====================================================
   2. ĐỌC GIỎ HÀNG
===================================================== */

function loadCart() {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    updateCartCount();

    renderCart();
}

/* =====================================================
   CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG TRÊN HEADER
===================================================== */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const totalQuantity =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

        cartCount.classList.toggle(
            "show",
            totalQuantity > 0
        );

    }

}


/* =====================================================
   3. HIỂN THỊ GIỎ HÀNG
===================================================== */

function renderCart() {

    const cartItems =
        document.querySelector(".cart-items");

    if (!cartItems) return;

    cartItems.innerHTML = "";


    /* Giỏ hàng trống */

    if (cart.length === 0) {

        renderEmptyCart();

        updateCartSummary();

        return;

    }


    /* Hiển thị từng sản phẩm */

    cart.forEach(function (cartItem) {

        const product =
            products.find(
                item =>
                    Number(item.id) ===
                    Number(cartItem.id)
            );


        /* Không tìm thấy sản phẩm */

        if (!product) return;


        const item =
            document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3 class="cart-item-name">
                    ${product.name}
                </h3>

                <span class="cart-item-volume">
                    ${product.volume || ""}
                </span>

                <span class="cart-item-price">
                    ${formatPrice(product.price)}
                </span>

            </div>


            <div class="cart-item-actions">

                <div class="quantity-control">

    <button 
        class="quantity-button" 
        data-action="decrease" 
        data-id="${product.id}"
        type="button"
    >
        −
    </button>

    <input
        type="number"
        class="quantity-input"
        min="1"
        max="${Number(product.stock) || 1}"
        value="${cartItem.quantity}"
        data-id="${product.id}"
    >

    <button 
        class="quantity-button" 
        data-action="increase" 
        data-id="${product.id}"
        type="button"
    >
        +
    </button>

</div>


                <strong class="cart-item-total">
                    ${formatPrice(
                        product.price *
                        cartItem.quantity
                    )}
                </strong>


                <button
                    class="remove-cart-item"
                    data-id="${product.id}"
                    aria-label="Xóa sản phẩm"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;


        cartItems.appendChild(item);

    });


    addCartEvents();

    updateCartSummary();

}


/* =====================================================
   4. GIỎ HÀNG TRỐNG
===================================================== */

function renderEmptyCart() {

    const cartItems =
        document.querySelector(".cart-items");

    cartItems.innerHTML = `

        <div class="cart-empty">

            <i class="fa-solid fa-bag-shopping"></i>

            <h3>
                Giỏ hàng đang trống
            </h3>

            <p>
                Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>

            <a
                href="products.html"
                class="cart-shopping-button"
            >
                TIẾP TỤC MUA HÀNG

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </div>

    `;

}


/* =====================================================
   5. XỬ LÝ NÚT + / - / XÓA
===================================================== */

function addCartEvents() {

    const quantityButtons =
        document.querySelectorAll(
            ".quantity-button"
        );


    quantityButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(this.dataset.id);

                const action =
                    this.dataset.action;


                if (action === "increase") {

                    increaseQuantity(productId);

                }


                if (action === "decrease") {

                    decreaseQuantity(productId);

                }

            }
        );

    });
/* =================================================
   XỬ LÝ NHẬP SỐ LƯỢNG TRỰC TIẾP
================================================= */

    const quantityInputs =
        document.querySelectorAll(
            ".quantity-input"
        );


    quantityInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            function () {

                const productId =
                    Number(this.dataset.id);

                changeQuantity(
                    productId,
                    this.value
                );

            }
        );

    });

    const removeButtons =
        document.querySelectorAll(
            ".remove-cart-item"
        );


    removeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(this.dataset.id);

                removeFromCart(productId);

            }
        );

    });

}
/* =====================================================
   THAY ĐỔI SỐ LƯỢNG TRỰC TIẾP
===================================================== */

function changeQuantity(productId, value) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    const cartItem =
        cart.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product || !cartItem) {
        return;
    }


    let quantity =
        Number(value);


    /* Không cho nhập số không hợp lệ */

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    /* Kiểm tra tồn kho */

    const stock =
        Number(product.stock) || 0;


    if (quantity > stock) {

        alert(
            "Số lượng vượt quá tồn kho. Tồn kho hiện tại: " +
            stock
        );

        quantity = stock;

    }


    cartItem.quantity =
        quantity;


    saveCart();

}

/* =====================================================
   6. TĂNG SỐ LƯỢNG
===================================================== */

function increaseQuantity(productId) {

    const product =
        products.find(
            item =>
                Number(item.id) === productId
        );


    const cartItem =
        cart.find(
            item =>
                Number(item.id) === productId
        );


    if (!product || !cartItem) return;


    /* Kiểm tra tồn kho */

    if (
        cartItem.quantity >=
        Number(product.stock)
    ) {

        alert(
            "Số lượng đã đạt giới hạn tồn kho."
        );

        return;

    }


    cartItem.quantity += 1;

    saveCart();

}


/* =====================================================
   7. GIẢM SỐ LƯỢNG
===================================================== */

function decreaseQuantity(productId) {

    const cartItem =
        cart.find(
            item =>
                Number(item.id) === productId
        );


    if (!cartItem) return;


    if (cartItem.quantity > 1) {

        cartItem.quantity -= 1;

    } else {

        removeFromCart(productId);

        return;

    }


    saveCart();

}


/* =====================================================
   8. XÓA SẢN PHẨM
===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                Number(item.id) !== productId
        );


    saveCart();

}


/* =====================================================
   9. LƯU GIỎ HÀNG
===================================================== */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();
}


/* =====================================================
   10. TÍNH TỔNG TIỀN
===================================================== */

function updateCartSummary() {

    let subtotal = 0;


    cart.forEach(function (cartItem) {

        const product =
            products.find(
                item =>
                    Number(item.id) ===
                    Number(cartItem.id)
            );


        if (!product) return;
        const price =
            Number(product.price) || 0;

        const quantity =
            Number(cartItem.quantity) || 0;

        subtotal += price * quantity;

    });


    /* Hiển thị tạm tính */

    const subtotalElement =
        document.querySelector(
            ".cart-subtotal"
        );

    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    /* Phí vận chuyển */

    const shipping = 0;


    const shippingElement =
        document.querySelector(
            ".cart-shipping"
        );

    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "Liên hệ"
                : formatPrice(shipping);

    }


    /* Tổng */

    const total =
        subtotal + shipping;


    const totalElement =
        document.querySelector(
            ".cart-total"
        );

    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }

}


/* =====================================================
   11. ĐỊNH DẠNG GIÁ
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(price) + "đ";

}


/* =====================================================
   12. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadCartProducts
);