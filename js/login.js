/* =====================================================
   BÁCH SƠN TỬU
   LOGIN SYSTEM - SUPABASE
   =====================================================

   LUỒNG:

   login.html
        ↓
   login.js
        ↓
   Supabase
        ↓
   RPC: login_user
        ↓
   public.users
        ↓
   last_login
        ↓
   localStorage
        ↓
   index.html

   KHÔNG DÙNG:
   - Google Sheets
   - Google Apps Script
   - JSONP
   - READ API
===================================================== */


/* =====================================================
   1. KIỂM TRA SUPABASE
===================================================== */

console.log("=================================");
console.log("BÁCH SƠN TỬU - LOGIN SYSTEM");
console.log("=================================");


if (
    typeof supabaseClient === "undefined" ||
    !supabaseClient
) {

    console.error(
        "SUPABASE CLIENT KHÔNG TỒN TẠI."
    );

    console.error(
        "Hãy kiểm tra supabase.js đã được load trước login.js."
    );

} else {

    console.log(
        "SUPABASE CLIENT READY"
    );

}
/* =====================================================
   2. LOGIN USER
   SUPABASE AUTHENTICATION
===================================================== */

async function loginUser(contact, password) {

    console.log("=================================");
    console.log("BẮT ĐẦU LOGIN SUPABASE AUTH");
    console.log("CONTACT:", contact);
    console.log("=================================");


    /* =========================================
       KIỂM TRA SUPABASE
    ========================================= */

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {
        throw new Error(
            "Supabase Client chưa được khởi tạo."
        );
    }


    /* =========================================
       XÁC ĐỊNH EMAIL
       
       BƯỚC NÀY TẠM THỜI CHỈ XỬ LÝ EMAIL
       ========================================= */

    const email = contact.trim();


    /* =========================================
       ĐĂNG NHẬP SUPABASE AUTH
    ========================================= */

    const {
        data: authData,
        error: authError
    } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });


    /* =========================================
       KIỂM TRA AUTH ERROR
    ========================================= */

    if (authError) {

        console.error(
            "SUPABASE AUTH ERROR:",
            authError
        );

        throw new Error(
            "Email hoặc mật khẩu không chính xác."
        );
    }


    /* =========================================
       KIỂM TRA AUTH USER
    ========================================= */

    const authUser =
        authData?.user;


    if (!authUser) {

        throw new Error(
            "Không lấy được thông tin tài khoản."
        );
    }


    console.log(
        "AUTH USER ID:",
        authUser.id
    );

    console.log(
        "AUTH EMAIL:",
        authUser.email
    );


    /* =========================================
       LẤY USER TỪ public.users
    ========================================= */

    const {
        data: publicUser,
        error: publicUserError
    } = await supabaseClient
        .from("users")
        .select(
            "user_id, name, email, phone, role, status, auth_user_id"
        )
        .eq(
            "auth_user_id",
            authUser.id
        )
        .single();


    /* =========================================
       KIỂM TRA public.users
    ========================================= */

    if (publicUserError) {

        console.error(
            "PUBLIC USER ERROR:",
            publicUserError
        );

        throw new Error(
            "Tài khoản Auth chưa được liên kết với hệ thống."
        );
    }


    if (!publicUser) {

        throw new Error(
            "Không tìm thấy thông tin người dùng."
        );
    }


    /* =========================================
       KIỂM TRA TRẠNG THÁI
    ========================================= */

    if (
        publicUser.status &&
        publicUser.status.toLowerCase() !== "active"
    ) {

        await supabaseClient.auth.signOut();

        throw new Error(
            "Tài khoản của bạn đang bị khóa."
        );
    }


    /* =========================================
       TRẢ VỀ USER
    ========================================= */

    const user = {

        userId: publicUser.user_id,

        name: publicUser.name,

        email: publicUser.email,

        phone: publicUser.phone,

        role: publicUser.role,

        status: publicUser.status,

        authUserId: publicUser.auth_user_id,

        lastLogin: new Date().toISOString()

    };


    console.log(
        "================================="
    );

    console.log(
        "LOGIN THÀNH CÔNG"
    );

    console.log(
        "USER:",
        user
    );

    console.log(
        "ROLE:",
        user.role
    );

    console.log(
        "================================="
    );


    return {

        success: true,

        message: "Đăng nhập thành công.",

        user: user

    };

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

    if (
        !user
    ) {

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
        JSON.stringify(user)
    );


    /* =========================================
       LƯU USER ID
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
       ĐÁNH DẤU ĐÃ LOGIN
    ========================================= */

    localStorage.setItem(
        "userLoggedIn",
        "true"
    );


    /* =========================================
       LOG
    ========================================= */

    console.log(
        "================================="
    );

    console.log(
        "ĐÃ LƯU PHIÊN ĐĂNG NHẬP"
    );

    console.log(
        "USER:",
        user
    );

    console.log(
        "================================="
    );


    return true;

}


