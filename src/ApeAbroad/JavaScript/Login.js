// jQuery code for user login page

$(document).ready( () => {

    //TODO: Add event listener for login button
    $('#login').on('submit', async (event) => {
        event.preventDefault();

        let data = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        if (!data.username || !data.password) {
            alert('Please enter a username and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', { //TODO: Change to correct URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // TODO: Change to correct content type
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text(); // Catch response body if any
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();

            if (result.ok) {
                window.location.href = '/HomePage.html'; //TODO: Change to correct URL
            } else {
                alert('Invalid username or password');
            }
        } catch (e) {
            console.error(e);
        }
    });
});