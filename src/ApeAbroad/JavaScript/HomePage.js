$(document).ready(function () {
    $("nav a").click(function (e) {
        e.preventDefault();
        const targetSection = $(this).attr("href");
        $("html, body").animate({
            scrollTop: $(targetSection).offset().top
        }, 800);
    });

    $(window).scroll(function () {
        let scrollPos = $(window).scrollTop();
        $('section').each(function () {
            const sectionTop = $(this).offset().top - 70;
            const sectionHeight = $(this).outerHeight();
            const sectionID = $(this).attr('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                $('nav a').removeClass('active');
                $('nav a[href="#' + sectionID + '"]').addClass('active');
            }
        });
    });

    $(window).on("scroll", function () {
        $(".about-section, .client-stories-section").each(function () {
            const topOfElement = $(this).offset().top;
            const bottomOfWindow = $(window).scrollTop() + $(window).innerHeight();
            if (bottomOfWindow > topOfElement) {
                $(this).animate({opacity: 1}, 800);
            }
        });
    });

    $("#contactUs").on("click", function (e) {
        e.preventDefault(); // Prevent redirection
        alert("Contact Email: contact@apeabroad.com");
    });

    // When the user clicks on the social media links, alert with the message "Coming soon!"
    $("#socials").on("click", function (e) {
        e.preventDefault(); // Prevent redirection
        alert("Coming soon!");
    });
});