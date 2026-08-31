/* =====================================================
   BÁCH SƠN TỬU
   AUTH SYSTEM
   QUẢN LÝ PHIÊN ĐĂNG NHẬP
===================================================== */


/* =====================================================
   1. KEY LƯU TRỮ
===================================================== */

const AUTH_USER_KEY = "bachson_current_user";
const AUTH_LOGIN_KEY = "userLoggedIn";
const AUTH_USER_ID_KEY = "userId";


/* =====================================================
   2. LẤY USER HIỆN TẠI
===================================================== */

function getCurrentUser() {

    try {

        const savedUser =
            localStorage.getItem(AUTH_USER_KEY);

        if (!savedUser) {
            return null;
        }

        const user =
            JSON.parse(savedUser);

        if (
            !user ||
            !user.userId
        ) {
            return null;
        }

        return user;

    }
    catch (error) {

        console.error(
            "AUTH: Không thể đọc user:",
            error
        );

        return null;

    }

}


/* =====================================================
   3. KIỂM TRA ĐĂNG NHẬP
===================================================== */

function isUserLoggedIn() {

    const user =
        getCurrentUser();

    if (!user) {
        return false;
    }

    if (!user.userId) {
        return false;
    }

    return true;

}


/* =====================================================
   4. LẤY USER ID
===================================================== */

function getCurrentUserId() {

    const user =
        getCurrentUser();

    if (!user) {
        return null;
    }

    return user.userId || null;

}


/* =====================================================
   5. LƯU PHIÊN ĐĂNG NHẬP
===================================================== */

function saveLoginSession(user) {

    if (!user) {

        console.error(
            "AUTH: Không có thông tin user."
        );

        return false;

    }


    if (!user.userId) {

        console.error(
            "AUTH: User không có userId."
        );

        return false;

    }


    /* Lưu toàn bộ thông tin user */

    localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(user)
    );


    /* Lưu user ID */

    localStorage.setItem(
        AUTH_USER_ID_KEY,
        user.userId
    );


    /* Đánh dấu đăng nhập */

    localStorage.setItem(
        AUTH_LOGIN_KEY,
        "true"
    );


    console.log(
        "AUTH: Đã lưu phiên đăng nhập:",
        user
    );


    return true;

}


/* =====================================================
   6. CẬP NHẬT GIAO DIỆN HEADER
===================================================== */

function updateAuthUI() {

    const loginElement =
        document.querySelector(
            "[data-auth-login]"
        );

    const userElement =
        document.querySelector(
            "[data-auth-user]"
        );

    const userNameElement =
        document.querySelector(
            "[data-user-name]"
        );

    const logoutElement =
        document.querySelector(
            "[data-auth-logout]"
        );


    const user =
        getCurrentUser();


    /* =================================================
       CHƯA ĐĂNG NHẬP
    ================================================= */

    if (!user) {

        if (loginElement) {
            loginElement.style.display = "";
        }

        if (userElement) {
            userElement.style.display = "none";
        }

        if (logoutElement) {
            logoutElement.style.display = "none";
        }

        return;

    }


    /* =================================================
       ĐÃ ĐĂNG NHẬP
    ================================================= */

    if (loginElement) {
        loginElement.style.display = "none";
    }

    if (userElement) {
        userElement.style.display = "";
    }

    if (logoutElement) {
        logoutElement.style.display = "";
    }


    /* Hiển thị tên */

    if (userNameElement) {

        userNameElement.textContent =
            user.name || "Tài khoản";

    }

}


/* =====================================================
   7. BẮT BUỘC ĐĂNG NHẬP
===================================================== */

function requireLogin() {

    if (isUserLoggedIn()) {

        return true;

    }


    console.log(
        "AUTH: Người dùng chưa đăng nhập."
    );


    /* Lưu trang hiện tại */

    const currentPage =
        window.location.pathname +
        window.location.search;


    sessionStorage.setItem(
        "auth_redirect",
        currentPage
    );


    /* Chuyển đến login */

    window.location.href =
        "login.html";


    return false;

}


/* =====================================================
   8. XỬ LÝ SAU KHI ĐĂNG NHẬP
===================================================== */

function handleAuthRedirect() {

    const redirect =
        sessionStorage.getItem(
            "auth_redirect"
        );


    if (!redirect) {

        return false;

    }


    sessionStorage.removeItem(
        "auth_redirect"
    );


    /*
       Nếu đang ở login.html
       thì chuyển đến trang trước đó
    */

    if (
        window.location.pathname.endsWith(
            "login.html"
        )
    ) {

        window.location.href =
            redirect;

        return true;

    }


    return false;

}


/* =====================================================
   9. ĐĂNG XUẤT
===================================================== */

function logoutUser() {

    console.log(
        "========== AUTH LOGOUT =========="
    );


    /* Xóa user */

    localStorage.removeItem(
        AUTH_USER_KEY
    );


    /* Xóa user ID */

    localStorage.removeItem(
        AUTH_USER_ID_KEY
    );


    /* Xóa trạng thái */

    localStorage.removeItem(
        AUTH_LOGIN_KEY
    );


    /* Xóa trang chuyển hướng */

    sessionStorage.removeItem(
        "auth_redirect"
    );


    console.log(
        "AUTH: Đã đăng xuất."
    );


    /* Cập nhật giao diện */

    updateAuthUI();


    /* Về trang chủ */

    window.location.href =
        "index.html";

}


/* =====================================================
   10. GẮN SỰ KIỆN ĐĂNG XUẤT
===================================================== */

function setupLogout() {

    const logoutElement =
        document.querySelector(
            "[data-auth-logout]"
        );


    if (!logoutElement) {

        return;

    }


    /*
       Tránh gắn event nhiều lần
    */

    if (
        logoutElement.dataset.logoutReady ===
        "true"
    ) {

        return;

    }


    logoutElement.dataset.logoutReady =
        "true";


    logoutElement.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            logoutUser();

        }
    );

}


/* =====================================================
   11. THEO DÕI THAY ĐỔI LOCAL STORAGE
===================================================== */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === AUTH_USER_KEY ||
            event.key === AUTH_LOGIN_KEY ||
            event.key === AUTH_USER_ID_KEY
        ) {

            updateAuthUI();

        }

    }
);


/* =====================================================
   12. KHỞI ĐỘNG AUTH
===================================================== */

function initAuth() {

    console.log(
        "================================="
    );

    console.log(
        "BÁCH SƠN TỬU - AUTH SYSTEM"
    );

    console.log(
        "================================="
    );


    updateAuthUI();

    setupLogout();


    console.log(
        "AUTH SYSTEM READY"
    );

}


/* =====================================================
   13. CHẠY KHI TRANG LOAD
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initAuth
    );

}
else {

    initAuth();

}