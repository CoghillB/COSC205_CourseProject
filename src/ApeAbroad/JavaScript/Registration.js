$(document).ready( () => {
    $('#register').on('submit', async (event) => {
        event.preventDefault();
        const data = {
            f_name: $('#fName').val(),
            l_name: $('#lName').val(),
            email: $('#email').val(),
            password: $('#password').val(),
        }

        console.log(data);

        if (!data.email || !data.password || !data.f_name || !data.l_name) {
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

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "../HTML/HomePage.html";
            } else {
                alert("A problem occurred and your account was not created.");
            }

        } catch (e) {
            console.log(e);
        }
    })
});