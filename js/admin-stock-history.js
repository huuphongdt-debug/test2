/* =====================================================
   ADMIN STOCK HISTORY
   BÁCH SƠN TỬU
   LỊCH SỬ KHO
===================================================== */

console.log("=================================");
console.log("ADMIN STOCK HISTORY: ĐÃ KẾT NỐI");
console.log("=================================");


/* =====================================================
   BIẾN TOÀN CỤC
===================================================== */

let stockHistoryData = [];

let stockHistoryModal = null;


/* =====================================================
   KHỞI TẠO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "stockHistoryButton"
            );


        if (!button) {

            console.warn(
                "⚠️ Không tìm thấy stockHistoryButton"
            );

            return;
        }


        button.addEventListener(
            "click",
            openStockHistory
        );


        console.log(
            "✅ Đã gắn sự kiện Lịch sử kho"
        );

    }
);


/* =====================================================
   FORMAT TIỀN
===================================================== */

function formatHistoryMoney(value) {

    return (
        Number(value || 0)
            .toLocaleString("vi-VN")
        + "đ"
    );

}


/* =====================================================
   FORMAT NGÀY GIỜ
===================================================== */

function formatHistoryDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (Number.isNaN(date.getTime())) {
        return value;
    }


    return date.toLocaleString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}


/* =====================================================
   TÊN LOẠI GIAO DỊCH
===================================================== */

function getStockMovementType(type) {

    switch (type) {

        case "OPENING":
            return "Tồn đầu kỳ";

        case "IN":
            return "Nhập kho";

        case "OUT":
            return "Xuất kho";

        case "RETURN":
            return "Trả hàng";

        case "ADJUST_IN":
            return "Điều chỉnh tăng";

        case "ADJUST_OUT":
            return "Điều chỉnh giảm";

        default:
            return type || "-";
    }

}


/* =====================================================
   CLASS LOẠI GIAO DỊCH
===================================================== */

function getStockMovementClass(type) {

    switch (type) {

        case "IN":
        case "RETURN":
        case "ADJUST_IN":
            return "stock-history-in";

        case "OUT":
        case "ADJUST_OUT":
            return "stock-history-out";

        case "OPENING":
            return "stock-history-opening";

        default:
            return "";
    }

}


/* =====================================================
   ĐÓNG MODAL
===================================================== */

function closeStockHistory() {

    if (stockHistoryModal) {

        stockHistoryModal.remove();

        stockHistoryModal = null;

    }

}


/* =====================================================
   MỞ LỊCH SỬ KHO
===================================================== */

async function openStockHistory() {

    console.log(
        "================================="
    );

    console.log(
        "📋 MỞ LỊCH SỬ KHO"
    );

    console.log(
        "================================="
    );


    closeStockHistory();


    createStockHistoryModal();


    await loadStockHistory();

}


/* =====================================================
   TẠO MODAL
===================================================== */

