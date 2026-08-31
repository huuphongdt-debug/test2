/* =====================================================
   BÁCH SƠN TỬU
   CART SYSTEM
   SUPABASE PRODUCT API

   CHỨC NĂNG:
   - Đọc / lưu giỏ hàng localStorage
   - Tăng / giảm số lượng
   - Nhập trực tiếp số lượng
   - Kiểm tra tồn kho
   - Xóa sản phẩm
   - Tính tổng tiền
   - Cập nhật icon giỏ hàng
===================================================== */


/* =====================================================
   1. BIẾN GIỎ HÀNG
===================================================== */

let cartItems = [];


/* =====================================================
   2. ĐỌC GIỎ HÀNG
===================================================== */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem("cart");

        if (!savedCart) {
            return [];
        }

        const cart =
            JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart;

    } catch (error) {

        console.error(
            "Lỗi đọc giỏ hàng:",
            error
        );

        return [];
    }
}


/* =====================================================
   3. LƯU GIỎ HÀNG
===================================================== */

function saveCart(cart) {

    try {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Lỗi lưu giỏ hàng:",
            error
        );
    }
}


/* =====================================================
   4. ĐỊNH DẠNG GIÁ
===================================================== */

function formatCartPrice(price) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(price) || 0
    ) + "đ";

}


/* =====================================================
   5. LẤY DANH SÁCH SẢN PHẨM
===================================================== */

async function getCartProducts() {

    try {

        const productList =
            await getProducts();

        if (!Array.isArray(productList)) {

            console.error(
                "Dữ liệu sản phẩm không hợp lệ."
            );

            return [];
        }

        return productList;

    } catch (error) {

        console.error(
            "Không thể tải sản phẩm:",
            error
        );

        return [];
    }
}


/* =====================================================
   6. HIỂN THỊ GIỎ HÀNG
===================================================== */

