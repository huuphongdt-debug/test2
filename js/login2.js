/* =====================================================
   BÁCH SƠN TỬU
   LOGIN
   ĐĂNG NHẬP TÀI KHOẢN

   LUỒNG:

   login.html
        ↓
   login.js
        ↓
   READ API
        ↓
   Google Sheets / USERS
        ↓
   JSONP
        ↓
   result.user
        ↓
   localStorage
        ↓
   index.html
===================================================== */


/* =====================================================
   1. READ API
===================================================== */

const READ_API_URL =
    "https://script.google.com/macros/s/AKfycbzg8M1Q-2GtK9Noe_IuvYwMehzPYOwyTeUfNWHUTKdl0bF4m0lq4auEpQRzjbgGXbJl/exec";


/* =====================================================
   2. LOGIN USER
   GỌI READ API BẰNG JSONP

   Không dùng fetch
   Không dùng CORS
===================================================== */

function loginUser(
    contact,
    password
) {

    return new Promise(
        function(resolve, reject) {

            /* =========================================
               TẠO CALLBACK NAME
            ========================================= */

            const callbackName =
                "loginCallback_" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() * 100000
                );


            /* =========================================
               TẠO SCRIPT
            ========================================= */

            const script =
                document.createElement(
                    "script"
                );


            let finished = false;


            /* =========================================
               CLEANUP
            ========================================= */

            function cleanup() {

                if (
                    script &&
                    script.parentNode
                ) {

                    script
                        .parentNode
                        .removeChild(
                            script
                        );

                }


                delete window[
                    callbackName
                ];

            }


            /* =========================================
               CALLBACK NHẬN KẾT QUẢ
            ========================================= */

            window[callbackName] =
                function(result) {

                    if (finished) {

                        return;

                    }


                    finished = true;


                    console.log(
                        "================================="
                    );

                    console.log(
                        "LOGIN RESULT:"
                    );

                    console.log(
                        result
                    );

                    console.log(
                        "================================="
                    );


                    cleanup();


                    resolve(
                        result
                    );

                };


            /* =========================================
               LỖI SCRIPT
            ========================================= */

            script.onerror =
                function() {

                    if (finished) {

                        return;

                    }


                    finished = true;


                    cleanup();


                    reject(
                        new Error(
                            "Không thể kết nối READ API."
                        )
                    );

                };


            /* =========================================
               TẠO URL READ API
            ========================================= */

            const url =
                READ_API_URL +
                "?action=login" +
                "&contact=" +
                encodeURIComponent(
                    contact
                ) +
                "&password=" +
                encodeURIComponent(
                    password
                ) +
                "&callback=" +
                encodeURIComponent(
                    callbackName
                );


            console.log(
                "================================="
            );

            console.log(
                "BẮT ĐẦU LOGIN"
            );

            console.log(
                "CONTACT:",
                contact
            );

            console.log(
                "READ API:",
                READ_API_URL
            );

            console.log(
                "================================="
            );


            /* =========================================
               GỌI READ API
            ========================================= */

            script.src =
                url;


            document
                .body
                .appendChild(
                    script
                );


            /* =========================================
               TIMEOUT 15 GIÂY
            ========================================= */

            setTimeout(
                function() {

                    if (finished) {

                        return;

                    }


                    finished = true;


                    cleanup();


                    reject(
                        new Error(
                            "READ API không phản hồi."
                        )
                    );

                },
                15000
            );

        }
    );

}


/* =====================================================
   3. LƯU PHIÊN ĐĂNG NHẬP
===================================================== */

function saveLoginSession(
    user
) {

    /* =========================================
       KIỂM TRA USER
    ========================================= */

    if (!user) {

        console.error(
            "Không có thông tin user để lưu."
        );

        return false;

    }


    /* =========================================
       LƯU TOÀN BỘ USER
    ========================================= */

    localStorage.setItem(
        "bachson_current_user",
        JSON.stringify(
            user
        )
    );


    /* =========================================
       LƯU USER ID RIÊNG
    ========================================= */

    if (
        user.userId
    ) {

        localStorage.setItem(
            "userId",
            user.userId
        );

    }


    /* =========================================
       ĐÁNH DẤU ĐÃ ĐĂNG NHẬP
    ========================================= */

    localStorage.setItem(
        "userLoggedIn",
        "true"
    );


    console.log(
        "================================="
    );

    console.log(
        "ĐÃ LƯU PHIÊN ĐĂNG NHẬP"
    );

    console.log(
        user
    );

    console.log(
        "================================="
    );


    return true;

}


/* =====================================================
   4. LẤY USER HIỆN TẠI
   DÙNG CHO CÁC TRANG KHÁC SAU NÀY
===================================================== */

function getCurrentUser() {

    try {

        const savedUser =
            localStorage.getItem(
                "bachson_current_user"
            );


        if (!savedUser) {

            return null;

        }


        const user =
            JSON.parse(
                savedUser
            );


        if (
            !user ||
            typeof user !== "object"
        ) {

            return null;

        }


        return user;

    }
    catch (error) {

        console.error(
            "Không thể đọc phiên đăng nhập:",
            error
        );

        return null;

    }

}


/* =====================================================
   5. KIỂM TRA ĐÃ ĐĂNG NHẬP
===================================================== */

function isUserLoggedIn() {

    const loggedIn =
        localStorage.getItem(
            "userLoggedIn"
        );


    const user =
        getCurrentUser();


    return (
        loggedIn === "true" &&
        user !== null
    );

}


