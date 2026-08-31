/* =====================================================
   ADMIN AUTHENTICATION
   BÁCH SƠN TỬU
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("ADMIN: bắt đầu kiểm tra quyền...");


    /* =================================================
       1. KIỂM TRA SUPABASE
    ================================================= */

    if (typeof supabaseClient === "undefined") {

        console.error("ADMIN: Không tìm thấy supabaseClient");

        alert("Không thể kết nối hệ thống.");

        window.location.href = "login.html";

        return;
    }


    /* =================================================
       2. LẤY USER ĐANG ĐĂNG NHẬP
    ================================================= */

    const {
        data: authData,
        error: authError
    } = await supabaseClient.auth.getUser();


    if (authError || !authData.user) {

        console.log("ADMIN: Chưa đăng nhập");

        window.location.href = "login.html";

        return;
    }


    const authUser = authData.user;


    console.log("ADMIN AUTH USER:", authUser);

    console.log("ADMIN AUTH USER ID:", authUser.id);

    console.log("ADMIN EMAIL:", authUser.email);


    /* =================================================
       3. LẤY THÔNG TIN TỪ public.users
    ================================================= */

    const {
        data: publicUser,
        error: publicUserError
    } = await supabaseClient
        .from("users")
        .select(`
            user_id,
            name,
            email,
            role,
            status,
            auth_user_id
        `)
        .eq("auth_user_id", authUser.id)
        .single();


    /* =================================================
       4. KHÔNG TÌM THẤY USER
    ================================================= */

    if (publicUserError || !publicUser) {

        console.error(
            "ADMIN: Không tìm thấy tài khoản trong public.users",
            publicUserError
        );

        alert(
            "Tài khoản chưa được liên kết với hệ thống."
        );

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

        return;
    }


    console.log("ADMIN PUBLIC USER:", publicUser);


    /* =================================================
       5. KIỂM TRA ROLE
    ================================================= */

    if (publicUser.role !== "admin") {

        console.warn(
            "ADMIN: Tài khoản không có quyền admin."
        );

        alert(
            "Bạn không có quyền truy cập trang quản trị."
        );

        window.location.href = "index.html";

        return;
    }


    /* =================================================
       6. KIỂM TRA STATUS
    ================================================= */

    if (publicUser.status !== "Active") {

        console.warn(
            "ADMIN: Tài khoản không ở trạng thái Active."
        );

        alert(
            "Tài khoản của bạn hiện không hoạt động."
        );

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

        return;
    }


    /* =================================================
       7. ADMIN HỢP LỆ
    ================================================= */

    console.log("=================================");
    console.log("ADMIN ACCESS GRANTED");
    console.log("Tên:", publicUser.name);
    console.log("Email:", publicUser.email);
    console.log("Role:", publicUser.role);
    console.log("Status:", publicUser.status);
    console.log("=================================");


    /* =================================================
       8. HIỂN THỊ TÊN ADMIN
    ================================================= */

    const adminName =
        document.getElementById("adminName");

    if (adminName) {

        adminName.textContent =
            publicUser.name || "Admin";
    }


    /* =================================================
       9. HIỂN THỊ ROLE
    ================================================= */

    const adminRole =
        document.getElementById("adminRole");

    if (adminRole) {

        adminRole.textContent =
            publicUser.role;
    }


    /* =================================================
       10. HIỂN THỊ STATUS
    ================================================= */

    const adminStatus =
        document.getElementById("adminStatus");

    if (adminStatus) {

        adminStatus.textContent =
            publicUser.status;
    }


    /* =================================================
       11. NÚT ĐĂNG XUẤT
    ================================================= */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                logoutButton.disabled = true;

                logoutButton.textContent =
                    "Đang đăng xuất...";


                const {
                    error
                } = await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "ADMIN LOGOUT ERROR:",
                        error
                    );

                    alert(
                        "Đăng xuất thất bại."
                    );

                    logoutButton.disabled = false;

                    logoutButton.textContent =
                        "Đăng xuất";

                    return;
                }


                console.log(
                    "ADMIN: Đã đăng xuất"
                );


                window.location.href =
                    "login.html";
            }
        );
    }

});
async function loadDashboardStats() {

    try {

        // ==============================
        // ĐẾM ĐƠN HÀNG
        // ==============================

        const { count: orderCount, error: orderError } =
            await supabaseClient
                .from("orders")
                .select("*", {
                    count: "exact",
                    head: true
                });

        if (orderError) {
            console.error("Lỗi lấy đơn hàng:", orderError);
        }


        // ==============================
        // ĐẾM SẢN PHẨM
        // ==============================

        const { count: productCount, error: productError } =
            await supabaseClient
                .from("products")
                .select("*", {
                    count: "exact",
                    head: true
                });

        if (productError) {
            console.error("Lỗi lấy sản phẩm:", productError);
        }


        // ==============================
        // ĐẾM NGƯỜI DÙNG
        // ==============================

        const { count: userCount, error: userError } =
            await supabaseClient
                .from("users")
                .select("*", {
                    count: "exact",
                    head: true
                });

        if (userError) {
            console.error("Lỗi lấy người dùng:", userError);
        }


        // ==============================
        // HIỂN THỊ
        // ==============================

        document.getElementById("orderCount").textContent =
            orderCount ?? 0;

        document.getElementById("productCount").textContent =
            productCount ?? 0;

        document.getElementById("userCount").textContent =
            userCount ?? 0;


    } catch (error) {

        console.error("Lỗi Dashboard:", error);

    }

}
/* =====================================================
   ADMIN MENU NAVIGATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dashboardMenu =
            document.getElementById(
                "dashboardMenu"
            );

        const ordersMenu =
            document.getElementById(
                "ordersMenu"
            );

        const productsMenu =
            document.getElementById(
                "productsMenu"
            );

        const usersMenu =
            document.getElementById(
                "usersMenu"
            );

        const contentMenu =
            document.getElementById(
                "contentMenu"
            );


        const ordersSection =
            document.getElementById(
                "ordersSection"
            );

        const comingSoonSection =
            document.getElementById(
                "comingSoonSection"
            );

        const dashboardStats =
            document.querySelector(
                ".dashboard-stats"
            );

        const adminContent =
            document.querySelector(
                ".admin-content"
            );

        const adminHeader =
            document.querySelector(
                ".admin-header"
            );


        const comingSoonTitle =
            document.getElementById(
                "comingSoonTitle"
            );

        const comingSoonMessage =
            document.getElementById(
                "comingSoonMessage"
            );


        /* =========================================
           HÀM XÓA ACTIVE
        ========================================= */

        function clearActiveMenu() {

            document
                .querySelectorAll(
                    ".admin-menu-item"
                )
                .forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );

        }


        /* =========================================
           HIỆN TỔNG QUAN
        ========================================= */

        function showDashboard() {

            clearActiveMenu();

            if (dashboardMenu) {

                dashboardMenu.classList.add(
                    "active"
                );

            }


            if (adminHeader) {

                adminHeader.style.display =
                    "";

            }


            if (dashboardStats) {

                dashboardStats.style.display =
                    "";

            }


            if (adminContent) {

                adminContent.style.display =
                    "";

            }


            if (ordersSection) {

                ordersSection.style.display =
                    "none";

            }


            if (comingSoonSection) {

                comingSoonSection.style.display =
                    "none";

            }

        }


        /* =========================================
           HIỆN ĐƠN HÀNG
        ========================================= */

        function showOrders() {

            clearActiveMenu();

            if (ordersMenu) {

                ordersMenu.classList.add(
                    "active"
                );

            }


            if (adminHeader) {

                adminHeader.style.display =
                    "none";

            }


            if (dashboardStats) {

                dashboardStats.style.display =
                    "none";

            }


            if (adminContent) {

                adminContent.style.display =
                    "none";

            }


            if (comingSoonSection) {

                comingSoonSection.style.display =
                    "none";

            }


            if (ordersSection) {

                ordersSection.style.display =
                    "block";

            }


            /* Tải lại đơn hàng */

            if (
                typeof loadAdminOrders ===
                "function"
            ) {

                loadAdminOrders();

            }

        }


        /* =========================================
           CHỨC NĂNG ĐANG XÂY DỰNG
        ========================================= */

        function showComingSoon(
            title,
            message,
            menu
        ) {

            clearActiveMenu();


            if (menu) {

                menu.classList.add(
                    "active"
                );

            }


            if (adminHeader) {

                adminHeader.style.display =
                    "none";

            }


            if (dashboardStats) {

                dashboardStats.style.display =
                    "none";

            }


            if (adminContent) {

                adminContent.style.display =
                    "none";

            }


            if (ordersSection) {

                ordersSection.style.display =
                    "none";

            }


            if (comingSoonSection) {

                comingSoonSection.style.display =
                    "block";

            }


            if (comingSoonTitle) {

                comingSoonTitle.textContent =
                    title;

            }


            if (comingSoonMessage) {

                comingSoonMessage.textContent =
                    message;

            }

        }


        /* =========================================
           CLICK TỔNG QUAN
        ========================================= */

        if (dashboardMenu) {

            dashboardMenu.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showDashboard();

                }
            );

        }


        /* =========================================
           CLICK ĐƠN HÀNG
        ========================================= */

        if (ordersMenu) {

            ordersMenu.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showOrders();

                }
            );

        }


        /* =========================================
           CLICK SẢN PHẨM
        ========================================= */

        if (productsMenu) {

            productsMenu.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showComingSoon(
                        "Quản lý sản phẩm",
                        "Chức năng quản lý sản phẩm đang được xây dựng.",
                        productsMenu
                    );

                }
            );

        }


        /* =========================================
           CLICK NGƯỜI DÙNG
        ========================================= */

        if (usersMenu) {

            usersMenu.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showComingSoon(
                        "Quản lý người dùng",
                        "Chức năng quản lý người dùng đang được xây dựng.",
                        usersMenu
                    );

                }
            );

        }


        /* =========================================
           CLICK NỘI DUNG
        ========================================= */

        if (contentMenu) {

            contentMenu.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showComingSoon(
                        "Quản lý nội dung",
                        "Chức năng quản lý nội dung đang được xây dựng.",
                        contentMenu
                    );

                }
            );

        }


        /* =========================================
           MẶC ĐỊNH
        ========================================= */

        showDashboard();

    }
);