async function renderCart() {

    const cartContainer =
        document.querySelector(
            "#cartItems"
        );

    const cartEmpty =
        document.querySelector(
            "#cartEmpty"
        );


    if (!cartContainer) {

        console.warn(
            "Không tìm thấy #cartItems."
        );

        return;
    }


    /* ==========================================
       ĐỌC GIỎ HÀNG
    ========================================== */

    cartItems =
        getCart();


    /* ==========================================
       GIỎ HÀNG RỖNG
    ========================================== */

    if (
        !cartItems ||
        cartItems.length === 0
    ) {

        cartContainer.innerHTML = "";


        if (cartEmpty) {

            cartEmpty.style.display =
                "flex";

        }


        updateCartSummary([]);

        updateCartCount();

        return;
    }


    /* ==========================================
       ẨN GIỎ HÀNG RỖNG
    ========================================== */

    if (cartEmpty) {

        cartEmpty.style.display =
            "none";

    }


    /* ==========================================
       LẤY SẢN PHẨM
    ========================================== */

    const productList =
        await getCartProducts();


    /* ==========================================
       GHÉP GIỎ HÀNG + SẢN PHẨM
    ========================================== */

    const detailedCart = [];


    cartItems.forEach(
        function (cartItem) {

            const product =
                productList.find(
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


            let quantity =
                Number(
                    cartItem.quantity
                ) || 1;


            /* Không nhỏ hơn 1 */

            if (
                quantity < 1
            ) {

                quantity = 1;

            }


            /* Không vượt tồn kho */

            const stock =
                Number(
                    product.stock
                ) || 0;


            if (
                stock > 0 &&
                quantity > stock
            ) {

                quantity = stock;

            }


            detailedCart.push({

                ...product,

                quantity:
                    quantity

            });

        }
    );


    /* ==========================================
       KHÔNG CÓ SẢN PHẨM HỢP LỆ
    ========================================== */

    if (
        detailedCart.length === 0
    ) {

        cartContainer.innerHTML = "";


        if (cartEmpty) {

            cartEmpty.style.display =
                "flex";

        }


        updateCartSummary([]);

        updateCartCount();

        return;
    }


    /* ==========================================
       XÓA HTML CŨ
    ========================================== */

    cartContainer.innerHTML = "";


    /* ==========================================
       RENDER TỪNG SẢN PHẨM
    ========================================== */

    detailedCart.forEach(
        function (product) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "cart-item";


            item.dataset.id =
                product.id;


            const quantity =
                Number(
                    product.quantity
                ) || 1;


            const stock =
                Number(
                    product.stock
                ) || 0;


            const itemTotal =
                Number(
                    product.price || 0
                ) *
                quantity;


            item.innerHTML = `

                <!-- =================================
                     ẢNH SẢN PHẨM
                ================================== -->

                <div class="cart-item-image">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name || ""}"
                        loading="lazy"
                    >

                </div>


                <!-- =================================
                     THÔNG TIN SẢN PHẨM
                ================================== -->

                <div class="cart-item-info">

                    <span class="cart-item-category">

                        ${product.category || ""}

                    </span>


                    <h3 class="cart-item-name">

                        ${product.name || ""}

                    </h3>


                    ${
                        product.volume
                        ? `
                            <span class="cart-item-volume">

                                ${product.volume}

                            </span>
                        `
                        : ""
                    }


                    <strong class="cart-item-price">

                        ${formatCartPrice(
                            product.price
                        )}

                    </strong>

                </div>


                <!-- =================================
                     SỐ LƯỢNG
                ================================== -->

                <div class="cart-item-quantity">


                    <!-- NÚT GIẢM -->

                    <button
                        type="button"
                        class="quantity-minus"
                        data-id="${product.id}"
                        aria-label="Giảm số lượng"
                    >

                        <i class="fa-solid fa-minus"></i>

                    </button>


                    <!-- Ô NHẬP TRỰC TIẾP -->

                    <input
                        type="number"
                        class="quantity-input"
                        data-id="${product.id}"
                        value="${quantity}"
                        min="1"
                        ${
                            stock > 0
                            ? `max="${stock}"`
                            : ""
                        }
                        inputmode="numeric"
                        aria-label="Số lượng ${product.name || ""}"
                    >


                    <!-- NÚT TĂNG -->

                    <button
                        type="button"
                        class="quantity-plus"
                        data-id="${product.id}"
                        aria-label="Tăng số lượng"
                    >

                        <i class="fa-solid fa-plus"></i>

                    </button>


                </div>


                <!-- =================================
                     THÀNH TIỀN
                ================================== -->

                <div class="cart-item-total">

                    <strong>

                        ${formatCartPrice(
                            itemTotal
                        )}

                    </strong>

                </div>


                <!-- =================================
                     NÚT XÓA
                ================================== -->

                <button
                    type="button"
                    class="cart-item-remove"
                    data-id="${product.id}"
                    aria-label="Xóa sản phẩm"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            cartContainer.appendChild(
                item
            );

        }
    );


    /* ==========================================
       GẮN SỰ KIỆN
    ========================================== */

    addCartItemEvents();


    /* ==========================================
       CẬP NHẬT TỔNG
    ========================================== */

    updateCartSummary(
        detailedCart
    );


    /* ==========================================
       CẬP NHẬT ICON GIỎ HÀNG
    ========================================== */

    updateCartCount();

}


/* =====================================================
   7. GẮN SỰ KIỆN CHO ITEM
===================================================== */

function addCartItemEvents() {


    /* ==========================================
       NÚT GIẢM
    ========================================== */

    const minusButtons =
        document.querySelectorAll(
            ".quantity-minus"
        );


    minusButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        String(
                            this.dataset.id
                        ).trim();


                    changeCartQuantity(
                        id,
                        -1
                    );

                }
            );

        }
    );


    /* ==========================================
       NÚT TĂNG
    ========================================== */

    const plusButtons =
        document.querySelectorAll(
            ".quantity-plus"
        );


    plusButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        String(
                            this.dataset.id
                        ).trim();


                    changeCartQuantity(
                        id,
                        1
                    );

                }
            );

        }
    );


    /* ==========================================
       Ô NHẬP TRỰC TIẾP
    ========================================== */

    const quantityInputs =
        document.querySelectorAll(
            ".quantity-input"
        );


    quantityInputs.forEach(
        function (input) {


            /* ----------------------------------
               CHANGE
            ---------------------------------- */

            input.addEventListener(
                "change",
                function () {

                    const id =
                        String(
                            this.dataset.id
                        ).trim();


                    setCartQuantity(
                        id,
                        this.value
                    );

                }
            );


            /* ----------------------------------
               ENTER
            ---------------------------------- */

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        this.blur();

                    }

                }
            );


            /* ----------------------------------
               BLUR
            ---------------------------------- */

            input.addEventListener(
                "blur",
                function () {

                    const id =
                        String(
                            this.dataset.id
                        ).trim();


                    if (
                        this.value === ""
                    ) {

                        setCartQuantity(
                            id,
                            1
                        );

                    }

                }
            );

        }
    );


    /* ==========================================
       NÚT XÓA
    ========================================== */

    const removeButtons =
        document.querySelectorAll(
            ".cart-item-remove"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        String(
                            this.dataset.id
                        ).trim();


                    removeFromCart(
                        id
                    );

                }
            );

        }
    );

}


/* =====================================================
   8. TĂNG / GIẢM SỐ LƯỢNG
===================================================== */

async function changeCartQuantity(
    productId,
    change
) {

    const cart =
        getCart();


    const item =
        cart.find(
            function (cartItem) {

                return (
                    String(cartItem.id).trim() ===
                    String(productId).trim()
                );

            }
        );


    if (!item) {
        return;
    }


    const currentQuantity =
        Number(
            item.quantity
        ) || 1;


    const newQuantity =
        currentQuantity +
        Number(change);


    /* ==========================================
       NHỎ HƠN 1 → XÓA
    ========================================== */

    if (
        newQuantity < 1
    ) {

        removeFromCart(
            productId
        );

        return;
    }


    /* ==========================================
       LẤY SẢN PHẨM
    ========================================== */

    const productList =
        await getCartProducts();


    const product =
        productList.find(
            function (item) {

                return (
                    String(item.id).trim() ===
                    String(productId).trim()
                );

            }
        );


    if (!product) {

        alert(
            "Không tìm thấy sản phẩm."
        );

        return;
    }


    /* ==========================================
       KIỂM TRA TỒN KHO
    ========================================== */

    const stock =
        Number(
            product.stock
        ) || 0;


    if (
        stock > 0 &&
        newQuantity > stock
    ) {

        alert(
            "Số lượng đã đạt giới hạn tồn kho: " +
            stock
        );

        return;
    }


    /* ==========================================
       LƯU
    ========================================== */

    item.quantity =
        newQuantity;


    saveCart(
        cart
    );


    /* ==========================================
       RENDER
    ========================================== */

    await renderCart();

}


/* =====================================================
   9. NHẬP TRỰC TIẾP SỐ LƯỢNG
===================================================== */

async function setCartQuantity(
    productId,
    value
) {

    const cart =
        getCart();


    const item =
        cart.find(
            function (cartItem) {

                return (
                    String(cartItem.id).trim() ===
                    String(productId).trim()
                );

            }
        );


    if (!item) {
        return;
    }


    /* ==========================================
       CHUYỂN THÀNH SỐ
    ========================================== */

    let quantity =
        Number(
            String(value).trim()
        );


    /* ==========================================
       KHÔNG HỢP LỆ
    ========================================== */

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    /* ==========================================
       CHỈ NHẬN SỐ NGUYÊN
    ========================================== */

    quantity =
        Math.floor(
            quantity
        );


    /* ==========================================
       LẤY SẢN PHẨM
    ========================================== */

    const productList =
        await getCartProducts();


    const product =
        productList.find(
            function (item) {

                return (
                    String(item.id).trim() ===
                    String(productId).trim()
                );

            }
        );


    if (!product) {

        alert(
            "Không tìm thấy sản phẩm."
        );

        return;
    }


    /* ==========================================
       KIỂM TRA TỒN KHO
    ========================================== */

    const stock =
        Number(
            product.stock
        ) || 0;


    if (
        stock > 0 &&
        quantity > stock
    ) {

        alert(
            "Số lượng vượt quá tồn kho.\n" +
            "Tồn kho hiện tại: " +
            stock
        );


        quantity =
            stock;

    }


    /* ==========================================
       CẬP NHẬT
    ========================================== */

    item.quantity =
        quantity;


    saveCart(
        cart
    );


    /* ==========================================
       RENDER
    ========================================== */

    await renderCart();

}


/* =====================================================
   10. XÓA SẢN PHẨM
===================================================== */

function removeFromCart(
    productId
) {

    let cart =
        getCart();


    cart =
        cart.filter(
            function (item) {

                return (
                    String(item.id).trim() !==
                    String(productId).trim()
                );

            }
        );


    saveCart(
        cart
    );


    renderCart();

}


/* =====================================================
   11. XÓA TOÀN BỘ GIỎ HÀNG
===================================================== */

function clearCart() {

    localStorage.removeItem(
        "cart"
    );


    cartItems = [];


    renderCart();

}


/* =====================================================
   12. TÍNH TỔNG TIỀN
===================================================== */

function updateCartSummary(
    products
) {

    const subtotalElement =
        document.querySelector(
            ".cart-subtotal"
        );


    const totalElement =
        document.querySelector(
            ".cart-total"
        );


    let subtotal = 0;


    if (
        Array.isArray(products)
    ) {

        products.forEach(
            function (product) {

                subtotal +=
                    Number(
                        product.price || 0
                    ) *
                    Number(
                        product.quantity || 0
                    );

            }
        );

    }


    /* ==========================================
       PHÍ SHIP
       TẠM THỜI = 0
    ========================================== */

    const shipping = 0;


    const total =
        subtotal +
        shipping;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatCartPrice(
                subtotal
            );

    }


    if (totalElement) {

        totalElement.textContent =
            formatCartPrice(
                total
            );

    }


    /* ==========================================
       CHECKOUT
    ========================================== */

    const checkoutButton =
        document.querySelector(
            "#checkoutButton"
        );


    if (checkoutButton) {

        checkoutButton.classList.toggle(
            "disabled",
            subtotal <= 0
        );


        checkoutButton.style.pointerEvents =
            subtotal > 0
                ? "auto"
                : "none";


        checkoutButton.style.opacity =
            subtotal > 0
                ? "1"
                : "0.5";

    }

}


/* =====================================================
   13. CẬP NHẬT ICON GIỎ HÀNG
===================================================== */

function updateCartCount() {

    const cart =
        getCart();


    const totalQuantity =
        cart.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    Number(
                        item.quantity || 0
                    )
                );

            },
            0
        );


    const cartCounts =
        document.querySelectorAll(
            ".cart-count"
        );


    cartCounts.forEach(
        function (element) {

            element.textContent =
                totalQuantity;


            element.classList.toggle(
                "show",
                totalQuantity > 0
            );

        }
    );

}


/* =====================================================
   14. CHECKOUT
===================================================== */

function setupCheckout() {

    const checkoutButton =
        document.querySelector(
            "#checkoutButton"
        );


    if (!checkoutButton) {
        return;
    }


    checkoutButton.addEventListener(
        "click",
        function (event) {

            const cart =
                getCart();


            if (
                !cart ||
                cart.length === 0
            ) {

                event.preventDefault();


                alert(
                    "Giỏ hàng đang trống."
                );


                return;
            }

        }
    );

}


/* =====================================================
   15. SẢN PHẨM ĐƯỢC CẬP NHẬT
===================================================== */

window.addEventListener(
    "productsUpdated",
    function () {

        console.log(
            "Cart: sản phẩm đã được cập nhật."
        );


        renderCart();

    }
);


/* =====================================================
   16. GIỎ HÀNG THAY ĐỔI Ở TAB KHÁC
===================================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "cart"
        ) {

            renderCart();

            updateCartCount();

        }

    }
);


/* =====================================================
   17. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "================================="
        );


        console.log(
            "BÁCH SƠN TỬU - CART SYSTEM"
        );


        console.log(
            "Đang khởi tạo giỏ hàng..."
        );


        await renderCart();


        setupCheckout();


        updateCartCount();


        console.log(
            "CART SYSTEM READY"
        );


        console.log(
            "================================="
        );

    }
);