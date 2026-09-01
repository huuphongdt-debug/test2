/* =====================================================
   ADMIN STOCK ISSUE
   BÁCH SƠN TỬU
   QUẢN LÝ PHIẾU XUẤT KHO
===================================================== */

console.log("=================================");
console.log("ADMIN STOCK ISSUE: ĐÃ KẾT NỐI");
console.log("=================================");


/* =====================================================
   BIẾN TOÀN CỤC
===================================================== */

let stockIssueProducts = [];

let stockIssueInventory = [];

let stockIssueItems = [];

let stockIssueModal = null;


/* =====================================================
   1. KHỞI TẠO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "stockIssueButton"
            );


        if (!button) {

            console.warn(
                "⚠️ Không tìm thấy stockIssueButton"
            );

            return;
        }


        button.addEventListener(
            "click",
            openStockIssueModal
        );


        console.log(
            "✅ Đã gắn sự kiện nút Xuất kho"
        );

    }
);


/* =====================================================
   2. TẠO MÃ PHIẾU XUẤT
===================================================== */

function generateIssueCode() {

    const now = new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const time =
        String(
            now.getHours()
        ).padStart(2, "0") +

        String(
            now.getMinutes()
        ).padStart(2, "0") +

        String(
            now.getSeconds()
        ).padStart(2, "0");


    return (
        "PX-" +
        year +
        month +
        day +
        "-" +
        time
    );
}


/* =====================================================
   3. FORMAT TIỀN
===================================================== */

function formatIssueMoney(value) {

    return (
        Number(value || 0)
            .toLocaleString("vi-VN") +
        "đ"
    );
}


/* =====================================================
   4. MỞ MODAL
===================================================== */

async function openStockIssueModal() {

    console.log(
        "📤 MỞ MODAL XUẤT KHO"
    );


    stockIssueItems = [
        {
            product_id: "",
            quantity: 1,
            unit_cost: 0
        }
    ];


    await loadStockIssueProducts();


    await loadStockIssueInventory();


    createStockIssueModal();


    renderStockIssueItems();

}


/* =====================================================
   5. LẤY DANH SÁCH SẢN PHẨM
===================================================== */

async function loadStockIssueProducts() {

    console.log(
        "📦 ĐANG TẢI SẢN PHẨM CHO PHIẾU XUẤT"
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select(`
                id,
                product_code,
                name,
                cost_price,
                stock,
                status
            `)
            .order(
                "product_code",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "❌ LỖI TẢI SẢN PHẨM:",
            error
        );


        alert(
            "Không thể tải danh sách sản phẩm."
        );


        stockIssueProducts = [];


        return;
    }


    stockIssueProducts =
        data || [];


    console.log(
        "✅ SẢN PHẨM XUẤT:",
        stockIssueProducts
    );

}


/* =====================================================
   6. LẤY TỒN KHO THỰC TẾ
===================================================== */