/* =====================================================
   6. ĐĂNG XUẤT
   CHƯA CẦN DÙNG NGAY
   NHƯNG CHUẨN BỊ SẴN
===================================================== */

function logoutUser() {

    /* =========================================
       XÓA USER
    ========================================= */

    localStorage.removeItem(
        "bachson_current_user"
    );


    /* =========================================
       XÓA USER ID
    ========================================= */

    localStorage.removeItem(
        "userId"
    );


    /* =========================================
       XÓA TRẠNG THÁI LOGIN
    ========================================= */

    localStorage.removeItem(
        "userLoggedIn"
    );


    console.log(
        "Đã đăng xuất tài khoản."
    );

}


/* =====================================================
   7. FORM LOGIN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* =========================================
           LẤY FORM
        ========================================= */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        /* =========================================
           KIỂM TRA FORM
        ========================================= */

        if (!loginForm) {

            console.error(
                "KHÔNG TÌM THẤY loginForm."
            );

            return;

        }


        console.log(
            "================================="
        );

        console.log(
            "LOGIN FORM ĐÃ SẴN SÀNG"
        );

        console.log(
            "================================="
        );


        /* =========================================
           LẤY CÁC ELEMENT
        ========================================= */

        const contactInput =
            document.getElementById(
                "loginContact"
            );


        const passwordInput =
            document.getElementById(
                "loginPassword"
            );


        const message =
            document.getElementById(
                "loginMessage"
            );


        const button =
            document.getElementById(
                "loginButton"
            );


        /* =========================================
           SUBMIT
        ========================================= */

        loginForm.addEventListener(
            "submit",
            async function(e) {

                e.preventDefault();


                console.log(
                    "================================="
                );

                console.log(
                    "BẮT ĐẦU XỬ LÝ LOGIN"
                );

                console.log(
                    "================================="
                );


                /* =================================
                   LẤY GIÁ TRỊ
                ================================= */

                const contact =
                    contactInput
                        ? contactInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* =================================
                   KIỂM TRA CONTACT
                ================================= */

                if (!contact) {

                    if (message) {

                        message.textContent =
                            "Vui lòng nhập Email hoặc số điện thoại.";

                    }


                    if (contactInput) {

                        contactInput.focus();

                    }


                    return;

                }


                /* =================================
                   KIỂM TRA PASSWORD
                ================================= */

                if (!password) {

                    if (message) {

                        message.textContent =
                            "Vui lòng nhập mật khẩu.";

                    }


                    if (passwordInput) {

                        passwordInput.focus();

                    }


                    return;

                }


                /* =================================
                   TRẠNG THÁI ĐANG LOGIN
                ================================= */

                if (message) {

                    message.textContent =
                        "Đang đăng nhập...";

                }


                if (button) {

                    button.disabled =
                        true;


                    button.textContent =
                        "Đang đăng nhập...";

                }


                /* =================================
                   GỌI READ API
                ================================= */

                try {

                    const result =
                        await loginUser(
                            contact,
                            password
                        );


                    console.log(
                        "KẾT QUẢ LOGIN:",
                        result
                    );


                    /* =================================
                       KIỂM TRA KẾT QUẢ
                    ================================= */

                    if (
                        result &&
                        result.success === true
                    ) {

                        /* =============================
                           KIỂM TRA USER
                        ============================= */

                        if (
                            !result.user
                        ) {

                            console.error(
                                "READ API không trả về result.user."
                            );


                            if (message) {

                                message.textContent =
                                    "Đăng nhập thành công nhưng không nhận được thông tin tài khoản.";

                            }


                            return;

                        }


                        /* =============================
                           LƯU PHIÊN
                        ============================= */

                        const sessionSaved =
                            saveLoginSession(
                                result.user
                            );


                        if (
                            !sessionSaved
                        ) {

                            if (message) {

                                message.textContent =
                                    "Không thể lưu phiên đăng nhập.";

                            }


                            return;

                        }


                        /* =============================
                           THÔNG BÁO
                        ============================= */

                        if (message) {

                            message.textContent =
                                result.message ||
                                "Đăng nhập thành công.";

                        }


                        console.log(
                            "LOGIN THÀNH CÔNG:"
                        );

                        console.log(
                            "User ID:",
                            result.user.userId
                        );

                        console.log(
                            "Tên:",
                            result.user.name
                        );

                        console.log(
                            "Email:",
                            result.user.email
                        );

                        console.log(
                            "Số điện thoại:",
                            result.user.phone
                        );


                        /* =============================
                           CHUYỂN TRANG CHỦ
                        ============================= */

                        setTimeout(
                            function() {

                                window.location.href =
                                    "index.html";

                            },
                            800
                        );


                    }
                    else {

                        /* =============================
                           LOGIN THẤT BẠI
                        ============================= */

                        if (message) {

                            message.textContent =
                                (
                                    result &&
                                    result.message
                                ) ||
                                "Đăng nhập không thành công.";

                        }

                    }

                }
                catch (error) {

                    console.error(
                        "================================="
                    );

                    console.error(
                        "LỖI LOGIN:"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "================================="
                    );


                    if (message) {

                        message.textContent =
                            error.message ||
                            "Không thể kết nối READ API.";

                    }

                }
                finally {

                    /* =================================
                       MỞ LẠI NÚT
                    ================================= */

                    if (button) {

                        button.disabled =
                            false;


                        button.textContent =
                            "Đăng nhập";

                    }

                }

            }
        );

    }
);