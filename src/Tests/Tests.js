window.onload = function () {
    const testResults = document.getElementById('testResults');
    testResults.innerHTML = '';

    // Fetch HomePage.html and parse
    fetch('../ApeAbroad/HTML/HomePage.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load HomePage.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            runHomepageTests(doc);
        })
        .catch(error => {
            console.error("Error loading HomePage.html:", error);
            testResults.innerHTML = `<p class="fail">Error loading HomePage.html: ${error.message}</p>`;
        });

    // display test results
    function displayResult(testName, passed, message = '') {
        const testDiv = document.createElement('div');
        testDiv.classList.add('test', passed ? 'pass' : 'fail');
        testDiv.textContent = `${testName}: ${passed ? 'PASSED' : 'FAILED'}`;

        if (message) {
            const details = document.createElement('small');
            details.textContent = ` - ${message}`;
            testDiv.appendChild(details);
        }

        testResults.appendChild(testDiv);
    }

    //  test cases
    function runHomepageTests(doc) {
        console.log("Running tests on HomePage.html...");

        // Navbar Login Link
        try {
            const loginLink = doc.querySelector('#login');
            const passed = loginLink && loginLink.getAttribute('href') === 'Login.html';
            displayResult('Navbar Login Link', passed, passed ? '' : 'Login link is missing or incorrect.');
        } catch (e) {
            displayResult('Navbar Login Link', false, e.message);
        }

        // About Us Link
        try {
            const aboutUsLink = doc.querySelector('a[href="#about-us"]');
            const passed = aboutUsLink !== null;
            displayResult('Navbar About Us Link', passed, passed ? '' : 'About Us link is missing.');
        } catch (e) {
            displayResult('Navbar About Us Link', false, e.message);
        }

        // Contact Us Link
        try {
            const contactUsLink = doc.querySelector('a[href="#contact-us"]');
            const passed = contactUsLink !== null;
            displayResult('Navbar Contact Us Link', passed, passed ? '' : 'Contact Us link is missing.');
        } catch (e) {
            displayResult('Navbar Contact Us Link', false, e.message);
        }

        // Client Stories Carousel - Multiple Items
        try {
            const carouselItems = doc.querySelectorAll('.carousel-item');
            const passed = carouselItems.length > 1;
            displayResult('Client Stories Carousel Items', passed, passed ? '' : 'Carousel items are missing.');
        } catch (e) {
            displayResult('Client Stories Carousel Items', false, e.message);
        }

        //  First Carousel Item
        try {
            const firstItem = doc.querySelector('.carousel-item');
            const passed = firstItem && firstItem.classList.contains('active');
            displayResult('First Carousel Item Active', passed, passed ? '' : 'First carousel item is not active.');
        } catch (e) {
            displayResult('First Carousel Item Active', false, e.message);
        }


        // Social Media Links
        try {
            const facebookLink = doc.querySelector('.fab.fa-facebook');
            const twitterLink = doc.querySelector('.fab.fa-twitter');
            const instagramLink = doc.querySelector('.fab.fa-instagram');
            const passed = facebookLink && twitterLink && instagramLink;
            displayResult('Footer Social Media Links', passed, passed ? '' : 'One or more social media links are missing.');
        } catch (e) {
            displayResult('Footer Social Media Links', false, e.message);
        }
    }
};
