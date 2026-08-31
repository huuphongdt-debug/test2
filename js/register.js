/* =====================================================
   REGISTER - BÁCH SƠN TỬU
   ĐĂNG KÝ TÀI KHOẢN - SUPABASE AUTH
===================================================== */


/* =====================================================
   1. KIỂM TRA SUPABASE
===================================================== */

if (typeof supabaseClient === "undefined") {

    console.error("Không tìm thấy supabaseClient.");

    throw new Error(
        "Supabase chưa được khởi tạo."
    );
}


/* =====================================================
   2. FORM ĐĂNG KÝ
===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (!registerForm) {

    console.error(
        "Không tìm thấy #registerForm."
    );

} else {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            /* =========================================
               LẤY DỮ LIỆU
            ========================================= */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const contact =
                document
                    .getElementById("contact")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            const button =
                document.getElementById(
                    "registerButton"
                );


            /* =========================================
               KIỂM TRA HỌ TÊN
            ========================================= */

            if (!name) {

                message.textContent =
                    "Vui lòng nhập họ và tên.";

                return;
            }


            /* =========================================
               KIỂM TRA CONTACT
            ========================================= */

            if (!contact) {

                message.textContent =
                    "Vui lòng nhập Email hoặc số điện thoại.";

                return;
            }


            /* =========================================
               KIỂM TRA MẬT KHẨU
            ========================================= */

            if (password.length < 6) {

                message.textContent =
                    "Mật khẩu phải có ít nhất 6 ký tự.";

                return;
            }


            /* =========================================
               XÁC NHẬN MẬT KHẨU
            ========================================= */

            if (password !== confirmPassword) {

                message.textContent =
                    "Mật khẩu xác nhận không giống nhau.";

                return;
            }


            /* =========================================
               XÁC ĐỊNH EMAIL / PHONE
            ========================================= */

            const isEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(contact);


            const cleanPhone =
                contact
                    .replace(/\s+/g, "")
                    .replace(/-/g, "")
                    .replace(/\./g, "");


            const isPhone =
                /^(0|\+84)[0-9]{9,10}$/
                    .test(cleanPhone);


            /* =========================================
               KIỂM TRA HỢP LỆ
            ========================================= */

            if (!isEmail && !isPhone) {

                message.textContent =
                    "Email hoặc số điện thoại không hợp lệ.";

                return;
            }


            /* =========================================
               HIỂN THỊ ĐANG XỬ LÝ
            ========================================= */

            message.textContent =
                "Đang tạo tài khoản...";


            if (button) {

                button.disabled = true;

                button.dataset.oldText =
                    button.textContent;

                button.textContent =
                    "Đang đăng ký...";
            }


            try {

                let authResult;


                /* =================================================
                   ĐĂNG KÝ BẰNG EMAIL
                ================================================= */

                if (isEmail) {

                    console.log(
                        "Đăng ký bằng EMAIL:",
                        contact
                    );


                    authResult =
                        await supabaseClient.auth.signUp({

                            email: contact,

                            password: password,

                            options: {

                                data: {

                                    name: name

                                }

                            }

                        });

                }


                /* =================================================
                   ĐĂNG KÝ BẰNG SỐ ĐIỆN THOẠI
                ================================================= */

                else {

                    console.log(
                        "Đăng ký bằng PHONE:",
                        cleanPhone
                    );


                    let phone =
                        cleanPhone;


                    /* ---------------------------------------------
                       Chuyển 0xxxxxxxxx → +84xxxxxxxxx
                    --------------------------------------------- */

                    if (phone.startsWith("0")) {

                        phone =
                            "+84" +
                            phone.substring(1);

                    }


                    authResult =
                        await supabaseClient.auth.signUp({

                            phone: phone,

                            password: password,

                            options: {

                                data: {

                                    name: name

                                }

                            }

                        });

                }


                /* =================================================
                   KIỂM TRA LỖI AUTH
                ================================================= */

                const {
                    data,
                    error
                } = authResult;


                if (error) {

                    console.error(
                        "SUPABASE AUTH ERROR:",
                        error
                    );


                    throw new Error(
                        error.message ||
                        "Không thể tạo tài khoản."
                    );
                }


                console.log(
                    "AUTH REGISTER DATA:",
                    data
                );


                /* =================================================
                   KIỂM TRA USER
                ================================================= */

                const authUser =
                    data?.user;


                if (!authUser) {

                    throw new Error(
                        "Không nhận được thông tin tài khoản từ Supabase."
                    );
                }


                console.log(
                    "AUTH USER ID:",
                    authUser.id
                );


                /* =================================================
                   LƯU THÔNG TIN ĐĂNG KÝ
                ================================================= */

                localStorage.setItem(
                    "bachson_registered_user",
                    JSON.stringify({

                        id: authUser.id,

                        name: name,

                        email:
                            isEmail
                                ? contact
                                : null,

                        phone:
                            isPhone
                                ? cleanPhone
                                : null

                    })
                );


                /* =================================================
                   EMAIL
                ================================================= */

                if (isEmail) {

                    message.textContent =
                        "Đăng ký thành công. Vui lòng kiểm tra email nếu cần xác nhận tài khoản.";

                }


                /* =================================================
                   PHONE
                ================================================= */

                else {

                    message.textContent =
                        "Đăng ký thành công. Vui lòng xác nhận mã OTP gửi đến số điện thoại.";

                }


                /* =================================================
                   CHUYỂN LOGIN
                ================================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );

            }


            /* =================================================
               XỬ LÝ LỖI
            ================================================= */

            catch (error) {

                console.error(
                    "LỖI ĐĂNG KÝ:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Không thể tạo tài khoản.";

            }


            /* =================================================
               MỞ LẠI NÚT
            ================================================= */

            finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        button.dataset.oldText ||
                        "Đăng ký";

                }

            }

        }
    );

}


/* =====================================================
   KHỞI ĐỘNG
===================================================== */

console.log(
    "================================="
);

console.log(
    "BÁCH SƠN TỬU - REGISTER SYSTEM"
);

console.log(
    "REGISTER SYSTEM READY"
);

console.log(
    "================================="
);