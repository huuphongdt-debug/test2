/* =====================================================
   BÁCH SƠN TỬU
   PRODUCT SYSTEM
   SUPABASE
   ===================================================== */


/* =====================================================
   1. BIẾN TOÀN CỤC
===================================================== */

let products = [];

let currentProducts = [];

let currentCategory = "all";

let currentSearch = "";

let currentSort = "default";


/* =====================================================
   2. ĐỌC DỮ LIỆU SẢN PHẨM
===================================================== */

async function loadProductData() {

    try {

        console.log(
            "Đang tải dữ liệu sản phẩm..."
        );


        /* ==========================================
           LẤY SẢN PHẨM
        ========================================== */

        products =
            await getProducts();


        /* ==========================================
           KIỂM TRA
        ========================================== */

        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            console.error(
                "Không có dữ liệu sản phẩm."
            );

            showProductMessage(
                "Hiện chưa có sản phẩm."
            );

            return;

        }


        console.log(
            "Đã tải:",
            products.length,
            "sản phẩm."
        );


        /* ==========================================
           KHỞI TẠO
        ========================================== */

        currentProducts =
            [...products];


        /* ==========================================
           HIỂN THỊ
        ========================================== */

        renderProducts(
            currentProducts
        );


    }
    catch (error) {

        console.error(
            "Lỗi tải dữ liệu sản phẩm:",
            error
        );


        showProductMessage(
            "Không thể tải sản phẩm. Vui lòng thử lại sau."
        );

    }

}


/* =====================================================
   3. NHẬN DỮ LIỆU MỚI TỪ PRODUCT API
===================================================== */

window.addEventListener(
    "productsUpdated",
    function (event) {

        const newProducts =
            event.detail;


        if (
            !Array.isArray(newProducts)
        ) {

            return;

        }


        products =
            newProducts;


        currentProducts =
            [...newProducts];


        filterProducts();


        console.log(
            "Giao diện sản phẩm đã được cập nhật."
        );

    }
);


/* =====================================================
   4. HIỂN THỊ SẢN PHẨM
===================================================== */

