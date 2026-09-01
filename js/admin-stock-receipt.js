/* =====================================================
   ADMIN STOCK RECEIPT
   BÁCH SƠN TỬU
   QUẢN LÝ PHIẾU NHẬP KHO
===================================================== */

console.log("=================================");
console.log("ADMIN STOCK RECEIPT: ĐÃ KẾT NỐI");
console.log("=================================");


/* =====================================================
   BIẾN TOÀN CỤC
===================================================== */

let stockReceiptProducts = [];

let stockReceiptItems = [];

let stockReceiptModal = null;


/* =====================================================
   1. KHỞI TẠO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "stockReceiptButton"
            );

        if (!button) {

            console.warn(
                "⚠️ Không tìm thấy stockReceiptButton"
            );

            return;
        }


        button.addEventListener(
            "click",
            openStockReceiptModal
        );


        console.log(
            "✅ Đã gắn sự kiện nút Nhập kho"
        );

    }
);


/* =====================================================
   2. TẠO MÃ PHIẾU NHẬP
===================================================== */

function generateReceiptCode() {

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
        "PN-" +
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

function formatMoney(value) {

    return (
        Number(value || 0)
            .toLocaleString("vi-VN") +
        "đ"
    );
}


/* =====================================================
   4. MỞ MODAL
===================================================== */

async function openStockReceiptModal() {

    console.log(
        "📥 MỞ MODAL NHẬP KHO"
    );


    stockReceiptItems = [
        {
            product_id: "",
            quantity: 1,
            unit_cost: 0
        }
    ];


    await loadStockReceiptProducts();

    createStockReceiptModal();

    renderStockReceiptItems();

}


/* =====================================================
   5. LẤY DANH SÁCH SẢN PHẨM
===================================================== */

async function loadStockReceiptProducts() {

    console.log(
        "📦 ĐANG TẢI SẢN PHẨM CHO PHIẾU NHẬP"
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("products")
        .select(`
            id,
            product_code,
            name,
            cost_price,
            stock
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

        return;
    }


    stockReceiptProducts =
        data || [];


    console.log(
        "✅ SẢN PHẨM NHẬP:",
        stockReceiptProducts
    );
}


/* =====================================================
   6. TẠO MODAL
===================================================== */

function createStockReceiptModal() {

    removeStockReceiptModal();


    stockReceiptModal =
        document.createElement("div");

    stockReceiptModal.id =
        "stockReceiptModal";

    stockReceiptModal.className =
        "stock-receipt-overlay";


    stockReceiptModal.innerHTML = `

        <div class="stock-receipt-modal">

            <!-- HEADER -->

            <div class="stock-receipt-header">

                <div>

                    <h2>
                        📥 Nhập kho
                    </h2>

                    <p>
                        Tạo phiếu nhập kho mới
                    </p>

                </div>

                <button
                    type="button"
                    id="closeStockReceiptButton"
                    class="stock-receipt-close"
                >
                    ×
                </button>

            </div>


            <!-- THÔNG TIN PHIẾU -->

            <div class="stock-receipt-body">

                <div class="stock-receipt-info-grid">

                    <div>

                        <label>
                            Nhà cung cấp
                        </label>

                        <input
                            type="text"
                            id="stockReceiptSupplier"
                            placeholder="Nhập tên nhà cung cấp"
                        >

                    </div>


                    <div>

                        <label>
                            Ghi chú
                        </label>

                        <input
                            type="text"
                            id="stockReceiptNote"
                            placeholder="Ghi chú phiếu nhập"
                        >

                    </div>

                </div>


                <!-- SẢN PHẨM -->

                <div class="stock-receipt-product-header">

                    <h3>
                        Sản phẩm nhập
                    </h3>

                    <button
                        type="button"
                        id="addStockReceiptProduct"
                        class="stock-receipt-add-button"
                    >
                        + Thêm sản phẩm
                    </button>

                </div>


                <div
                    id="stockReceiptItems"
                    class="stock-receipt-items"
                >
                </div>


                <!-- TỔNG -->

                <div class="stock-receipt-total">

                    <span>
                        Tổng giá trị nhập
                    </span>

                    <strong
                        id="stockReceiptTotal"
                    >
                        0đ
                    </strong>

                </div>

            </div>


            <!-- FOOTER -->

            <div class="stock-receipt-footer">

                <button
                    type="button"
                    id="cancelStockReceiptButton"
                    class="stock-receipt-cancel"
                >
                    Hủy
                </button>

                <button
                    type="button"
                    id="saveStockReceiptButton"
                    class="stock-receipt-save"
                >
                    Lưu phiếu nhập
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        stockReceiptModal
    );


    /* =========================
       EVENTS
    ========================= */

    document
        .getElementById(
            "closeStockReceiptButton"
        )
        .addEventListener(
            "click",
            closeStockReceiptModal
        );


    document
        .getElementById(
            "cancelStockReceiptButton"
        )
        .addEventListener(
            "click",
            closeStockReceiptModal
        );


    document
        .getElementById(
            "addStockReceiptProduct"
        )
        .addEventListener(
            "click",
            function () {

                stockReceiptItems.push({

                    product_id: "",

                    quantity: 1,

                    unit_cost: 0

                });

                renderStockReceiptItems();

            }
        );


    document
        .getElementById(
            "saveStockReceiptButton"
        )
        .addEventListener(
            "click",
            saveStockReceipt
        );


    /* Click nền để đóng */

    stockReceiptModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                stockReceiptModal
            ) {

                closeStockReceiptModal();

            }

        }
    );

}


