/* =====================================================
   BÁCH SƠN TỬU
   JAVASCRIPT DÙNG CHUNG TOÀN WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       1. MENU MOBILE
    ================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    function closeMobileMenu() {

        if (mobileMenu) {
            mobileMenu.classList.remove("show");
        }

        if (menuToggle) {

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    }


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", function (event) {

            event.stopPropagation();

            mobileMenu.classList.toggle("show");

            const icon = menuToggle.querySelector("i");

            if (!icon) return;

            if (mobileMenu.classList.contains("show")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    }


    /* =================================================
       2. ĐÓNG MENU KHI CLICK LINK
    ================================================= */

    const mobileLinks =
        document.querySelectorAll(".mobile-menu a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            closeMobileMenu();

        });

    });


    /* =================================================
       3. ĐÓNG MENU KHI CLICK RA NGOÀI
    ================================================= */

    document.addEventListener("click", function (event) {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        const clickedInsideMenu =
            mobileMenu.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        if (
            !clickedInsideMenu &&
            !clickedToggle
        ) {

            closeMobileMenu();

        }

    });


    /* =================================================
       4. TỰ ĐỘNG ACTIVE MENU
    ================================================= */

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";


    const allNavLinks =
        document.querySelectorAll(
            ".navbar a, .mobile-menu a"
        );


    allNavLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) return;


        /*
           Lấy tên file HTML
        */

        const linkPage =
            href
                .split("#")[0]
                .split("?")[0];


        /*
           Chỉ xử lý link HTML
        */

        if (
            linkPage &&
            linkPage.endsWith(".html")
        ) {

            if (linkPage === currentPage) {

                link.classList.add("active");

            } else {

                link.classList.remove("active");

            }

        }

    });


    /* =================================================
       5. HEADER KHI CUỘN
    ================================================= */

    const header =
        document.querySelector(".header");

    let lastScrollTop = 0;


    if (header) {

        window.addEventListener(
            "scroll",
            function () {

                const currentScroll =
                    window.pageYOffset ||
                    document.documentElement.scrollTop;


                /*
                   Chỉ ẩn header trên mobile
                */

                if (window.innerWidth <= 768) {

                    if (
                        currentScroll > lastScrollTop &&
                        currentScroll > 100
                    ) {

                        header.classList.add("hide");

                        closeMobileMenu();

                    } else {

                        header.classList.remove("hide");

                    }

                } else {

                    header.classList.remove("hide");

                }


                lastScrollTop =
                    currentScroll <= 0
                        ? 0
                        : currentScroll;

            },
            {
                passive: true
            }
        );

    }


    /* =================================================
       6. SMOOTH SCROLL
    ================================================= */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =================================================
       7. FADE IN KHI CUỘN
    ================================================= */

    const revealSelector = [

        /* TRANG CHỦ */

        ".story-container",
        ".products-header",
        ".product-card",
        ".products-button",
        ".process-header",
        ".process-item",
        ".gallery-header",
        ".gallery-item",
        ".contact-container",

        /* ABOUT */

        ".about-intro-container",
        ".about-value-card",
        ".about-philosophy-container",
        ".about-cta",

        /* PRODUCTS */

        ".product-page-header",
        ".product-page-card",

        /* GOOGLE MAP */

        ".location-container",
        ".location-address",
        ".location-map",

        /* FOOTER */

        ".footer-container"

    ].join(", ");


    const revealElements =
        document.querySelectorAll(
            revealSelector
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("show");


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "reveal"
                );

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "show"
                );

            }
        );

    }


    /* =================================================
       8. FORM LIÊN HỆ
    ================================================= */

    const contactForm =
        document.querySelector(
            ".contact-form form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameInput =
                    document.querySelector(
                        "#name"
                    );


                const phoneInput =
                    document.querySelector(
                        "#phone"
                    );


                const emailInput =
                    document.querySelector(
                        "#email"
                    );


                const subjectInput =
                    document.querySelector(
                        "#subject"
                    );


                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const subject =
                    subjectInput
                        ? subjectInput.value.trim()
                        : "";


                /* HỌ TÊN */

                if (!name) {

                    alert(
                        "Vui lòng nhập họ và tên."
                    );

                    if (nameInput) {
                        nameInput.focus();
                    }

                    return;

                }


                /* SỐ ĐIỆN THOẠI */

                if (!phone) {

                    alert(
                        "Vui lòng nhập số điện thoại."
                    );

                    if (phoneInput) {
                        phoneInput.focus();
                    }

                    return;

                }


                /* KIỂM TRA SỐ ĐIỆN THOẠI */

                const normalizedPhone =
                    phone.replace(
                        /[\s.-]/g,
                        ""
                    );


                const phonePattern =
                    /^(0|\+84)[0-9]{9,10}$/;


                if (
                    !phonePattern.test(
                        normalizedPhone
                    )
                ) {

                    alert(
                        "Số điện thoại chưa đúng định dạng."
                    );

                    if (phoneInput) {
                        phoneInput.focus();
                    }

                    return;

                }


                /* EMAIL */

                if (email) {

                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailPattern.test(
                            email
                        )
                    ) {

                        alert(
                            "Email chưa đúng định dạng."
                        );

                        if (emailInput) {
                            emailInput.focus();
                        }

                        return;

                    }

                }


                /* NỘI DUNG */

                if (!subject) {

                    alert(
                        "Vui lòng nhập nội dung cần tư vấn."
                    );

                    if (subjectInput) {
                        subjectInput.focus();
                    }

                    return;

                }


                /* THÔNG BÁO */

                alert(
                    "Cảm ơn bạn đã liên hệ Bách Sơn Tửu!\n\n" +
                    "Chúng tôi sẽ liên hệ với bạn " +
                    "trong thời gian sớm nhất."
                );


                contactForm.reset();

            }
        );

    }


    /* =================================================
       9. NĂM HIỆN TẠI
    ================================================= */

    const currentYear =
        document.querySelectorAll(
            ".current-year"
        );


    currentYear.forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =================================================
       10. NÚT CHỈ ĐƯỜNG GOOGLE MAPS
    ================================================= */

    const directionButtons =
        document.querySelectorAll(
            ".direction-button"
        );


    directionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const mapUrl =
                        this.dataset.mapUrl;


                    if (mapUrl) {

                        window.open(
                            mapUrl,
                            "_blank"
                        );

                        return;

                    }


                    const address =
                        this.dataset.address;


                    if (address) {

                        const encodedAddress =
                            encodeURIComponent(
                                address
                            );


                        const url =
                            "https://www.google.com/maps/dir/?api=1&destination=" +
                            encodedAddress;


                        window.open(
                            url,
                            "_blank"
                        );

                    }

                }
            );

        }
    );


    /* =================================================
       11. RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 768) {

                closeMobileMenu();

                if (header) {

                    header.classList.remove(
                        "hide"
                    );

                }

            }

        }
    );

});