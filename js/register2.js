/* =====================================================
   REGISTER - BÁCH SƠN TỬU
   ĐĂNG KÝ TÀI KHOẢN

   GỬI GOOGLE APPS SCRIPT
   BẰNG FORM POST + IFRAME

   KHÔNG DÙNG FETCH
   KHÔNG BỊ CORS

   DỮ LIỆU GỬI:

   {
       action: "register",
       name: "...",
       contact: "...",
       password: "..."
   }

   ĐƯỢC ĐÓNG GÓI THÀNH:

   payload = JSON.stringify(data)
===================================================== */


/* =====================================================
   1. GOOGLE APPS SCRIPT URL
===================================================== */

const WRITE_API_URL =
    "https://script.google.com/macros/s/AKfycbyr_zxBVmIooNneOOjL6PLssyJy1tRnGA3fyfEysMC7RzZ1A2yxPkzT-HvIWtveQXAe/exec";


/* =====================================================
   2. GỬI ĐĂNG KÝ
   FORM POST + IFRAME
===================================================== */

function sendRegister(data) {

    return new Promise(
        function(resolve, reject) {

            console.log(
                "================================="
            );

            console.log(
                "BẮT ĐẦU GỬI ĐĂNG KÝ"
            );

            console.log(
                "DỮ LIỆU:",
                data
            );

            console.log(
                "URL:",
                WRITE_API_URL
            );

            console.log(
                "================================="
            );


            let iframe = null;

            let form = null;

            let timeout = null;

            let finished = false;


            /* =========================================
               DỌN DẸP
            ========================================= */

            function cleanup() {

                if (timeout) {

                    clearTimeout(
                        timeout
                    );

                    timeout = null;

                }


                if (form) {

                    form.remove();

                    form = null;

                }


                if (iframe) {

                    iframe.remove();

                    iframe = null;

                }

            }


            try {

                /* =====================================
                   KIỂM TRA URL
                ===================================== */

                if (!WRITE_API_URL) {

                    throw new Error(
                        "WRITE_API_URL chưa được cấu hình."
                    );

                }


                /* =====================================
                   TẠO IFRAME
                ===================================== */

                iframe =
                    document.createElement(
                        "iframe"
                    );


                iframe.id =
                    "registerSubmitFrame";


                iframe.name =
                    "registerSubmitFrame";


                iframe.style.display =
                    "none";


                document.body.appendChild(
                    iframe
                );


                /* =====================================
                   TẠO FORM
                ===================================== */

                form =
                    document.createElement(
                        "form"
                    );


                form.method =
                    "POST";


                form.action =
                    WRITE_API_URL;


                form.target =
                    "registerSubmitFrame";


                form.enctype =
                    "application/x-www-form-urlencoded";


                form.style.display =
                    "none";


                /* =====================================
                   TẠO PAYLOAD
                ===================================== */

                const payload =
                    document.createElement(
                        "input"
                    );


                payload.type =
                    "hidden";


                payload.name =
                    "payload";


                payload.value =
                    JSON.stringify(
                        data
                    );


                form.appendChild(
                    payload
                );


                /* =====================================
                   ĐƯA FORM VÀO BODY
                ===================================== */

                document.body.appendChild(
                    form
                );


                console.log(
                    "PAYLOAD GỬI GOOGLE:"
                );


                console.log(
                    JSON.stringify(
                        data
                    )
                );


                /* =====================================
                   THEO DÕI IFRAME
                ===================================== */

                iframe.onload =
                    function() {

                        if (finished) {

                            return;

                        }


                        finished = true;


                        console.log(
                            "GOOGLE APPS SCRIPT ĐÃ PHẢN HỒI ĐĂNG KÝ."
                        );


                        cleanup();


                        /*
                         * Không đọc JSON response
                         * vì iframe khác domain.
                         *
                         * Chỉ xác nhận request
                         * đã được gửi tới Apps Script.
                         */

                        resolve({

                            success: true

                        });

                    };


                /* =====================================
                   TIMEOUT
                ===================================== */

                timeout =
                    setTimeout(
                        function() {

                            if (finished) {

                                return;

                            }


                            finished = true;


                            cleanup();


                            console.error(
                                "TIMEOUT GOOGLE APPS SCRIPT"
                            );


                            reject(
                                new Error(
                                    "Không nhận được phản hồi từ Google Apps Script sau 15 giây."
                                )
                            );


                        },
                        15000
                    );


                /* =====================================
                   SUBMIT
                ===================================== */

                form.submit();


                console.log(
                    "FORM ĐĂNG KÝ ĐÃ SUBMIT ĐẾN GOOGLE APPS SCRIPT"
                );

            }

            catch(error) {

                finished = true;


                cleanup();


                console.error(
                    "LỖI SEND REGISTER:",
                    error
                );


                reject(
                    error
                );

            }

        }
    );

}