async function loadStockIssueInventory() {

    console.log(
        "📦 ĐANG TẢI TỒN KHO THỰC TẾ"
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("inventory")
            .select(`
                product_id,
                quantity,
                updated_at
            `);


    if (error) {

        console.error(
            "❌ LỖI TẢI INVENTORY:",
            error
        );


        alert(
            "Không thể tải tồn kho."
        );


        stockIssueInventory = [];


        return;
    }


    stockIssueInventory =
        data || [];


    console.log(
        "✅ INVENTORY XUẤT:",
        stockIssueInventory
    );

}


/* =====================================================
   7. LẤY TỒN CỦA SẢN PHẨM
===================================================== */

function getIssueProductStock(productId) {

    const inventory =
        stockIssueInventory.find(
            function (item) {

                return (
                    item.product_id ===
                    productId
                );

            }
        );


    if (!inventory) {

        return 0;

    }


    return Number(
        inventory.quantity
    ) || 0;

}


/* =====================================================
   8. LẤY SẢN PHẨM
===================================================== */

function getIssueProduct(productId) {

    return stockIssueProducts.find(
        function (product) {

            return (
                product.id ===
                productId
            );

        }
    );

}


/* =====================================================
   9. TẠO MODAL
===================================================== */

function createStockIssueModal() {

    removeStockIssueModal();


    stockIssueModal =
        document.createElement("div");


    stockIssueModal.id =
        "stockIssueModal";


    /*
       Dùng lại hệ thống CSS modal
       tương tự phần Nhập kho
    */

    stockIssueModal.className =
        "stock-receipt-overlay";


    stockIssueModal.innerHTML = `

        <div
            class="stock-receipt-modal"
            style="max-width:1100px;"
        >

            <!-- =========================
                 HEADER
            ========================== -->

            <div class="stock-receipt-header">

                <div>

                    <h2>
                        📤 Xuất kho
                    </h2>

                    <p>
                        Tạo phiếu xuất kho mới
                    </p>

                </div>


                <button
                    type="button"
                    id="closeStockIssueButton"
                    class="stock-receipt-close"
                >
                    ×
                </button>

            </div>


            <!-- =========================
                 BODY
            ========================== -->

            <div class="stock-receipt-body">


                <!-- THÔNG TIN PHIẾU -->

                <div
                    class="stock-receipt-info-grid"
                >

                    <div>

                        <label>
                            Người nhận
                        </label>

                        <input
                            type="text"
                            id="stockIssueRecipient"
                            placeholder="Nhập tên người nhận / khách hàng"
                        >

                    </div>


                    <div>

                        <label>
                            Ghi chú
                        </label>

                        <input
                            type="text"
                            id="stockIssueNote"
                            placeholder="Ghi chú phiếu xuất"
                        >

                    </div>

                </div>


                <!-- =====================
                     SẢN PHẨM
                ====================== -->

                <div
                    class="stock-receipt-product-header"
                >

                    <h3>
                        Sản phẩm xuất
                    </h3>


                    <button
                        type="button"
                        id="addStockIssueProduct"
                        class="stock-receipt-add-button"
                    >
                        + Thêm sản phẩm
                    </button>

                </div>


                <div
                    id="stockIssueItems"
                    class="stock-receipt-items"
                >
                </div>


                <!-- =====================
                     TỔNG
                ====================== -->

                <div
                    class="stock-receipt-total"
                >

                    <span>
                        Tổng giá trị xuất
                    </span>


                    <strong
                        id="stockIssueTotal"
                    >
                        0đ
                    </strong>

                </div>


            </div>


            <!-- =========================
                 FOOTER
            ========================== -->

            <div
                class="stock-receipt-footer"
            >

                <button
                    type="button"
                    id="cancelStockIssueButton"
                    class="stock-receipt-cancel"
                >
                    Hủy
                </button>


                <button
                    type="button"
                    id="saveStockIssueButton"
                    class="stock-receipt-cancel"
                >
                    Lưu nháp
                </button>


                <button
                    type="button"
                    id="confirmStockIssueButton"
                    class="stock-receipt-save"
                >
                    Xác nhận xuất kho
                </button>

            </div>


        </div>

    `;


    document.body.appendChild(
        stockIssueModal
    );


    /* =================================================
       EVENTS
    ================================================= */


    document
        .getElementById(
            "closeStockIssueButton"
        )
        .addEventListener(
            "click",
            closeStockIssueModal
        );


    document
        .getElementById(
            "cancelStockIssueButton"
        )
        .addEventListener(
            "click",
            closeStockIssueModal
        );


    document
        .getElementById(
            "addStockIssueProduct"
        )
        .addEventListener(
            "click",
            function () {

                stockIssueItems.push({

                    product_id: "",

                    quantity: 1,

                    unit_cost: 0

                });


                renderStockIssueItems();

            }
        );


    document
        .getElementById(
            "saveStockIssueButton"
        )
        .addEventListener(
            "click",
            saveStockIssue
        );


    document
        .getElementById(
            "confirmStockIssueButton"
        )
        .addEventListener(
            "click",
            confirmStockIssue
        );


    /*
       Click nền để đóng
    */

    stockIssueModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                stockIssueModal
            ) {

                closeStockIssueModal();

            }

        }
    );

}


