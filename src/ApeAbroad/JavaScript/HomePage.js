$(document).ready(function () {
    // Smooth scrolling for navigation links
    $('.section').on('click', 'a', function (event) {
        if (this.hash !== "") {
            event.preventDefault(); // Prevent default anchor click behavior
            const hash = this.hash; // Store hash
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash; // Add hash to URL when done scrolling
            });
        }
    });

    // Update active navigation link based on scroll position
    $(window).scroll(function () {
        let scrollPos = $(window).scrollTop(); // Get current scroll position
        $('section').each(function () {
            const sectionTop = $(this).offset().top - 70; // Top position of section (adjusted for offset)
            const sectionHeight = $(this).outerHeight(); // Height of the section
            const sectionID = $(this).attr('id'); // ID of the section
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Highlight the corresponding navigation link
                $('nav a').removeClass('active');
                $('nav a[href="#' + sectionID + '"]').addClass('active');
            }
        });
    });


    // Alert with contact email when "Contact Us" button is clicked
    $("#contactUs").on("click", function (e) {
        e.preventDefault(); // Prevent default click behavior
        alert("Contact Email: contact@apeabroad.com"); // Show contact email alert
    });

    // Alert placeholder for upcoming socials feature
    $("#socials").on("click", function (e) {
        e.preventDefault(); // Prevent default click behavior
        alert("Coming soon!"); // Show "Coming soon!" alert
    });

    // Helper function to fade in visible sections
    function fadeInVisibleSections() {
        $(".about-section, .client-stories-section").each(function () {
            const sectionTop = $(this).offset().top; // Top of the section
            const viewportBottom = $(window).scrollTop() + $(window).innerHeight(); // Visible viewport bottom
            if (viewportBottom > sectionTop) {
                $(this).animate({opacity: 1}, 800); // Fade in animation
            }
        });
    }

    $(window).on("load", fadeInVisibleSections);
    $(window).on("scroll", fadeInVisibleSections);
});