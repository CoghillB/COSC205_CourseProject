$(document).ready(() => {
    // Attach a submit event handler to the login form
    $('#loginForm').on('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Collect user input values for email and password
        const data = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        // Validate if both email and password are provided
        if (!data.email || !data.password) {
            alert('Please enter a valid username and password');
            return; // Exit if validation fails
        }

        try {
            // Send a POST request to the server with the login data
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}, // Set headers to indicate JSON payload
                body: JSON.stringify(data), // Convert the data object into a JSON string
            });

            // Parse the response body as JSON
            const result = await response.json();

            // Handle login success
            if (result.success) {
                window.sessionStorage.setItem("user", data.username); // Store user data in session storage
                window.location.href = '../HTML/Search.html'; // Redirect to the search page
            } else {
                // Alert the user with a failure message
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (e) {
            // Log any errors that occur during the request
            console.log(e);
        }
    })
});


// Test Cases
//
// Test Case 1 - Missing email or password
// test('Login fails with missing email or password', async () => {
//     document.body.innerHTML = `
//         <form id="loginForm">
//             <input id="email" value="" />
//             <input id="password" value="" />
//         </form>
//     `;
//
//     window.alert = jest.fn();
//
//     const loginForm = $('#loginForm');
//     const submitEvent = new Event('submit');
//     await loginForm.trigger(submitEvent);
//
//     expect(window.alert).toHaveBeenCalledWith('Please enter a valid username and password');
// });


// Test Case 2 - Incorrect email or password
//
// test('Login fails with incorrect email or password', async () => {
//     document.body.innerHTML = `
//         <form id="loginForm">
//             <input id="email" value="wrongUser@example.com" />
//             <input id="password" value="WrongPassword" />
//         </form>
//     `;
//
//     const mockFetch = jest.fn(() =>
//         Promise.resolve({
//             json: () => Promise.resolve({ success: false, message: 'Invalid email or password.' }),
//         })
//     );
//     global.fetch = mockFetch;
//
//     window.alert = jest.fn();
//
//     const loginForm = $('#loginForm');
//     const submitEvent = new Event('submit');
//     await loginForm.trigger(submitEvent);
//
//     expect(window.alert).toHaveBeenCalledWith('Invalid email or password.');
// });

//Test Case 3 - Try/Catch block for network error
//
// test('Login gracefully handles server/network errors', async () => {
//     document.body.innerHTML = `
//         <form id="loginForm">
//             <input id="email" value="validUser@example.com" />
//             <input id="password" value="ValidPassword" />
//         </form>
//     `;
//
//     const mockFetch = jest.fn(() =>
//         Promise.reject(new Error('Network issue'))
//     );
//     global.fetch = mockFetch;
//     console.log = jest.fn();
//
//     const loginForm = $('#loginForm');
//     const submitEvent = new Event('submit');
//     await loginForm.trigger(submitEvent);
//
//     expect(console.log).toHaveBeenCalledWith(new Error('Network issue'));
// });


//Test Case 4
//
// test('Form submit does not fire fetch when inputs are empty', async () => {
//     document.body.innerHTML = `
//         <form id="loginForm">
//             <input id="email" value="" />
//             <input id="password" value="" />
//         </form>
//     `;
//
//     const mockFetch = jest.fn();
//     global.fetch = mockFetch;
//     window.alert = jest.fn();
//
//     const loginForm = $('#loginForm');
//     const submitEvent = new Event('submit');
//     await loginForm.trigger(submitEvent);
//
//     expect(mockFetch).not.toHaveBeenCalled();
//     expect(window.alert).toHaveBeenCalledWith('Please enter a valid username and password');
// });