/* =====================================================
   10. HIỂN THỊ SẢN PHẨM
===================================================== */

function renderStockIssueItems() {

    const container =
        document.getElementById(
            "stockIssueItems"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        stockIssueItems
            .map(
                function (item, index) {

                    const product =
                        getIssueProduct(
                            item.product_id
                        );


                    const stock =
                        getIssueProductStock(
                            item.product_id
                        );


                    const itemTotal =
                        Number(
                            item.quantity || 0
                        ) *
                        Number(
                            item.unit_cost || 0
                        );


                    return `

                        <div
                            class="stock-receipt-item"
                            data-index="${index}"
                        >

                            <!-- SẢN PHẨM -->

                            <div>

                                <label>
                                    Sản phẩm
                                </label>

                                <select
                                    class="issue-product-select"
                                    data-index="${index}"
                                >

                                    <option value="">
                                        -- Chọn sản phẩm --
                                    </option>

                                    ${
                                        stockIssueProducts
                                            .map(
                                                function(product) {

                                                    const currentStock =
                                                        getIssueProductStock(
                                                            product.id
                                                        );


                                                    return `

                                                        <option
                                                            value="${product.id}"
                                                            ${
                                                                item.product_id ===
                                                                product.id
                                                                    ? "selected"
                                                                    : ""
                                                            }
                                                        >

                                                            ${product.product_code}
                                                            -
                                                            ${product.name}
                                                            |
                                                            Tồn:
                                                            ${currentStock}

                                                        </option>

                                                    `;

                                                }
                                            )
                                            .join("")
                                    }

                                </select>


                                ${
                                    product
                                        ? `
                                            <small
                                                style="
                                                    display:block;
                                                    margin-top:6px;
                                                    color:#777;
                                                "
                                            >
                                                Tồn hiện tại:
                                                <strong>
                                                    ${stock.toLocaleString("vi-VN")}
                                                </strong>
                                            </small>
                                          `
                                        : ""
                                }

                            </div>


                            <!-- SỐ LƯỢNG -->

                            <div>

                                <label>
                                    Số lượng
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max="${stock || 1}"
                                    class="issue-quantity-input"
                                    data-index="${index}"
                                    value="${item.quantity}"
                                >

                            </div>


                            <!-- GIÁ VỐN -->

                            <div>

                                <label>
                                    Giá vốn
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    class="issue-cost-input"
                                    data-index="${index}"
                                    value="${item.unit_cost}"
                                >

                            </div>


                            <!-- THÀNH TIỀN -->

                            <div>

                                <label>
                                    Thành tiền
                                </label>

                                <strong
                                    class="issue-item-total"
                                >
                                    ${formatIssueMoney(itemTotal)}
                                </strong>

                            </div>


                            <!-- XÓA -->

                            <button
                                type="button"
                                class="issue-remove-button"
                                data-index="${index}"
                            >
                                ×
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    attachStockIssueItemEvents();


    updateStockIssueTotal();

}


/* =====================================================
   11. EVENT TỪNG DÒNG
===================================================== */

function attachStockIssueItemEvents() {


    /* =================================================
       CHỌN SẢN PHẨM
    ================================================= */

    const selects =
        document.querySelectorAll(
            ".issue-product-select"
        );


    selects.forEach(
        function (select) {

            select.addEventListener(
                "change",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const product =
                        getIssueProduct(
                            this.value
                        );


                    stockIssueItems[index]
                        .product_id =
                        this.value;


                    /*
                       Tự lấy giá vốn
                    */

                    if (product) {

                        stockIssueItems[index]
                            .unit_cost =
                            Number(
                                product.cost_price
                            ) || 0;

                    } else {

                        stockIssueItems[index]
                            .unit_cost = 0;

                    }


                    /*
                       Khi chọn sản phẩm
                       reset số lượng về 1
                    */

                    stockIssueItems[index]
                        .quantity = 1;


                    renderStockIssueItems();

                }
            );

        }
    );


    /* =================================================
       SỐ LƯỢNG
    ================================================= */

    const quantityInputs =
        document.querySelectorAll(
            ".issue-quantity-input"
        );


    quantityInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    let quantity =
                        Number(
                            this.value
                        );


                    if (
                        !Number.isFinite(
                            quantity
                        ) ||
                        quantity < 1
                    ) {

                        quantity = 1;

                    }


                    /*
                       Lấy tồn thực tế
                    */

                    const productId =
                        stockIssueItems[index]
                            .product_id;


                    const stock =
                        getIssueProductStock(
                            productId
                        );


                    /*
                       Không cho nhập vượt tồn
                    */

                    if (
                        stock > 0 &&
                        quantity > stock
                    ) {

                        quantity = stock;

                        this.value =
                            stock;

                    }


                    stockIssueItems[index]
                        .quantity =
                        quantity;


                    updateStockIssueTotal();

                }
            );

        }
    );


    /* =================================================
       GIÁ VỐN
    ================================================= */

    const costInputs =
        document.querySelectorAll(
            ".issue-cost-input"
        );


    costInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    let cost =
                        Number(
                            this.value
                        );


                    if (
                        !Number.isFinite(
                            cost
                        ) ||
                        cost < 0
                    ) {

                        cost = 0;

                    }


                    stockIssueItems[index]
                        .unit_cost =
                        cost;


                    updateStockIssueTotal();

                }
            );

        }
    );


    /* =================================================
       XÓA DÒNG
    ================================================= */

    const removeButtons =
        document.querySelectorAll(
            ".issue-remove-button"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    if (
                        stockIssueItems.length <=
                        1
                    ) {

                        alert(
                            "Phiếu xuất phải có ít nhất 1 sản phẩm."
                        );

                        return;

                    }


                    stockIssueItems.splice(
                        index,
                        1
                    );


                    renderStockIssueItems();

                }
            );

        }
    );

}


/* =====================================================
   12. TÍNH TỔNG
===================================================== */

function updateStockIssueTotal() {

    let total = 0;


    stockIssueItems.forEach(
        function (item, index) {

            const itemTotal =
                Number(
                    item.quantity || 0
                ) *
                Number(
                    item.unit_cost || 0
                );


            total +=
                itemTotal;


            const element =
                document.querySelector(
                    `.stock-receipt-item[data-index="${index}"] .issue-item-total`
                );


            if (element) {

                element.textContent =
                    formatIssueMoney(
                        itemTotal
                    );

            }

        }
    );


    const totalElement =
        document.getElementById(
            "stockIssueTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            formatIssueMoney(
                total
            );

    }

}


/* =====================================================
   13. KIỂM TRA DỮ LIỆU
===================================================== */

function validateStockIssue() {

    const recipientElement =
        document.getElementById(
            "stockIssueRecipient"
        );


    if (!recipientElement) {

        alert(
            "Không tìm thấy ô Người nhận."
        );

        return false;

    }


    const recipient =
        recipientElement.value.trim();


    if (!recipient) {

        alert(
            "Vui lòng nhập người nhận."
        );

        recipientElement.focus();

        return false;

    }


    if (
        stockIssueItems.length ===
        0
    ) {

        alert(
            "Phiếu xuất chưa có sản phẩm."
        );

        return false;

    }


    /*
       Kiểm tra từng dòng
    */

    for (
        let i = 0;
        i < stockIssueItems.length;
        i++
    ) {

        const item =
            stockIssueItems[i];


        if (!item.product_id) {

            alert(
                "Vui lòng chọn sản phẩm ở dòng " +
                (i + 1)
            );

            return false;

        }


        const quantity =
            Number(
                item.quantity
            );


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity <= 0
        ) {

            alert(
                "Số lượng ở dòng " +
                (i + 1) +
                " không hợp lệ."
            );

            return false;

        }


        /*
           Kiểm tra tồn
        */

        const stock =
            getIssueProductStock(
                item.product_id
            );


        if (
            stock <= 0
        ) {

            const product =
                getIssueProduct(
                    item.product_id
                );


            alert(
                "Sản phẩm " +
                (
                    product
                        ? product.product_code
                        : ""
                ) +
                " hiện không còn tồn kho."
            );

            return false;

        }


        if (
            quantity > stock
        ) {

            const product =
                getIssueProduct(
                    item.product_id
                );


            alert(
                "Sản phẩm " +
                (
                    product
                        ? product.product_code
                        : ""
                ) +
                " chỉ còn " +
                stock.toLocaleString(
                    "vi-VN"
                ) +
                " sản phẩm."
            );

            return false;

        }


        /*
           Kiểm tra giá vốn
        */

        const cost =
            Number(
                item.unit_cost
            );


        if (
            !Number.isFinite(
                cost
            ) ||
            cost < 0
        ) {

            alert(
                "Giá vốn ở dòng " +
                (i + 1) +
                " không hợp lệ."
            );

            return false;

        }

    }


    /*
       Không cho cùng một sản phẩm
       xuất nhiều dòng
    */

    const productIds =
        stockIssueItems.map(
            function (item) {

                return item.product_id;

            }
        );


    const uniqueProductIds =
        new Set(
            productIds
        );


    if (
        uniqueProductIds.size !==
        productIds.length
    ) {

        alert(
            "Một sản phẩm đang xuất hiện nhiều dòng. " +
            "Vui lòng gộp số lượng vào một dòng."
        );

        return false;

    }


    return true;

}


/* =====================================================
   14. LẤY USER ADMIN
===================================================== */

async function getStockIssueUser() {

    const {
        data: authData,
        error: authError
    } =
        await supabaseClient.auth.getUser();


    if (
        authError ||
        !authData.user
    ) {

        throw new Error(
            "Không xác định được tài khoản đăng nhập."
        );

    }


    const authUser =
        authData.user;


    /*
       Lấy public user giống hệ thống
       đang dùng ở phần Nhập kho.
    */

    const {
        data: publicUser,
        error: publicUserError
    } =
        await supabaseClient
            .from("users")
            .select(`
                user_id,
                auth_user_id,
                name,
                email
            `)
            .eq(
                "auth_user_id",
                authUser.id
            )
            .single();


    if (
        publicUserError ||
        !publicUser
    ) {

        throw new Error(
            "Không tìm thấy tài khoản quản trị trong hệ thống."
        );

    }


    return {
        authUser: authUser,
        publicUser: publicUser
    };

}


/* =====================================================
   15. TÍNH TỔNG GIÁ TRỊ
===================================================== */

function calculateStockIssueTotal() {

    let total = 0;


    stockIssueItems.forEach(
        function (item) {

            total +=
                Number(
                    item.quantity || 0
                ) *
                Number(
                    item.unit_cost || 0
                );

        }
    );


    return total;

}


/* =====================================================
   16. TẠO PHIẾU DRAFT
===================================================== */

async function createStockIssueDraft() {

    const recipient =
        document
            .getElementById(
                "stockIssueRecipient"
            )
            .value
            .trim();


    const note =
        document
            .getElementById(
                "stockIssueNote"
            )
            .value
            .trim();


    const issueCode =
        generateIssueCode();


    const totalValue =
        calculateStockIssueTotal();


    const {
        publicUser
    } =
        await getStockIssueUser();


    /* =================================================
       INSERT PHIẾU XUẤT
    ================================================= */

    const {
        data: issue,
        error: issueError
    } =
        await supabaseClient
            .from("stock_issues")
            .insert({

                issue_code:
                    issueCode,

                recipient:
                    recipient,

                note:
                    note || null,

                total_value:
                    totalValue,

                status:
                    "DRAFT",

                created_by:
                    publicUser.user_id

            })
            .select()
            .single();


    if (issueError) {

        throw issueError;

    }


    console.log(
        "✅ ĐÃ TẠO PHIẾU XUẤT:",
        issue
    );


    /* =================================================
       TẠO CHI TIẾT
    ================================================= */

    const issueItems =
        stockIssueItems.map(
            function (item) {

                const itemTotal =
                    Number(
                        item.quantity
                    ) *
                    Number(
                        item.unit_cost
                    );


                return {

                    issue_id:
                        issue.id,

                    product_id:
                        item.product_id,

                    quantity:
                        Number(
                            item.quantity
                        ),

                    unit_cost:
                        Number(
                            item.unit_cost
                        ),

                    total_value:
                        itemTotal

                };

            }
        );


    const {
        error: itemsError
    } =
        await supabaseClient
            .from("stock_issue_items")
            .insert(
                issueItems
            );


    if (itemsError) {

        /*
           Nếu chi tiết lỗi,
           xóa phiếu DRAFT vừa tạo.
        */

        await supabaseClient
            .from("stock_issues")
            .delete()
            .eq(
                "id",
                issue.id
            );


        throw itemsError;

    }


    console.log(
        "✅ ĐÃ LƯU CHI TIẾT PHIẾU XUẤT"
    );


    return issue;

}


/* =====================================================
   17. LƯU PHIẾU NHÁP
===================================================== */

async function saveStockIssue() {

    console.log(
        "💾 ĐANG LƯU PHIẾU XUẤT DRAFT"
    );


    if (
        !validateStockIssue()
    ) {

        return;

    }


    const saveButton =
        document.getElementById(
            "saveStockIssueButton"
        );


    saveButton.disabled =
        true;


    saveButton.textContent =
        "Đang lưu...";


    try {

        const issue =
            await createStockIssueDraft();


        alert(
            "Đã lưu phiếu xuất " +
            issue.issue_code +
            " ở trạng thái DRAFT."
        );


        closeStockIssueModal();


        refreshInventoryAfterStockChange();

    }
    catch (error) {

        console.error(
            "❌ LỖI LƯU PHIẾU XUẤT:",
            error
        );


        alert(
            "Không thể lưu phiếu xuất.\n\n" +
            (
                error.message ||
                "Lỗi không xác định."
            )
        );

    }
    finally {

        saveButton.disabled =
            false;


        saveButton.textContent =
            "Lưu nháp";

    }

}


/* =====================================================
   18. XÁC NHẬN XUẤT KHO
===================================================== */

async function confirmStockIssue() {

    console.log(
        "📤 ĐANG XÁC NHẬN XUẤT KHO"
    );


    if (
        !validateStockIssue()
    ) {

        return;

    }


    const confirmButton =
        document.getElementById(
            "confirmStockIssueButton"
        );


    const saveButton =
        document.getElementById(
            "saveStockIssueButton"
        );


    const confirmed =
        window.confirm(
            "Bạn có chắc chắn muốn xác nhận xuất kho?\n\n" +
            "Sau khi xác nhận:\n" +
            "- Tồn kho sẽ bị trừ.\n" +
            "- Giao dịch sẽ được ghi vào lịch sử kho.\n" +
            "- Phiếu sẽ chuyển sang CONFIRMED."
        );


    if (!confirmed) {

        return;

    }


    confirmButton.disabled =
        true;


    saveButton.disabled =
        true;


    confirmButton.textContent =
        "Đang xử lý...";


    let issue = null;


    try {

        /*
           =========================================
           1. TẠO PHIẾU DRAFT
           =========================================
        */

        issue =
            await createStockIssueDraft();


        console.log(
            "✅ DRAFT ĐÃ TẠO:",
            issue
        );


        /*
           =========================================
           2. GỌI RPC
           =========================================
        */

        const {
            data,
            error
        } =
            await supabaseClient.rpc(
                "confirm_stock_issue",
                {
                    p_issue_id:
                        issue.id
                }
            );


        console.log(
            "CONFIRM STOCK ISSUE DATA:",
            data
        );


        console.log(
            "CONFIRM STOCK ISSUE ERROR:",
            error
        );


        if (error) {

            throw error;

        }


        /*
           RPC có thể trả JSON
        */

        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                (
                    data &&
                    data.message
                ) ||
                "Không thể xác nhận phiếu xuất kho."
            );

        }


        /*
           =========================================
           3. THÀNH CÔNG
           =========================================
        */

        alert(
            "Xuất kho thành công!\n\n" +

            "Mã phiếu: " +
            issue.issue_code +

            "\nTổng giá trị: " +
            formatIssueMoney(
                data.total_value
            )
        );


        console.log(
            "================================="
        );


        console.log(
            "✅ XUẤT KHO THÀNH CÔNG"
        );


        console.log(
            "Phiếu:",
            issue.issue_code
        );


        console.log(
            "Kết quả RPC:",
            data
        );


        console.log(
            "================================="
        );


        closeStockIssueModal();


        /*
           Cập nhật giao diện kho
        */

        refreshInventoryAfterStockChange();

    }
    catch (error) {

        console.error(
            "❌ LỖI XÁC NHẬN XUẤT KHO:",
            error
        );


        /*
           Nếu DRAFT đã được tạo nhưng
           RPC lỗi thì KHÔNG xóa phiếu.

           Giữ lại DRAFT để kiểm tra / xử lý.
        */

        let message =
            error.message ||
            "Lỗi không xác định.";


        /*
           Chuyển một số lỗi PostgreSQL
           thành thông báo dễ hiểu.
        */

        if (
            message
                .toLowerCase()
                .includes(
                    "không đủ tồn kho"
                )
        ) {

            message =
                "Không đủ tồn kho để xuất sản phẩm.";

        }


        alert(
            "Không thể xác nhận xuất kho.\n\n" +
            message +
            (
                issue
                    ? "\n\nPhiếu DRAFT đã được giữ lại: " +
                      issue.issue_code
                    : ""
            )
        );

    }
    finally {

        confirmButton.disabled =
            false;


        saveButton.disabled =
            false;


        confirmButton.textContent =
            "Xác nhận xuất kho";

    }

}


/* =====================================================
   19. CẬP NHẬT GIAO DIỆN KHO
===================================================== */

function refreshInventoryAfterStockChange() {

    console.log(
        "🔄 ĐANG CẬP NHẬT GIAO DIỆN KHO"
    );


    /*
       Các hàm này được kiểm tra trước
       để tránh lỗi nếu chưa tồn tại.
    */


    if (
        typeof loadInventoryData ===
        "function"
    ) {

        loadInventoryData();

    }


    if (
        typeof loadInventoryValue ===
        "function"
    ) {

        loadInventoryValue();

    }


    if (
        typeof loadLowStockProducts ===
        "function"
    ) {

        loadLowStockProducts();

    }


    if (
        typeof loadStockInStats ===
        "function"
    ) {

        loadStockInStats();

    }


    /*
       Một số phiên bản admin-inventory
       có thể sử dụng hàm khác.
    */

    if (
        typeof loadStockOutStats ===
        "function"
    ) {

        loadStockOutStats();

    }


    /*
       Thông báo cho các JS khác
       nếu cần cập nhật.
    */

    document.dispatchEvent(
        new CustomEvent(
            "stockUpdated"
        )
    );

}


/* =====================================================
   20. ĐÓNG MODAL
===================================================== */

function closeStockIssueModal() {

    removeStockIssueModal();

}


/* =====================================================
   21. XÓA MODAL
===================================================== */

function removeStockIssueModal() {

    const oldModal =
        document.getElementById(
            "stockIssueModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    stockIssueModal =
        null;

}


/* =====================================================
   22. DEBUG
===================================================== */

window.stockIssueDebug = {

    getProducts:
        function () {

            return stockIssueProducts;

        },


    getInventory:
        function () {

            return stockIssueInventory;

        },


    getItems:
        function () {

            return stockIssueItems;

        },


    calculateTotal:
        function () {

            return calculateStockIssueTotal();

        }

};


console.log(
    "================================="
);

console.log(
    "ADMIN STOCK ISSUE JS: SẴN SÀNG"
);

console.log(
    "================================="
);