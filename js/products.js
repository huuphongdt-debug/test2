/* =====================================================
   BÁCH SƠN TỬU
   PRODUCT SYSTEM
===================================================== */

/*const API_URL =
    "https://script.google.com/macros/s/AKfycbzg8M1Q-2GtK9Noe_IuvYwMehzPYOwyTeUfNWHUTKdl0bF4m0lq4auEpQRzjbgGXbJl/exec";

/* =====================================================
   0. BIẾN TOÀN CỤC
===================================================== */

let products = [];

let categories = [];

let currentProducts = [];

let currentCategory = "all";

let currentSearch = "";

let currentSort = "default";


/* =====================================================
   1. ĐỌC DỮ LIỆU
===================================================== */

async function loadProductData() {

    try {

        /* ==========================================
           LẤY SẢN PHẨM
           Google Sheets + Cache
        ========================================== */

        products = await getProducts();


        /* ==========================================
           KIỂM TRA DỮ LIỆU
        ========================================== */

        if (!products || products.length === 0) {

            console.error(
                "Không có dữ liệu sản phẩm."
            );

            return;

        }


        /* ==========================================
           LẤY DANH MỤC
        ========================================== */

        try {

            const response =
                await fetch(
                    "data/categories.json"
                );


            if (response.ok) {

                categories =
                    await response.json();

            }

        } catch (error) {

            console.warn(
                "Không thể tải categories.json:",
                error
            );

        }


        /* ==========================================
           HIỂN THỊ SẢN PHẨM
        ========================================== */

        renderProducts(products);


    } catch (error) {

        console.error(
            "Lỗi tải dữ liệu sản phẩm:",
            error
        );

    }

}

/* =====================================================
   CẬP NHẬT SẢN PHẨM KHI GOOGLE SHEETS CÓ DỮ LIỆU MỚI
===================================================== */

window.addEventListener(
    "productsUpdated",
    function (event) {

        const newProducts =
            event.detail;


        if (
            !Array.isArray(newProducts) ||
            newProducts.length === 0
        ) {
            return;
        }


        products =
            newProducts;


        currentProducts =
            newProducts;


        renderProducts(
            newProducts
        );


        console.log(
            "Giao diện sản phẩm đã được cập nhật."
        );

    }
);

/* =====================================================
   2. TÌM TÊN DANH MỤC
===================================================== */

function getCategoryName(categoryId) {

    const category =
        categories.find(
            item => item.id === categoryId
        );


    if (category) {

        return category.name;

    }


    return categoryId;

}


/* =====================================================
   3. HIỂN THỊ DANH MỤC
===================================================== */

function renderCategories() {

    const categoryContainer =
        document.querySelector(
            ".product-categories"
        );


    if (!categoryContainer) {

        return;

    }


    categoryContainer.innerHTML = "";


    /* TẤT CẢ */

    const allButton =
        document.createElement("button");

    allButton.className =
        "category-button active";

    allButton.dataset.category =
        "all";

    allButton.textContent =
        "Tất cả";


    categoryContainer.appendChild(
        allButton
    );


    /* CÁC DANH MỤC */

    categories.forEach(function (category) {

        const button =
            document.createElement("button");


        button.className =
            "category-button";


        button.dataset.category =
            category.id;


        button.textContent =
            category.name;


        categoryContainer.appendChild(
            button
        );

    });


    addCategoryEvents();

}


/* =====================================================
   4. SỰ KIỆN DANH MỤC
===================================================== */

function addCategoryEvents() {

    const buttons =
        document.querySelectorAll(
            ".category-button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const category =
                    this.dataset.category;


                currentCategory =
                    category;


                buttons.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                filterProducts();

            }
        );

    });

}


/* =====================================================
   5. HIỂN THỊ SẢN PHẨM
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


    if (
        !productList ||
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


    productList.forEach(function (product) {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        const isOutOfStock =
            product.stock <= 0 ||
            product.status === "Hết hàng";


        const priceHTML =
            product.oldPrice > product.price

                ? `

                    <div class="product-price-box">

                        <del class="product-old-price">

                            ${formatPrice(
                                product.oldPrice
                            )}

                        </del>

                        <strong class="product-price">

                            ${formatPrice(
                                product.price
                            )}

                        </strong>

                    </div>

                  `

                : `

                    <strong class="product-price">

                        ${formatPrice(
                            product.price
                        )}

                    </strong>

                  `;


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>


            <div class="product-info">


                <span class="product-category">

                    ${getCategoryName(
                        product.category
                    )}

                </span>


                <h3>

                    ${product.name} ${product.volume}

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
                        ? "HẾT HÀNG"
                        : "THÊM VÀO GIỎ"
                    }

                </button>


                <a
                    href="product-detail.html?slug=${product.slug}"
                    class="product-detail-button"
                >

                    XEM CHI TIẾT

                    <i
                        class="fa-solid fa-arrow-right"
                    ></i>

                </a>


            </div>

        `;


        productGrid.appendChild(card);

    });


    addCartEvents();

}


/* =====================================================
   6. TÌM KIẾM + LỌC + SẮP XẾP
===================================================== */

