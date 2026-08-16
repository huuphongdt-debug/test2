/* =====================================================
   BÁCH SƠN TỬU
   JAVASCRIPT
===================================================== */


/* =====================================================
   1. MENU MOBILE
===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", function () {

        mobileMenu.classList.toggle("show");

        const icon = menuToggle.querySelector("i");

        if (mobileMenu.classList.contains("show")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });
}


/* =====================================================
   2. ĐÓNG MENU MOBILE KHI CLICK LINK
===================================================== */

const mobileLinks = document.querySelectorAll(".mobile-menu a");

mobileLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (mobileMenu) {
            mobileMenu.classList.remove("show");
        }

        if (menuToggle) {

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

});


/* =====================================================
   3. HEADER KHI CUỘN TRANG
===================================================== */

let lastScrollTop = 0;

const header = document.querySelector(".header");

window.addEventListener("scroll", function () {

    const currentScroll =
        window.pageYOffset ||
        document.documentElement.scrollTop;

    if (!header) return;

    /*
       Khi cuộn xuống:
       Ẩn header trên màn hình nhỏ
    */

    if (
        currentScroll > lastScrollTop &&
        currentScroll > 100
    ) {

        header.classList.add("hide");

    } else {

        header.classList.remove("hide");

    }

    lastScrollTop = currentScroll <= 0
        ? 0
        : currentScroll;

});


/* =====================================================
   4. ĐÓNG MENU KHI CLICK RA NGOÀI
===================================================== */

document.addEventListener("click", function (event) {

    if (!menuToggle || !mobileMenu) return;

    const clickedInsideMenu =
        mobileMenu.contains(event.target);

    const clickedToggle =
        menuToggle.contains(event.target);

    if (
        !clickedInsideMenu &&
        !clickedToggle
    ) {

        mobileMenu.classList.remove("show");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* =====================================================
   5. CUỘN MƯỢT ĐẾN SECTION
===================================================== */

const anchorLinks =
    document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

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

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =====================================================
   6. HIỆU ỨNG FADE-IN KHI CUỘN
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".story-container, " +
        ".products-header, " +
        ".product-card, " +
        ".process-header, " +
        ".process-item, " +
        ".gallery-header, " +
        ".gallery-item, " +
        ".contact-container"
    );


const revealObserver =
    new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(function (element) {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =====================================================
   7. FORM LIÊN HỆ
===================================================== */

const contactForm =
    document.querySelector(".contact-form form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.querySelector("#name")?.value.trim();

        const phone =
            document.querySelector("#phone")?.value.trim();

        const email =
            document.querySelector("#email")?.value.trim();

        const subject =
            document.querySelector("#subject")?.value.trim();


        /* Kiểm tra họ tên */

        if (!name) {

            alert("Vui lòng nhập họ và tên.");

            return;
        }


        /* Kiểm tra số điện thoại */

        if (!phone) {

            alert("Vui lòng nhập số điện thoại.");

            return;
        }


        /* Kiểm tra nội dung */

        if (!subject) {

            alert("Vui lòng nhập nội dung cần tư vấn.");

            return;
        }


        /*
           Tạm thời chỉ thông báo.
           Sau này sẽ kết nối form với Email / Zalo /
           Google Sheets / Backend.
        */

        alert(
            "Cảm ơn bạn đã liên hệ Bách Sơn Tửu!\n\n" +
            "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        );


        contactForm.reset();

    });

}


/* =====================================================
   8. NĂM HIỆN TẠI CHO FOOTER
===================================================== */

const currentYear =
    document.querySelector(".current-year");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}