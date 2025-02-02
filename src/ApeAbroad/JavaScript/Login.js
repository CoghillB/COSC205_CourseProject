$(document).ready(() => {
    $('#loginForm').on('submit', async (event) => {
        event.preventDefault();
        const data = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        if (!data.email || !data.password) {
            alert('Please enter a valid username and password');
            return;
        }

        try {
            // TODO: Change to the correct URL once the page is up
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            // if (!response.ok) {
            //     const errorText = await response.text(); // Catch response body if any
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            const result = await response.json();

            if (result.success) {
                window.sessionStorage.setItem("user", data.username);
                window.location.href = '../HTML/HomePage.html'; // Redirect to the user page on successful login
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (e) {
            console.log(e);
        }
    })
});