$(document).ready( () => {
    $('#register').on('submit', async (event) => {
        event.preventDefault();
        const data = {
            firstName: $('#fName').val(),
            lastName: $('#lName').val(),
            username: $('#email').val(),
            password: $('#password').val(),
        }

        if (!data.username || !data.password || !data.firstName || !data.lastName) {
            alert('Please enter a username, password, first name, and last name');
            return;
        }

        try {
            // TODO: Change to the correct URL once the page is up
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Catch response body if any
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();

            if (result.success) {
                alert('Account created successfully! Please log in.');
                window.location.href = '/src/ApeAbroad/Login.html'; // Redirect to the user page on successful login
            } else {
                alert(result.message || 'Account creation failed. Please try again.');
            }
        } catch (e) {
            console.log(e);
        }
    })
});