/* =====================================================
   7. HIỂN THỊ DANH SÁCH SẢN PHẨM
===================================================== */

function renderStockReceiptItems() {

    const container =
        document.getElementById(
            "stockReceiptItems"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        stockReceiptItems
            .map(
                function (item, index) {

                    const itemTotal =
                        Number(item.quantity || 0) *
                        Number(item.unit_cost || 0);


                    return `

                        <div
                            class="stock-receipt-item"
                            data-index="${index}"
                        >

                            <div>

                                <label>
                                    Sản phẩm
                                </label>

                                <select
                                    class="receipt-product-select"
                                    data-index="${index}"
                                >

                                    <option value="">
                                        -- Chọn sản phẩm --
                                    </option>

                                    ${
                                        stockReceiptProducts
                                            .map(
                                                function(product) {

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

                                                        </option>

                                                    `;

                                                }
                                            )
                                            .join("")
                                    }

                                </select>

                            </div>


                            <div>

                                <label>
                                    Số lượng
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    class="receipt-quantity-input"
                                    data-index="${index}"
                                    value="${item.quantity}"
                                >

                            </div>


                            <div>

                                <label>
                                    Giá vốn
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    class="receipt-cost-input"
                                    data-index="${index}"
                                    value="${item.unit_cost}"
                                >

                            </div>


                            <div>

                                <label>
                                    Thành tiền
                                </label>

                                <strong
                                    class="receipt-item-total"
                                >
                                    ${formatMoney(itemTotal)}
                                </strong>

                            </div>


                            <button
                                type="button"
                                class="receipt-remove-button"
                                data-index="${index}"
                            >
                                ×
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    attachReceiptItemEvents();

    updateStockReceiptTotal();

}


/* =====================================================
   8. EVENT TỪNG DÒNG
===================================================== */

function attachReceiptItemEvents() {

    const selects =
        document.querySelectorAll(
            ".receipt-product-select"
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
                        stockReceiptProducts.find(
                            function (item) {

                                return (
                                    item.id ===
                                    select.value
                                );

                            }
                        );


                    stockReceiptItems[index]
                        .product_id =
                        select.value;


                    /* Tự lấy giá vốn */

                    if (product) {

                        stockReceiptItems[index]
                            .unit_cost =
                            Number(
                                product.cost_price
                            ) || 0;

                    }


                    renderStockReceiptItems();

                }
            );

        }
    );


    const quantityInputs =
        document.querySelectorAll(
            ".receipt-quantity-input"
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


                    stockReceiptItems[index]
                        .quantity =
                        quantity;


                    updateStockReceiptTotal();

                }
            );

        }
    );


    const costInputs =
        document.querySelectorAll(
            ".receipt-cost-input"
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


                    stockReceiptItems[index]
                        .unit_cost =
                        cost;


                    updateStockReceiptTotal();

                }
            );

        }
    );


    const removeButtons =
        document.querySelectorAll(
            ".receipt-remove-button"
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
                        stockReceiptItems.length <=
                        1
                    ) {

                        alert(
                            "Phiếu nhập phải có ít nhất 1 sản phẩm."
                        );

                        return;

                    }


                    stockReceiptItems.splice(
                        index,
                        1
                    );


                    renderStockReceiptItems();

                }
            );

        }
    );

}


/* =====================================================
   9. TÍNH TỔNG
===================================================== */

function updateStockReceiptTotal() {

    let total = 0;


    stockReceiptItems.forEach(
        function (item, index) {

            const itemTotal =
                Number(item.quantity || 0) *
                Number(item.unit_cost || 0);


            total += itemTotal;


            const element =
                document.querySelector(
                    `.stock-receipt-item[data-index="${index}"] .receipt-item-total`
                );


            if (element) {

                element.textContent =
                    formatMoney(
                        itemTotal
                    );

            }

        }
    );


    const totalElement =
        document.getElementById(
            "stockReceiptTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            formatMoney(total);

    }

}


/* =====================================================
   10. KIỂM TRA DỮ LIỆU
===================================================== */

