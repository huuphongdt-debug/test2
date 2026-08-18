/* =====================================================
   BÁCH SƠN TỬU
   JAVASCRIPT — BẢN CHUẨN HÓA DÙNG CHUNG TOÀN WEBSITE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       1. MENU MOBILE
    ================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const header = document.querySelector(".header");

    const closeMobileMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove("show");

        const icon = menuToggle?.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            mobileMenu.classList.toggle("show");

            const icon = menuToggle.querySelector("i");
            if (!icon) return;

            icon.classList.toggle("fa-bars", !mobileMenu.classList.contains("show"));
            icon.classList.toggle("fa-xmark", mobileMenu.classList.contains("show"));
        });
    }

    mobileMenu?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
        if (!menuToggle || !mobileMenu) return;

        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

/* =================================================
   2. HEADER ẨN / HIỆN KHI CUỘN
================================================= */

let lastScrollTop = 0;

if (header) {

    window.addEventListener("scroll", function () {

        const currentScroll =
            window.scrollY ||
            document.documentElement.scrollTop ||
            0;


        /* =========================
           ĐẦU TRANG
        ========================= */

        if (currentScroll <= 50) {

            header.style.transform = "translateY(0)";

            lastScrollTop = currentScroll;

            return;
        }


        /* =========================
           MOBILE + TABLET
        ========================= */

        if (window.innerWidth <= 992) {


            /* CUỘN XUỐNG */

            if (
                currentScroll > lastScrollTop &&
                currentScroll > 100
            ) {

                header.style.transform =
                    "translateY(-110%)";

                closeMobileMenu();
            }


            /* CUỘN LÊN */

            else if (
                currentScroll < lastScrollTop
            ) {

                header.style.transform =
                    "translateY(0)";
            }

        }


        /* =========================
           DESKTOP
        ========================= */

        else {

            header.style.transform =
                "translateY(0)";
        }


        lastScrollTop = currentScroll;

    }, {
        passive: true
    });
}

    /* =================================================
       3. ACTIVE MENU THEO TRANG
    ================================================= */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll(".navbar a, .mobile-menu a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        const page = href.split("#")[0].split("?")[0];
        if (!page || !page.endsWith(".html")) return;

        link.classList.toggle("active", page === currentPage);
    });

    /* =================================================
       4. ACTIVE MENU THEO SECTION — TRANG CHỦ
       Giúp Trang chủ / Giới thiệu / Sản phẩm... đổi active
       khi người dùng cuộn đến từng khu vực.
    ================================================= */

    const sectionLinks = [...document.querySelectorAll('.navbar a[href*="#"]')]
        .filter(link => {
            const href = link.getAttribute("href");
            return href && href.startsWith("#");
        });

    const sections = sectionLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = `#${entry.target.id}`;
                sectionLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === id
                    );
                });
            });
        }, {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* =================================================
       5. CUỘN MƯỢT
    ================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const headerHeight = header?.offsetHeight || 0;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "smooth"
            });
        });
    });

    /* =================================================
       6. REVEAL KHI LƯỚT TRANG
    ================================================= */

    const revealSelector = [
        /* HOME */
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

        /* STORY */
        ".story-hero",
        ".story-section",
        ".story-time",
        ".story-values-header",
        ".story-value",
        ".story-cta",

        /* PRODUCTS */
        ".product-page-header",
        ".product-page-card",
        ".products-hero-content",
        ".products-intro-content",
        ".product-list-header",
        ".product-detail-card",
        ".products-cta",

        /* PROCESS PAGE */
        ".process-page-hero",
        ".process-step",
        ".process-message",
        ".process-cta",

        /* MAP + FOOTER */
        ".location-container",
        ".location-address",
        ".location-map",
        ".footer-container"
    ].join(", ");

    const revealElements = document.querySelectorAll(revealSelector);

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach((element, index) => {
            element.classList.add("reveal");
            element.style.setProperty(
                "--reveal-delay",
                `${Math.min(index % 5, 4) * 70}ms`
            );
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => element.classList.add("show"));
    }

    /* =================================================
       7. FORM LIÊN HỆ
    ================================================= */

    const contactForm = document.querySelector(".contact-form form");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameInput = document.querySelector("#name");
            const phoneInput = document.querySelector("#phone");
            const emailInput = document.querySelector("#email");
            const subjectInput = document.querySelector("#subject");

            const name = nameInput?.value.trim() || "";
            const phone = phoneInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";
            const subject = subjectInput?.value.trim() || "";

            if (!name) {
                alert("Vui lòng nhập họ và tên.");
                nameInput?.focus();
                return;
            }

            if (!phone) {
                alert("Vui lòng nhập số điện thoại.");
                phoneInput?.focus();
                return;
            }

            const normalizedPhone = phone.replace(/[\s.-]/g, "");
            if (!/^(0|\+84)[0-9]{9,10}$/.test(normalizedPhone)) {
                alert("Số điện thoại chưa đúng định dạng.");
                phoneInput?.focus();
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("Email chưa đúng định dạng.");
                emailInput?.focus();
                return;
            }

            if (!subject) {
                alert("Vui lòng nhập nội dung cần tư vấn.");
                subjectInput?.focus();
                return;
            }

            alert(
                "Cảm ơn bạn đã liên hệ Bách Sơn Tửu!\n\n" +
                "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
            );

            contactForm.reset();
        });
    }

    /* =================================================
       8. GOOGLE MAPS — NÚT CHỈ ĐƯỜNG
    ================================================= */

    document.querySelectorAll(".direction-button").forEach(button => {
        button.addEventListener("click", () => {
            const mapUrl = button.dataset.mapUrl;
            const address = button.dataset.address;

            if (mapUrl) {
                window.open(mapUrl, "_blank", "noopener,noreferrer");
                return;
            }

            if (address) {
                const url =
                    "https://www.google.com/maps/dir/?api=1&destination=" +
                    encodeURIComponent(address);

                window.open(url, "_blank", "noopener,noreferrer");
            }
        });
    });

    /* =================================================
       9. NĂM FOOTER
    ================================================= */

    document.querySelectorAll(".current-year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* =================================================
       10. RESIZE
    ================================================= */

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            header?.classList.remove("hide");
        }
    });
});