function createStockHistoryModal() {

    stockHistoryModal =
        document.createElement("div");


    stockHistoryModal.id =
        "stockHistoryModal";


    stockHistoryModal.className =
        "stock-history-overlay";


    stockHistoryModal.innerHTML = `

        <div class="stock-history-modal">

            <!-- HEADER -->

            <div class="stock-history-header">

                <div>

                    <h2>
                        📋 Lịch sử kho
                    </h2>

                    <p>
                        Theo dõi toàn bộ biến động kho
                    </p>

                </div>


                <button
                    type="button"
                    id="closeStockHistoryButton"
                    class="stock-history-close"
                >
                    ×
                </button>

            </div>


            <!-- BỘ LỌC -->

            <div class="stock-history-filters">

                <div>

                    <label>
                        Tìm kiếm
                    </label>

                    <input
                        type="text"
                        id="stockHistorySearch"
                        placeholder="Mã SP hoặc tên sản phẩm..."
                    >

                </div>


                <div>

                    <label>
                        Loại giao dịch
                    </label>

                    <select
                        id="stockHistoryType"
                    >

                        <option value="">
                            Tất cả
                        </option>

                        <option value="OPENING">
                            Tồn đầu kỳ
                        </option>

                        <option value="IN">
                            Nhập kho
                        </option>

                        <option value="OUT">
                            Xuất kho
                        </option>

                        <option value="RETURN">
                            Trả hàng
                        </option>

                        <option value="ADJUST_IN">
                            Điều chỉnh tăng
                        </option>

                        <option value="ADJUST_OUT">
                            Điều chỉnh giảm
                        </option>

                    </select>

                </div>

            </div>


            <!-- THỐNG KÊ -->

            <div
                id="stockHistorySummary"
                class="stock-history-summary"
            >

                <div>

                    <span>
                        Số giao dịch
                    </span>

                    <strong id="historyTotalRows">
                        0
                    </strong>

                </div>


                <div>

                    <span>
                        Tổng SL nhập
                    </span>

                    <strong id="historyTotalIn">
                        0
                    </strong>

                </div>


                <div>

                    <span>
                        Tổng SL xuất
                    </span>

                    <strong id="historyTotalOut">
                        0
                    </strong>

                </div>


                <div>

                    <span>
                        Tổng giá trị
                    </span>

                    <strong id="historyTotalValue">
                        0đ
                    </strong>

                </div>

            </div>


            <!-- BẢNG -->

            <div class="stock-history-table-wrapper">

                <table class="stock-history-table">

                    <thead>

                        <tr>

                            <th>
                                Thời gian
                            </th>

                            <th>
                                Mã SP
                            </th>

                            <th>
                                Sản phẩm
                            </th>

                            <th>
                                Loại
                            </th>

                            <th>
                                Số lượng
                            </th>

                            <th>
                                Giá vốn
                            </th>

                            <th>
                                Giá trị
                            </th>

                            <th>
                                Tham chiếu
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        id="stockHistoryTableBody"
                    >

                        <tr>

                            <td
                                colspan="8"
                                class="stock-history-loading"
                            >
                                Đang tải dữ liệu...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- FOOTER -->

            <div class="stock-history-footer">

                <button
                    type="button"
                    id="closeStockHistoryFooter"
                    class="stock-history-cancel"
                >
                    Đóng
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        stockHistoryModal
    );


    /* =================================================
       EVENTS
    ================================================= */

    document
        .getElementById(
            "closeStockHistoryButton"
        )
        .addEventListener(
            "click",
            closeStockHistory
        );


    document
        .getElementById(
            "closeStockHistoryFooter"
        )
        .addEventListener(
            "click",
            closeStockHistory
        );


    document
        .getElementById(
            "stockHistorySearch"
        )
        .addEventListener(
            "input",
            renderStockHistory
        );


    document
        .getElementById(
            "stockHistoryType"
        )
        .addEventListener(
            "change",
            renderStockHistory
        );


    /* CLICK NỀN ĐỂ ĐÓNG */

    stockHistoryModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                stockHistoryModal
            ) {

                closeStockHistory();

            }

        }
    );

}


/* =====================================================
   ĐỌC STOCK MOVEMENTS
===================================================== */

async function loadStockHistory() {

    console.log(
        "📜 ĐANG TẢI LỊCH SỬ KHO"
    );


    const {
        data,
        error
    } = await supabaseClient

        .from("stock_movements")

        .select(`
            id,
            product_id,
            type,
            quantity,
            unit_cost,
            total_value,
            reference_type,
            reference_id,
            created_at,

            products (
                product_code,
                name
            )
        `)

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    console.log(
        "📜 STOCK HISTORY:",
        data
    );


    console.log(
        "❌ HISTORY ERROR:",
        error
    );


    if (error) {

        console.error(
            "❌ Không thể tải lịch sử kho:",
            error
        );


        const body =
            document.getElementById(
                "stockHistoryTableBody"
            );


        if (body) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="stock-history-empty"
                    >
                        Không thể tải dữ liệu lịch sử kho.
                    </td>

                </tr>

            `;

        }

        return;

    }


    /*
       QUAN TRỌNG:

       Lưu dữ liệu vào biến toàn cục
       để tìm kiếm / lọc sử dụng lại.
    */

    stockHistoryData =
        data || [];


    /*
       Render bảng
    */

    renderStockHistory();

}


/* =====================================================
   RENDER
===================================================== */