function filterProducts() {

    let result =
        [...products];


    /* LỌC DANH MỤC */

    if (
        currentCategory !== "all"
    ) {

        result =
            result.filter(function (product) {

                return (
                    product.category ===
                    currentCategory
                );

            });

    }


    /* TÌM KIẾM */

    if (
        currentSearch.trim() !== ""
    ) {

        const keyword =
            currentSearch
                .toLowerCase()
                .trim();


        result =
            result.filter(function (product) {

                return (

                    product.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    product.shortDescription
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    getCategoryName(
                        product.category
                    )
                        .toLowerCase()
                        .includes(keyword)

                );

            });

    }


    /* SẮP XẾP */

    switch (currentSort) {


        case "price-low":

            result.sort(function (a, b) {

                return a.price - b.price;

            });

            break;


        case "price-high":

            result.sort(function (a, b) {

                return b.price - a.price;

            });

            break;


        case "name":

            result.sort(function (a, b) {

                return a.name.localeCompare(
                    b.name,
                    "vi"
                );

            });

            break;


        case "featured":

            result.sort(function (a, b) {

                return (
                    Number(b.featured) -
                    Number(a.featured)
                );

            });

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
   7. TÌM KIẾM
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
   8. SẮP XẾP
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
   9. ĐỊNH DẠNG GIÁ
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "vi-VN"
    ).format(price) + "đ";

}


/* =====================================================
   NÚT THÊM VÀO GIỎ
===================================================== */

function addCartEvents() {

    const buttons =
        document.querySelectorAll(".add-to-cart");

    console.log(
        "Số nút thêm giỏ:",
        buttons.length
    );

    buttons.forEach(function (button) {

        button.onclick = function () {

            const productId =
                String(this.dataset.id).trim();

            console.log(
                "Đang thêm sản phẩm:",
                productId
            );

            addToCart(productId);

        };

    });

}

/* =====================================================
   THÔNG BÁO THÊM VÀO GIỎ HÀNG
===================================================== */

function showCartNotification(productName) {

    const oldNotification =
        document.querySelector(".cart-notification");

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification =

        document.createElement("div");

    notification.className =
        "cart-notification";

    notification.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>

        <span>
            Đã thêm <strong>${productName}</strong>
            vào giỏ hàng
        </span>
    `;

    document.body.appendChild(notification);

    setTimeout(function () {

        notification.classList.add("hide");

        setTimeout(function () {
            notification.remove();
        }, 300);

    }, 2500);
}

/* =====================================================
   THÊM SẢN PHẨM VÀO GIỎ
===================================================== */

function addToCart(productId) {

    console.log(
        "addToCart:",
        productId
    );


    /* TÌM SẢN PHẨM */

    const product =
        products.find(function (item) {

            return String(item.id).trim() ===
                   String(productId).trim();

        });


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


    /* KIỂM TRA TỒN KHO */

    const stock =
        Number(product.stock);


    if (
        stock <= 0 ||
        String(product.status).trim() ===
        "Hết hàng"
    ) {

        alert(
            "Sản phẩm hiện đã hết hàng."
        );

        return;

    }


    /* LẤY GIỎ HÀNG */

    let cart = getCart();


    /* TÌM SẢN PHẨM TRONG GIỎ */

    const existing =
        cart.find(function (item) {

            return String(item.id).trim() ===
                   String(productId).trim();

        });


    if (existing) {

        if (
            Number(existing.quantity) >=
            stock
        ) {

            alert(
                "Số lượng sản phẩm đã đạt giới hạn tồn kho."
            );

            return;

        }


        existing.quantity =
            Number(existing.quantity) + 1;

    } else {

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    /* LƯU GIỎ HÀNG */

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    /* CẬP NHẬT SỐ LƯỢNG */

    updateCartCount();


    /* THÔNG BÁO */

    showCartMessage(
        `"${product.name}" đã được thêm vào giỏ hàng.`
    );


    console.log(
        "GIỎ HÀNG HIỆN TẠI:",
        cart
    );

}


/* =====================================================
   LẤY GIỎ HÀNG
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
            "Lỗi đọc localStorage:",
            error
        );

        return [];

    }

}


/* =====================================================
   13. LƯU GIỎ HÀNG
===================================================== */

function saveCart(cart) {

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

}


/* =====================================================
   14. ĐẾM SỐ LƯỢNG GIỎ HÀNG
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
        document.querySelector(".cart-count");

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
   HIỂN THỊ SỐ LƯỢNG GIỎ HÀNG KHI MỞ TRANG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

    }
);


/* =====================================================
   15. THÔNG BÁO GIỎ HÀNG
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
        setTimeout(function () {

            notification.classList.remove(
                "show"
            );

        }, 2500);

}


/* =====================================================
   16. THÔNG BÁO SẢN PHẨM
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

            <p>
                ${message}
            </p>

        </div>

    `;

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

    }
);