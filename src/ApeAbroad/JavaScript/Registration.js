$(document).ready(() => {
    // Add event listener to the form with ID 'register' on form submission
    $('#register').on('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Collect form data into an object
        const data = {
            f_name: $('#fName').val(), // First name
            l_name: $('#lName').val(), // Last name
            email: $('#email').val(),  // Email address
            password: $('#password').val(), // Password
        }

        console.log(data); // Log the collected data for debugging

        // Check if any of the required fields are missing
        if (!data.email || !data.password || !data.f_name || !data.l_name) {
            alert('Please enter a username, password, first name, and last name'); // Show an alert if validation fails
            return;
        }

        try {
            // Send a POST request to the server to register the user
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST', // HTTP method
                headers: {'Content-Type': 'application/json'}, // Set header to indicate JSON data
                body: JSON.stringify(data), // Convert data to JSON string
            });

            // Check if the server response indicates success
            if (response.ok) {
                alert("Account created successfully!"); // Show success message
                window.location.href = "../HTML/Login.html"; // Redirect to login page
            } else {
                // Show an error message if the account creation fails
                alert("A problem occurred and your account was not created.");
            }

        } catch (e) {
            // Log any errors to the console
            console.log(e);
        }
    })
});


// Test Cases
//
// Test 1 - Missing fields
//
// test('Form submission fails with missing fields', async () => {
//     Set up the DOM with a mock form
//     document.body.innerHTML = `
//         <form id="register">
//             <input id="fName" value="" />
//             <input id="lName" value="Doe" />
//             <input id="email" value="johndoe@example.com" />
//             <input id="password" value="password" />
//         </form>
//     `;
//
//     window.alert = jest.fn();  // Mock alert
//     const mockFetch = jest.fn(); // Mock fetch
//     global.fetch = mockFetch;
//
//     const registerForm = $('#register');
//     const submitEvent = new Event('submit');
//     await registerForm.trigger(submitEvent);
//
//     expect(window.alert).toHaveBeenCalledWith('Please enter a username, password, first name, and last name');
//     expect(mockFetch).not.toHaveBeenCalled(); // Simulates that no API call is made
// });
//
//
// Test 2 - Successful Registration
//
//     test('Form submission succeeds with valid input', async () => {
//         // Set up the DOM with a mock form
//         document.body.innerHTML = `
//         <form id="register">
//             <input id="fName" value="John" />
//             <input id="lName" value="Doe" />
//             <input id="email" value="johndoe@example.com" />
//             <input id="password" value="password123" />
//         </form>
//     `;
//
//         window.alert = jest.fn();  // Mock alert
//         const mockFetch = jest.fn(() =>
//             Promise.resolve({ ok: true })  // Mock a successful response
//         );
//         global.fetch = mockFetch;
//
//         const registerForm = $('#register');
//         const submitEvent = new Event('submit');
//         await registerForm.trigger(submitEvent);
//
//         expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 f_name: 'John',
//                 l_name: 'Doe',
//                 email: 'johndoe@example.com',
//                 password: 'password123',
//             }),
//         });
//
//         expect(window.alert).toHaveBeenCalledWith('Account created successfully!');
//         expect(window.location.href).toBe('../HTML/HomePage.html'); // Page redirection
//     });

// Test 3 - Server Error on Registration
//
//     test('Form submission fails when server returns an error', async () => {
//         // Set up the DOM with a mock form
//         document.body.innerHTML = `
//         <form id="register">
//             <input id="fName" value="John" />
//             <input id="lName" value="Doe" />
//             <input id="email" value="johndoe@example.com" />
//             <input id="password" value="password123" />
//         </form>
//     `;
//
//         window.alert = jest.fn();  // Mock alert
//         const mockFetch = jest.fn(() =>
//             Promise.resolve({ ok: false })  // Mock a failed response
//         );
//         global.fetch = mockFetch;
//
//         const registerForm = $('#register');
//         const submitEvent = new Event('submit');
//         await registerForm.trigger(submitEvent);
//
//         expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 f_name: 'John',
//                 l_name: 'Doe',
//                 email: 'johndoe@example.com',
//                 password: 'password123',
//             }),
//         });
//
//         expect(window.alert).toHaveBeenCalledWith('A problem occurred and your account was not created.');
//     });