function renderStockHistory() {

    const body =
        document.getElementById(
            "stockHistoryTableBody"
        );


    if (!body) {

        console.warn(
            "⚠️ Không tìm thấy #stockHistoryTableBody"
        );

        return;
    }


    const searchInput =
        document.getElementById(
            "stockHistorySearch"
        );


    const typeSelect =
        document.getElementById(
            "stockHistoryType"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedType =
        typeSelect
            ? typeSelect.value
            : "";


    /* =================================================
       LỌC DỮ LIỆU
    ================================================= */

    const filtered =
        stockHistoryData.filter(
            function (item) {

                const product =
                    item.products || {};


                const productCode =
                    String(
                        product.product_code || ""
                    )
                        .toLowerCase();


                const productName =
                    String(
                        product.name || ""
                    )
                        .toLowerCase();


                const matchSearch =
                    !search ||
                    productCode.includes(search) ||
                    productName.includes(search);


                const matchType =
                    !selectedType ||
                    item.type === selectedType;


                return (
                    matchSearch &&
                    matchType
                );

            }
        );


    /* =================================================
       CẬP NHẬT THỐNG KÊ
    ================================================= */

    updateHistorySummary(
        filtered
    );


    /* =================================================
       KHÔNG CÓ DỮ LIỆU
    ================================================= */

    if (filtered.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="stock-history-empty"
                >
                    Không có dữ liệu.
                </td>

            </tr>

        `;

        return;

    }


    /* =================================================
       HIỂN THỊ BẢNG
    ================================================= */

    body.innerHTML =
        filtered
            .map(
                function (item) {

                    const product =
                        item.products || {};


                    const type =
                        item.type;


                    const typeName =
                        getStockMovementType(
                            type
                        );


                    const typeClass =
                        getStockMovementClass(
                            type
                        );


                    const quantity =
                        Number(
                            item.quantity || 0
                        );


                    /*
                       Nhập / tăng:
                       + số lượng

                       Xuất / giảm:
                       - số lượng
                    */

                    const quantityDisplay =
                        (
                            type === "OUT" ||
                            type === "ADJUST_OUT"
                        )
                            ? "-" + quantity
                            : "+" + quantity;


                    /*
                       Tham chiếu
                    */

                    let reference = "-";


                    if (
                        item.reference_type ===
                        "STOCK_RECEIPT"
                    ) {

                        reference =
                            "Phiếu nhập";

                    } else if (
                        item.reference_type ===
                        "STOCK_ISSUE"
                    ) {

                        reference =
                            "Phiếu xuất";

                    } else if (
                        item.reference_type ===
                        "OPENING_BALANCE"
                    ) {

                        reference =
                            "Tồn đầu kỳ";

                    } else if (
                        item.reference_id
                    ) {

                        reference =
                            item.reference_id;

                    }


                    return `

                        <tr>

                            <td>
                                ${formatHistoryDate(
                                    item.created_at
                                )}
                            </td>


                            <td>

                                <strong>
                                    ${
                                        product.product_code
                                        || "-"
                                    }
                                </strong>

                            </td>


                            <td>

                                ${
                                    product.name
                                    || "-"
                                }

                            </td>


                            <td>

                                <span
                                    class="
                                        stock-history-badge
                                        ${typeClass}
                                    "
                                >
                                    ${typeName}
                                </span>

                            </td>


                            <td
                                class="${typeClass}"
                            >

                                <strong>
                                    ${quantityDisplay}
                                </strong>

                            </td>


                            <td>

                                ${formatHistoryMoney(
                                    item.unit_cost
                                )}

                            </td>


                            <td>

                                <strong>
                                    ${formatHistoryMoney(
                                        item.total_value
                                    )}
                                </strong>

                            </td>


                            <td>

                                <small>
                                    ${reference}
                                </small>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   THỐNG KÊ
===================================================== */

function updateHistorySummary(
    data
) {

    let totalIn = 0;

    let totalOut = 0;

    let totalValue = 0;


    data.forEach(
        function (item) {

            const quantity =
                Number(
                    item.quantity || 0
                );


            const value =
                Number(
                    item.total_value || 0
                );


            /*
               NHẬP KHO

               Không tính OPENING vào
               Tổng SL nhập.

               OPENING là tồn đầu kỳ.
            */

            if (
                item.type === "IN" ||
                item.type === "RETURN" ||
                item.type === "ADJUST_IN"
            ) {

                totalIn += quantity;

            }


            /*
               XUẤT KHO
            */

            if (
                item.type === "OUT" ||
                item.type === "ADJUST_OUT"
            ) {

                totalOut += quantity;

            }


            /*
               Tổng giá trị các giao dịch
               đang được hiển thị sau lọc.
            */

            totalValue += value;

        }
    );


    const rowsElement =
        document.getElementById(
            "historyTotalRows"
        );


    const inElement =
        document.getElementById(
            "historyTotalIn"
        );


    const outElement =
        document.getElementById(
            "historyTotalOut"
        );


    const valueElement =
        document.getElementById(
            "historyTotalValue"
        );


    if (rowsElement) {

        rowsElement.textContent =
            data.length.toLocaleString(
                "vi-VN"
            );

    }


    if (inElement) {

        inElement.textContent =
            totalIn.toLocaleString(
                "vi-VN"
            );

    }


    if (outElement) {

        outElement.textContent =
            totalOut.toLocaleString(
                "vi-VN"
            );

    }


    if (valueElement) {

        valueElement.textContent =
            formatHistoryMoney(
                totalValue
            );

    }

}