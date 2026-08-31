/* =====================================================
   ADMIN ORDERS
   BÁCH SƠN TỬU
===================================================== */


/* =====================================================
   BIẾN
===================================================== */

let adminOrders = [];


/* =====================================================
   FORMAT TIỀN
===================================================== */

function formatOrderMoney(value) {

    const number =
        Number(value) || 0;

    return number.toLocaleString(
        "vi-VN"
    ) + "đ";

}


/* =====================================================
   FORMAT NGÀY
===================================================== */

function formatOrderDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(
        "vi-VN"
    );

}


/* =====================================================
   LẤY ĐƠN HÀNG
===================================================== */

async function loadAdminOrders() {

    console.log(
        "================================="
    );

    console.log(
        "ADMIN: ĐANG TẢI ĐƠN HÀNG"
    );


    const tbody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!tbody) {
        console.error(
            "Không tìm thấy ordersTableBody"
        );

        return;
    }


    tbody.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="orders-loading"
            >
                Đang tải đơn hàng...
            </td>
        </tr>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("orders")
                .select(`
                    id,
                    order_id,
                    user_id,
                    customer_name,
                    customer_phone,
                    customer_email,
                    address,
                    note,
                    subtotal,
                    shipping_fee,
                    total,
                    payment_method,
                    payment_status,
                    order_status,
                    created_at
                `)
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "ADMIN ORDERS ERROR:",
                error
            );

            throw error;

        }


        adminOrders =
            data || [];


        console.log(
            "ADMIN ORDERS:",
            adminOrders
        );


        renderAdminOrders();


        updateOrderStatistics();


    }
    catch (error) {

        console.error(
            "LỖI TẢI ĐƠN HÀNG:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="orders-loading"
                >
                    Không thể tải danh sách đơn hàng.
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   HIỂN THỊ ĐƠN
===================================================== */

function renderAdminOrders() {

    const tbody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        adminOrders.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="orders-loading"
                >
                    Chưa có đơn hàng.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        adminOrders
            .map(
                function(order) {

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${order.order_id || "-"}
                                </strong>
                            </td>

                            <td>
                                ${order.customer_name || "-"}
                            </td>

                            <td>
                                ${order.customer_phone || "-"}
                            </td>

                            <td>
                                ${formatOrderDate(
                                    order.created_at
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${formatOrderMoney(
                                        order.total
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${order.payment_status || "-"}
                            </td>

                            <td>
                                <span class="order-status ${getOrderStatusClass(
                                    order.order_status
                                )}">
                                    ${order.order_status || "Chờ xử lý"}
                                </span>
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="order-view-btn"
                                    data-order-id="${order.id}"
                                >
                                    Xem
                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =====================================================
   CLASS TRẠNG THÁI
===================================================== */

function getOrderStatusClass(status) {

    switch (status) {

        case "Chờ xử lý":
            return "status-pending";

        case "Đã xác nhận":
            return "status-confirmed";

        case "Đang giao":
            return "status-shipping";

        case "Đã giao":
            return "status-delivered";

        case "Đã hủy":
            return "status-cancelled";

        default:
            return "status-pending";

    }

}


/* =====================================================
   THỐNG KÊ
===================================================== */

function updateOrderStatistics() {

    const totalOrders =
        document.getElementById(
            "orderTotalOrders"
        );

    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );

    const shippingOrders =
        document.getElementById(
            "shippingOrders"
        );

    const orderRevenue =
        document.getElementById(
            "orderRevenue"
        );


    const pending =
        adminOrders.filter(
            function(order) {

                return (
                    order.order_status ===
                    "Chờ xử lý"
                );

            }
        ).length;


    const shipping =
        adminOrders.filter(
            function(order) {

                return (
                    order.order_status ===
                    "Đang giao"
                );

            }
        ).length;


    const revenue =
        adminOrders.reduce(
            function(total, order) {

                if (
                    order.order_status ===
                    "Đã hủy"
                ) {
                    return total;
                }

                return (
                    total +
                    (
                        Number(
                            order.total
                        ) || 0
                    )
                );

            },
            0
        );


    if (totalOrders) {

        totalOrders.textContent =
            adminOrders.length;

    }


    if (pendingOrders) {

        pendingOrders.textContent =
            pending;

    }


    if (shippingOrders) {

        shippingOrders.textContent =
            shipping;

    }


    if (orderRevenue) {

        orderRevenue.textContent =
            formatOrderMoney(
                revenue
            );

    }

}


/* =====================================================
   KHỞI TẠO ADMIN ORDERS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* =========================
           NÚT LÀM MỚI
        ========================= */

        const refreshButton =
            document.getElementById(
                "refreshOrdersBtn"
            );

        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                loadAdminOrders
            );

        }


        /* =========================
           NÚT XEM ĐƠN HÀNG
        ========================= */

        const ordersTableBody =
            document.getElementById(
                "ordersTableBody"
            );

        if (ordersTableBody) {

            ordersTableBody.addEventListener(
                "click",
                function(event) {

                    const button =
                        event.target.closest(
                            ".order-view-btn"
                        );

                    if (!button) {
                        return;
                    }


                    const orderId =
                        button.dataset.orderId;


                    console.log(
                        "ADMIN: XEM ĐƠN HÀNG:",
                        orderId
                    );


                    const order =
                        adminOrders.find(
                            function(item) {

                                return (
                                    item.id ===
                                    orderId
                                );

                            }
                        );


                    if (!order) {

                        console.error(
                            "Không tìm thấy đơn hàng:",
                            orderId
                        );

                        return;

                    }


                    showOrderDetail(order);

                }
            );

        }


        /* =========================
           TẢI ĐƠN HÀNG
        ========================= */

        loadAdminOrders();

    }
);


/* =====================================================
   HIỂN THỊ CHI TIẾT ĐƠN HÀNG
===================================================== */

async function showOrderDetail(order) {

    console.log(
        "ADMIN: CHI TIẾT ĐƠN HÀNG:",
        order
    );


    /* =========================
       TẠO POPUP
    ========================= */

    let modal =
        document.getElementById(
            "orderDetailModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderDetailModal";

        modal.className =
            "order-detail-modal";

        document.body.appendChild(
            modal
        );

    }


    /* =========================
       HIỂN THỊ ĐANG TẢI
    ========================= */

    modal.innerHTML = `

        <div class="order-detail-overlay">

            <div class="order-detail-box">

                <div class="order-detail-header">

                    <div>

                        <h2>
                            Chi tiết đơn hàng
                        </h2>

                        <p>
                            ${order.order_id || "-"}
                        </p>

                    </div>

                    <button
                        type="button"
                        class="order-detail-close"
                        id="closeOrderDetail"
                    >
                        ×
                    </button>

                </div>


                <div class="order-detail-content">

                    <div class="order-detail-loading">

                        Đang tải thông tin sản phẩm...

                    </div>

                </div>

            </div>

        </div>

    `;


    modal.classList.add(
        "show"
    );


    /* =========================
       LẤY SẢN PHẨM
    ========================= */

    let orderItems = [];


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("order_items")
                .select(`
                    id,
                    order_id,
                    product_id,
                    product_name,
                    quantity,
                    price,
                    total
                `)
                .eq(
                    "order_id",
                    order.id
                );


        if (error) {

            console.error(
                "LỖI LẤY ORDER ITEMS:",
                error
            );

            throw error;

        }


        orderItems =
            data || [];


    }
    catch (error) {

        console.error(
            "Không thể tải sản phẩm:",
            error
        );

        orderItems = [];

    }


    /* =========================
       TỔNG TIỀN
    ========================= */

    const itemsHTML =
        orderItems.length > 0

            ?

        orderItems
            .map(
                function(item) {

                    return `

                        <div class="order-item-row">

                            <div class="order-item-info">

                                <strong>
                                    ${item.product_name || "Sản phẩm"}
                                </strong>

                                <span>
                                    SL: ${item.quantity || 0}
                                </span>

                            </div>

                            <div class="order-item-price">

                                ${formatOrderMoney(
                                    item.total
                                )}

                            </div>

                        </div>

                    `;

                }
            )
            .join("")

            :

        `

            <div class="order-empty-items">

                Không tìm thấy sản phẩm trong đơn hàng.

            </div>

        `;


    /* =========================
       HIỂN THỊ
    ========================= */

    const content =
        modal.querySelector(
            ".order-detail-content"
        );


    content.innerHTML = `

        <!-- THÔNG TIN KHÁCH HÀNG -->

        <section class="order-detail-section">

            <h3>
                Thông tin khách hàng
            </h3>

            <div class="order-info-grid">

                <div>

                    <span>
                        Họ và tên
                    </span>

                    <strong>
                        ${order.customer_name || "-"}
                    </strong>

                </div>


                <div>

                    <span>
                        Số điện thoại
                    </span>

                    <strong>
                        ${order.customer_phone || "-"}
                    </strong>

                </div>


                <div>

                    <span>
                        Email
                    </span>

                    <strong>
                        ${order.customer_email || "-"}
                    </strong>

                </div>


                <div>

                    <span>
                        Địa chỉ
                    </span>

                    <strong>
                        ${order.address || "-"}
                    </strong>

                </div>

            </div>

        </section>


        <!-- SẢN PHẨM -->

        <section class="order-detail-section">

            <h3>
                Sản phẩm
            </h3>

            <div class="order-items-list">

                ${itemsHTML}

            </div>

        </section>


        <!-- THANH TOÁN -->

        <section class="order-detail-section">

            <h3>
                Thanh toán
            </h3>

            <div class="order-money">

                <div>

                    <span>
                        Tạm tính
                    </span>

                    <strong>
                        ${formatOrderMoney(
                            order.subtotal
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Phí vận chuyển
                    </span>

                    <strong>
                        ${formatOrderMoney(
                            order.shipping_fee
                        )}
                    </strong>

                </div>


                <div class="order-total">

                    <span>
                        Tổng tiền
                    </span>

                    <strong>
                        ${formatOrderMoney(
                            order.total
                        )}
                    </strong>

                </div>

            </div>

        </section>


        <!-- TRẠNG THÁI -->

        <section class="order-detail-section">

            <h3>
                Trạng thái đơn hàng
            </h3>


            <div class="order-status-form">

                <div>

                    <label>
                        Trạng thái đơn
                    </label>

                    <select
                        id="orderStatusSelect"
                    >

                        <option value="Chờ xử lý">
                            Chờ xử lý
                        </option>

                        <option value="Đã xác nhận">
                            Đã xác nhận
                        </option>

                        <option value="Đang giao">
                            Đang giao
                        </option>

                        <option value="Đã giao">
                            Đã giao
                        </option>

                        <option value="Đã hủy">
                            Đã hủy
                        </option>

                    </select>

                </div>


                <div>

                    <label>
                        Trạng thái thanh toán
                    </label>

                    <select
                        id="paymentStatusSelect"
                    >

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Failed">
                            Failed
                        </option>

                        <option value="Refunded">
                            Refunded
                        </option>

                    </select>

                </div>

            </div>

        </section>


        <!-- GHI CHÚ -->

        <section class="order-detail-section">

            <h3>
                Ghi chú
            </h3>

            <p class="order-note">

                ${order.note || "Không có ghi chú"}

            </p>

        </section>

    `;


    /* =========================
       SET TRẠNG THÁI HIỆN TẠI
    ========================= */

    const statusSelect =
        document.getElementById(
            "orderStatusSelect"
        );


    const paymentSelect =
        document.getElementById(
            "paymentStatusSelect"
        );


    if (statusSelect) {

        let currentStatus =
            order.order_status;


        /* HỖ TRỢ DỮ LIỆU CŨ */

        if (
            currentStatus ===
            "Pending"
        ) {

            currentStatus =
                "Chờ xử lý";

        }


        statusSelect.value =
            currentStatus || "Chờ xử lý";

    }


    if (paymentSelect) {

        paymentSelect.value =
            order.payment_status ||
            "Pending";

    }


    /* =========================
       FOOTER
    ========================= */

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "order-detail-footer";


    footer.innerHTML = `

        <button
            type="button"
            class="order-cancel-btn"
            id="closeOrderDetailBottom"
        >
            Đóng
        </button>


        <button
            type="button"
            class="order-save-btn"
            id="saveOrderStatus"
        >
            Lưu thay đổi
        </button>

    `;


    content.appendChild(
        footer
    );


    /* =========================
       ĐÓNG POPUP
    ========================= */

    const closeModal =
        function() {

            modal.classList.remove(
                "show"
            );

        };


    const closeTop =
        document.getElementById(
            "closeOrderDetail"
        );


    const closeBottom =
        document.getElementById(
            "closeOrderDetailBottom"
        );


    if (closeTop) {

        closeTop.addEventListener(
            "click",
            closeModal
        );

    }


    if (closeBottom) {

        closeBottom.addEventListener(
            "click",
            closeModal
        );

    }


    /* =========================
       LƯU TRẠNG THÁI
    ========================= */

    const saveButton =
        document.getElementById(
            "saveOrderStatus"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            async function() {

                await updateOrderStatus(
                    order
                );

            }
        );

    }

}
/* =====================================================
   CẬP NHẬT TRẠNG THÁI ĐƠN
===================================================== */

