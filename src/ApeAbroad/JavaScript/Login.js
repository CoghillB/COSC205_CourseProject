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
                window.location.href = '../HTML/Search.html'; // Redirect to the user page on successful login
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (e) {
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