/* =====================================================
   4. LẤY USER HIỆN TẠI
===================================================== */

function getCurrentUser() {

    try {

        const savedUser =
            localStorage.getItem(
                "bachson_current_user"
            );


        if (
            !savedUser
        ) {

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

    catch (
        error
    ) {

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
       XÓA LOGIN STATUS
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

        if (
            !loginForm
        ) {

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
           LẤY INPUT
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
           SUBMIT FORM
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
                   LẤY CONTACT
                ================================= */

                const contact =
                    contactInput
                        ? contactInput.value.trim()
                        : "";


                /* =================================
                   LẤY PASSWORD
                ================================= */

                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* =================================
                   KIỂM TRA CONTACT
                ================================= */

                if (
                    !contact
                ) {

                    if (
                        message
                    ) {

                        message.textContent =
                            "Vui lòng nhập Email hoặc số điện thoại.";

                    }


                    if (
                        contactInput
                    ) {

                        contactInput.focus();

                    }


                    return;

                }


                /* =================================
                   KIỂM TRA PASSWORD
                ================================= */

                if (
                    !password
                ) {

                    if (
                        message
                    ) {

                        message.textContent =
                            "Vui lòng nhập mật khẩu.";

                    }


                    if (
                        passwordInput
                    ) {

                        passwordInput.focus();

                    }


                    return;

                }


                /* =================================
                   HIỂN THỊ ĐANG LOGIN
                ================================= */

                if (
                    message
                ) {

                    message.textContent =
                        "Đang đăng nhập...";

                }


                if (
                    button
                ) {

                    button.disabled =
                        true;

                    button.textContent =
                        "Đang đăng nhập...";

                }


                /* =================================
                   GỌI SUPABASE
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
                       LOGIN THÀNH CÔNG
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
                                "Supabase không trả về result.user."
                            );


                            if (
                                message
                            ) {

                                message.textContent =
                                    "Đăng nhập thành công nhưng không nhận được thông tin tài khoản.";

                            }


                            return;

                        }


                        /* =============================
                           LƯU SESSION
                        ============================= */

                        const sessionSaved =
                            saveLoginSession(
                                result.user
                            );


                        if (
                            !sessionSaved
                        ) {

                            if (
                                message
                            ) {

                                message.textContent =
                                    "Không thể lưu phiên đăng nhập.";

                            }


                            return;

                        }


                        /* =============================
                           THÔNG BÁO
                        ============================= */

                        if (
                            message
                        ) {

                            message.textContent =
                                result.message ||
                                "Đăng nhập thành công.";

                        }


                        /* =============================
                           LOG USER
                        ============================= */

                        console.log(
                            "================================="
                        );

                        console.log(
                            "LOGIN THÀNH CÔNG"
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

                        console.log(
                            "Last Login:",
                            result.user.lastLogin
                        );

                        console.log(
                            "================================="
                        );


                        /* =============================
                            CHUYỂN TRANG THEO ROLE
                        ============================= */

                        /* =============================
   CHUYỂN TRANG THEO ROLE
============================= */

setTimeout(
    function() {

        if (result.user.role === "admin") {

            console.log("ROLE ADMIN → chuyển đến trang quản trị");

            window.location.href = "admin.html";

        } else {

            console.log("ROLE USER → chuyển đến trang chủ");

            window.location.href = "index.html";

        }

    },
    800
);

                    }


                    /* =================================
                       LOGIN THẤT BẠI
                    ================================= */

                    else {

                        if (
                            message
                        ) {

                            message.textContent =
                                (
                                    result &&
                                    result.message
                                ) ||
                                "Đăng nhập không thành công.";

                        }

                    }

                }


                /* =================================
                   LỖI
                ================================= */

                catch (
                    error
                ) {

                    console.error(
                        "================================="
                    );

                    console.error(
                        "LỖI LOGIN SUPABASE:"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "================================="
                    );


                    if (
                        message
                    ) {

                        message.textContent =
                            error.message ||
                            "Không thể kết nối Supabase.";

                    }

                }


                finally {

                    /* =================================
                       MỞ LẠI BUTTON
                    ================================= */

                    if (
                        button
                    ) {

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