async function updateOrderStatus(order) {

    const statusSelect =
        document.getElementById(
            "orderStatusSelect"
        );

    const paymentSelect =
        document.getElementById(
            "paymentStatusSelect"
        );

    const saveButton =
        document.getElementById(
            "saveOrderStatus"
        );


    if (!statusSelect || !paymentSelect) {
        return;
    }


    const newOrderStatus =
        statusSelect.value;


    const newPaymentStatus =
        paymentSelect.value;


    console.log(
        "ADMIN: CẬP NHẬT ĐƠN:",
        order.id
    );

    console.log(
        "TRẠNG THÁI:",
        newOrderStatus
    );

    console.log(
        "THANH TOÁN:",
        newPaymentStatus
    );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "Đang lưu...";

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("orders")
                .update({

                    order_status:
                        newOrderStatus,

                    payment_status:
                        newPaymentStatus

                })
                .eq(
                    "id",
                    order.id
                )
                .select()
                .single();


        if (error) {

            console.error(
                "LỖI CẬP NHẬT ĐƠN:",
                error
            );

            throw error;

        }


        console.log(
            "ADMIN: ĐÃ CẬP NHẬT:",
            data
        );


        /* =========================
           CẬP NHẬT LOCAL DATA
        ========================= */

        const index =
            adminOrders.findIndex(
                function(item) {

                    return (
                        item.id ===
                        order.id
                    );

                }
            );


        if (index !== -1) {

            adminOrders[index] =
                data;

        }


        renderAdminOrders();

        updateOrderStatistics();


        alert(
            "Đã cập nhật đơn hàng."
        );


        const modal =
            document.getElementById(
                "orderDetailModal"
            );


        if (modal) {

            modal.classList.remove(
                "show"
            );

        }


    }
    catch (error) {

        console.error(
            "LỖI UPDATE ORDER:",
            error
        );


        alert(
            "Không thể cập nhật đơn hàng:\n\n" +
            error.message
        );

    }
    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Lưu thay đổi";

        }

    }

}