function validateStockReceipt() {

    const supplier =
        document.getElementById(
            "stockReceiptSupplier"
        ).value.trim();


    if (!supplier) {

        alert(
            "Vui lòng nhập tên nhà cung cấp."
        );

        return false;

    }


    if (
        stockReceiptItems.length === 0
    ) {

        alert(
            "Phiếu nhập chưa có sản phẩm."
        );

        return false;

    }


    for (
        let i = 0;
        i < stockReceiptItems.length;
        i++
    ) {

        const item =
            stockReceiptItems[i];


        if (!item.product_id) {

            alert(
                "Vui lòng chọn sản phẩm ở dòng " +
                (i + 1)
            );

            return false;

        }


        if (
            !Number.isInteger(
                Number(item.quantity)
            ) ||
            Number(item.quantity) <= 0
        ) {

            alert(
                "Số lượng ở dòng " +
                (i + 1) +
                " không hợp lệ."
            );

            return false;

        }


        if (
            Number(item.unit_cost) < 0
        ) {

            alert(
                "Giá vốn ở dòng " +
                (i + 1) +
                " không hợp lệ."
            );

            return false;

        }

    }


    return true;

}


/* =====================================================
   11. LƯU PHIẾU NHẬP
===================================================== */

async function saveStockReceipt() {

    console.log(
        "💾 ĐANG LƯU PHIẾU NHẬP"
    );


    if (
        !validateStockReceipt()
    ) {

        return;

    }


    const saveButton =
        document.getElementById(
            "saveStockReceiptButton"
        );


    saveButton.disabled = true;

    saveButton.textContent =
        "Đang lưu...";


    try {

        /* =========================
           THÔNG TIN PHIẾU
        ========================= */

        const supplier =
            document.getElementById(
                "stockReceiptSupplier"
            ).value.trim();


        const note =
            document.getElementById(
                "stockReceiptNote"
            ).value.trim();


        const receiptCode =
            generateReceiptCode();


        let totalValue = 0;


        stockReceiptItems.forEach(
            function (item) {

                totalValue +=
                    Number(item.quantity) *
                    Number(item.unit_cost);

            }
        );


        /* =========================
           LẤY USER
        ========================= */

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


        /* =========================
           LẤY PUBLIC USER
        ========================= */

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


        /* =========================
           INSERT STOCK RECEIPT
        ========================= */

        const {
            data: receipt,
            error: receiptError
        } =
            await supabaseClient
                .from("stock_receipts")
                .insert({

                    receipt_code:
                        receiptCode,

                    supplier:
                        supplier,

                    note:
                        note || null,

                    total_value:
                        totalValue,

                    status:
                        "DRAFT",

                    created_by:
                        authUser.id

                })
                .select()
                .single();


        if (receiptError) {

            throw receiptError;

        }


        console.log(
            "✅ ĐÃ TẠO PHIẾU:",
            receipt
        );


        /* =========================
           TẠO CHI TIẾT PHIẾU
        ========================= */

        const receiptItems =
            stockReceiptItems.map(
                function (item) {

                    const itemTotal =
                        Number(item.quantity) *
                        Number(item.unit_cost);


                    return {

                        receipt_id:
                            receipt.id,

                        product_id:
                            item.product_id,

                        quantity:
                            Number(item.quantity),

                        unit_cost:
                            Number(item.unit_cost),

                        total_value:
                            itemTotal

                    };

                }
            );


        const {
            error: itemsError
        } =
            await supabaseClient
                .from("stock_receipt_items")
                .insert(
                    receiptItems
                );


        if (itemsError) {

            /* Nếu chi tiết lỗi thì xóa phiếu */

            await supabaseClient
                .from("stock_receipts")
                .delete()
                .eq(
                    "id",
                    receipt.id
                );

            throw itemsError;

        }


        console.log(
            "✅ ĐÃ LƯU CHI TIẾT PHIẾU"
        );


        alert(
            "Đã lưu phiếu nhập " +
            receiptCode +
            " thành công."
        );


        closeStockReceiptModal();


        /* =========================
           CẬP NHẬT DASHBOARD
        ========================= */

        if (
            typeof loadStockInStats ===
            "function"
        ) {

            loadStockInStats();

        }


    }
    catch (error) {

        console.error(
            "❌ LỖI LƯU PHIẾU NHẬP:",
            error
        );


        alert(
            "Không thể lưu phiếu nhập.\n\n" +
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
            "Lưu phiếu nhập";

    }

}


/* =====================================================
   12. ĐÓNG MODAL
===================================================== */

function closeStockReceiptModal() {

    removeStockReceiptModal();

}


/* =====================================================
   13. XÓA MODAL
===================================================== */

function removeStockReceiptModal() {

    const oldModal =
        document.getElementById(
            "stockReceiptModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    stockReceiptModal =
        null;

}