function renderProducts(productList) {

    const productGrid =
        document.querySelector(
            ".product-grid"
        );


    if (!productGrid) {

        return;

    }


    productGrid.innerHTML = "";


    /* ==========================================
       KHÔNG CÓ SẢN PHẨM
    ========================================== */

    if (
        !Array.isArray(productList) ||
        productList.length === 0
    ) {

        productGrid.innerHTML = `

            <div class="no-products">

                <i class="fa-solid fa-box-open"></i>

                <p>
                    Không tìm thấy sản phẩm.
                </p>

            </div>

        `;

        return;

    }


    /* ==========================================
       TẠO CARD
    ========================================== */

    productList.forEach(
        function (product) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            /* ==================================
               TỒN KHO
            ================================== */

            const stock =
                Number(
                    product.stock || 0
                );


            const isOutOfStock =
                stock <= 0 ||
                String(
                    product.status || ""
                ).trim() !== "Active";


            /* ==================================
               GIÁ
            ================================== */

            const price =
                Number(
                    product.price || 0
                );


            const oldPrice =
                Number(
                    product.old_price || 0
                );


            let priceHTML;


            if (
                oldPrice > price
            ) {

                priceHTML = `

                    <div class="product-price-box">

                        <del class="product-old-price">

                            ${formatPrice(
                                oldPrice
                            )}

                        </del>

                        <strong class="product-price">

                            ${formatPrice(
                                price
                            )}

                        </strong>

                    </div>

                `;

            }
            else {

                priceHTML = `

                    <strong class="product-price">

                        ${formatPrice(
                            price
                        )}

                    </strong>

                `;

            }


            /* ==================================
               VOLUME
            ================================== */

            const volume =
                product.volume
                    ? product.volume
                    : "";


            /* ==================================
               CATEGORY
            ================================== */

            const category =
                product.category
                    ? product.category
                    : "Sản phẩm";


            /* ==================================
               ẢNH
            ================================== */

            const image =
                product.image_url
                    ? product.image_url
                    : "images/products/default.png";


            /* ==================================
               TẠO HTML
            ================================== */

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='images/products/default.png';
                        "
                    >

                </div>


                <div class="product-info">


                    <span class="product-category">

                        ${escapeHTML(
                            category
                        )}

                    </span>


                    <h3>

                        ${escapeHTML(
                            product.name
                        )}

                        ${volume
                            ? escapeHTML(
                                volume
                              )
                            : ""
                        }

                    </h3>


                    ${priceHTML}


                    <button
                        class="add-to-cart"
                        data-id="${product.id}"
                        ${isOutOfStock
                            ? "disabled"
                            : ""
                        }
                    >

                        ${isOutOfStock
                            ? `<i class="fa-solid fa-ban"></i> HẾT HÀNG`
                            : `<i class="fa-solid fa-cart-plus"></i> THÊM VÀO GIỎ`
                        }

                    </button>


                    <a
                        href="product-detail.html?slug=${encodeURIComponent(
                            product.slug || ""
                        )}"
                        class="product-detail-button"
                    >

                        XEM CHI TIẾT

                        <i
                            class="fa-solid fa-arrow-right"
                        ></i>

                    </a>


                </div>

            `;


            productGrid.appendChild(
                card
            );

        }
    );


    /* ==========================================
       GẮN SỰ KIỆN GIỎ HÀNG
    ========================================== */

    addCartEvents();


    console.log(
        "Đã render",
        productList.length,
        "sản phẩm."
    );

}


/* =====================================================
   5. TÌM KIẾM + LỌC + SẮP XẾP
===================================================== */

function filterProducts() {

    let result =
        [...products];


    /* ==========================================
       LỌC DANH MỤC
    ========================================== */

    if (
        currentCategory !== "all"
    ) {

        result =
            result.filter(
                function (product) {

                    return String(
                        product.category || ""
                    ).trim() ===
                    String(
                        currentCategory
                    ).trim();

                }
            );

    }


    /* ==========================================
       TÌM KIẾM
    ========================================== */

    if (
        currentSearch.trim() !== ""
    ) {

        const keyword =
            currentSearch
                .toLowerCase()
                .trim();


        result =
            result.filter(
                function (product) {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const shortDescription =
                        String(
                            product.short_description || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.category || ""
                        ).toLowerCase();


                    const productCode =
                        String(
                            product.product_code || ""
                        ).toLowerCase();


                    return (

                        name.includes(
                            keyword
                        )

                        ||

                        shortDescription.includes(
                            keyword
                        )

                        ||

                        description.includes(
                            keyword
                        )

                        ||

                        category.includes(
                            keyword
                        )

                        ||

                        productCode.includes(
                            keyword
                        )

                    );

                }
            );

    }


    /* ==========================================
       SẮP XẾP
    ========================================== */

    switch (
        currentSort
    ) {


        case "price-low":

            result.sort(
                function (a, b) {

                    return (
                        Number(a.price || 0) -
                        Number(b.price || 0)
                    );

                }
            );

            break;


        case "price-high":

            result.sort(
                function (a, b) {

                    return (
                        Number(b.price || 0) -
                        Number(a.price || 0)
                    );

                }
            );

            break;


        case "name":

            result.sort(
                function (a, b) {

                    return String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        ),
                        "vi"
                    );

                }
            );

            break;


        case "featured":

            result.sort(
                function (a, b) {

                    return (
                        Number(
                            b.featured
                        ) -
                        Number(
                            a.featured
                        )
                    );

                }
            );

            break;


        default:

            break;

    }


    currentProducts =
        result;


    renderProducts(
        currentProducts
    );

}


/* =====================================================
   6. TÌM KIẾM
===================================================== */

function setupProductSearch() {

    const searchInput =
        document.querySelector(
            "#productSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                this.value;


            filterProducts();

        }
    );

}


/* =====================================================
   7. SẮP XẾP
===================================================== */

function setupProductSort() {

    const sortSelect =
        document.querySelector(
            "#productSort"
        );


    if (!sortSelect) {

        return;

    }


    sortSelect.addEventListener(
        "change",
        function () {

            currentSort =
                this.value;


            filterProducts();

        }
    );

}


/* =====================================================
   8. ĐỊNH DẠNG GIÁ
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(
        Number(price || 0)
    ) + "đ";

}


/* =====================================================
   9. NÚT THÊM VÀO GIỎ
===================================================== */

function addCartEvents() {

    const buttons =
        document.querySelectorAll(
            ".add-to-cart"
        );


    console.log(
        "Số nút thêm giỏ:",
        buttons.length
    );


    buttons.forEach(
        function (button) {

            button.onclick =
                function () {

                    const productId =
                        String(
                            this.dataset.id
                        ).trim();


                    console.log(
                        "Đang thêm sản phẩm:",
                        productId
                    );


                    addToCart(
                        productId
                    );

                };

        }
    );

}


/* =====================================================
   10. THÊM SẢN PHẨM VÀO GIỎ
===================================================== */

function addToCart(productId) {

    console.log(
        "addToCart:",
        productId
    );


    /* ==========================================
       TÌM SẢN PHẨM
    ========================================== */

    const product =
        products.find(
            function (item) {

                return String(
                    item.id
                ).trim() ===
                String(
                    productId
                ).trim();

            }
        );


    if (!product) {

        console.error(
            "KHÔNG TÌM THẤY SẢN PHẨM:",
            productId,
            products
        );


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
            product.stock || 0
        );


    if (
        stock <= 0 ||
        String(
            product.status || ""
        ).trim() !== "Active"
    ) {

        alert(
            "Sản phẩm hiện đã hết hàng."
        );


        return;

    }


    /* ==========================================
       LẤY GIỎ HÀNG
    ========================================== */

    let cart =
        getCart();


    /* ==========================================
       TÌM SẢN PHẨM TRONG GIỎ
    ========================================== */

    const existing =
        cart.find(
            function (item) {

                return String(
                    item.id
                ).trim() ===
                String(
                    productId
                ).trim();

            }
        );


    if (existing) {

        if (
            Number(
                existing.quantity
            ) >= stock
        ) {

            alert(
                "Số lượng sản phẩm đã đạt giới hạn tồn kho."
            );


            return;

        }


        existing.quantity =
            Number(
                existing.quantity
            ) + 1;

    }
    else {

        cart.push({

            id:
                productId,

            quantity:
                1

        });

    }


    /* ==========================================
       LƯU GIỎ
    ========================================== */

    saveCart(
        cart
    );


    /* ==========================================
       CẬP NHẬT SỐ LƯỢNG
    ========================================== */

    updateCartCount();


    /* ==========================================
       THÔNG BÁO
    ========================================== */

    showCartMessage(
        `"${product.name}" đã được thêm vào giỏ hàng.`
    );


    console.log(
        "GIỎ HÀNG HIỆN TẠI:",
        cart
    );

}


/* =====================================================
   11. LẤY GIỎ HÀNG
===================================================== */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "cart"
            );


        if (!savedCart) {

            return [];

        }


        const cart =
            JSON.parse(
                savedCart
            );


        if (
            !Array.isArray(cart)
        ) {

            return [];

        }


        return cart;

    }
    catch (error) {

        console.error(
            "Lỗi đọc giỏ hàng:",
            error
        );


        return [];

    }

}


/* =====================================================
   12. LƯU GIỎ HÀNG
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(
            cart
        )
    );

}


/* =====================================================
   13. CẬP NHẬT SỐ LƯỢNG GIỎ
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
   14. THÔNG BÁO GIỎ HÀNG
===================================================== */

function showCartMessage(message) {

    let notification =
        document.querySelector(
            ".cart-notification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.className =
            "cart-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notification.timer
    );


    notification.timer =
        setTimeout(
            function () {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   15. THÔNG BÁO SẢN PHẨM
===================================================== */

function showProductMessage(message) {

    const productGrid =
        document.querySelector(
            ".product-grid"
        );


    if (!productGrid) {

        return;

    }


    productGrid.innerHTML = `

        <div class="no-products">

            <i class="fa-solid fa-box-open"></i>

            <p>
                ${escapeHTML(
                    message
                )}
            </p>

        </div>

    `;

}


/* =====================================================
   16. ESCAPE HTML
   BẢO VỆ NỘI DUNG HIỂN THỊ
===================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =====================================================
   17. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProductData();

        setupProductSearch();

        setupProductSort();

        updateCartCount();

    }
);