/* =====================================================
   3. FORM ĐĂNG KÝ
===================================================== */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        async function(e) {

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
                document
                    .getElementById(
                        "registerMessage"
                    );


            const button =
                document.querySelector(
                    "#registerForm button[type='submit']"
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
               KIỂM TRA EMAIL / SỐ ĐIỆN THOẠI
            ========================================= */

            if (!contact) {

                message.textContent =
                    "Vui lòng nhập Email hoặc số điện thoại.";

                return;

            }


            /* =========================================
               KIỂM TRA MẬT KHẨU
            ========================================= */

            if (
                password.length < 6
            ) {

                message.textContent =
                    "Mật khẩu phải có ít nhất 6 ký tự.";

                return;

            }


            /* =========================================
               KIỂM TRA XÁC NHẬN MẬT KHẨU
            ========================================= */

            if (
                password !==
                confirmPassword
            ) {

                message.textContent =
                    "Mật khẩu xác nhận không giống nhau.";

                return;

            }


            /* =========================================
               KIỂM TRA EMAIL
            ========================================= */

            const isEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(
                        contact
                    );


            /* =========================================
               KIỂM TRA SỐ ĐIỆN THOẠI
            ========================================= */

            const cleanPhone =
                contact
                    .replace(
                        /\s+/g,
                        ""
                    )
                    .replace(
                        /-/g,
                        ""
                    )
                    .replace(
                        /\./g,
                        ""
                    );


            const isPhone =
                /^(0|\+84)[0-9]{9,10}$/
                    .test(
                        cleanPhone
                    );


            /* =========================================
               KIỂM TRA HỢP LỆ
            ========================================= */

            if (
                !isEmail &&
                !isPhone
            ) {

                message.textContent =
                    "Email hoặc số điện thoại không hợp lệ.";

                return;

            }


            /* =========================================
               HIỂN THỊ ĐANG XỬ LÝ
            ========================================= */

            message.textContent =
                "Đang tạo tài khoản...";


            /* =========================================
               KHÓA NÚT
            ========================================= */

            if (button) {

                button.disabled =
                    true;


                button.dataset.oldText =
                    button.textContent;


                button.textContent =
                    "Đang đăng ký...";

            }


            try {

                /* =====================================
                   TẠO DATA ĐĂNG KÝ
                ===================================== */

                const registerData = {

                    action:
                        "register",

                    name:
                        name,

                    contact:
                        contact,

                    password:
                        password

                };


                console.log(
                    "REGISTER DATA:",
                    registerData
                );


                /* =====================================
                   GỬI GOOGLE
                ===================================== */

                const result =
                    await sendRegister(
                        registerData
                    );


                console.log(
                    "KẾT QUẢ REGISTER:",
                    result
                );


                /* =====================================
                   THÀNH CÔNG
                ===================================== */

                if (
                    result &&
                    result.success
                ) {

                    message.textContent =
                        "Đăng ký tài khoản thành công.";


                    /* ==============================
                       XÓA FORM
                    ============================== */

                    document
                        .getElementById(
                            "registerForm"
                        )
                        .reset();


                    /*
                     * LƯU TRẠNG THÁI
                     *
                     * Tạm thời chỉ đánh dấu
                     * đã đăng ký.
                     *
                     * Sau này khi có LOGIN
                     * sẽ lưu USER ID / SESSION.
                     */

                    localStorage.setItem(
                        "registerSuccess",
                        "true"
                    );


                    /* ==============================
                       SAU NÀY CHUYỂN LOGIN
                    ============================== */

                    /*
                    setTimeout(
                        function() {

                            window.location.href =
                                "login.html";

                        },
                        1500
                    );
                    */

                }

                else {

                    message.textContent =
                        "Không thể tạo tài khoản.";

                }

            }

            catch(error) {

                console.error(
                    "LỖI ĐĂNG KÝ:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Không thể kết nối máy chủ.";

            }


            finally {

                /* =====================================
                   MỞ LẠI NÚT
                ===================================== */

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


/* =====================================================
   4. TEST ĐĂNG KÝ
===================================================== */

function testRegister() {

    console.log(
        "================================="
    );

    console.log(
        "TEST REGISTER"
    );

    console.log(
        "================================="
    );


    const testData = {

        action:
            "register",

        name:
            "Nguyễn Văn Test",

        contact:
            "0900000000",

        password:
            "123456"

    };


    sendRegister(
        testData
    )

    .then(
        function(result) {

            console.log(
                "TEST ĐĂNG KÝ:",
                result
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                "TEST ĐĂNG KÝ LỖI:",
                error
            );

        }
    );

}