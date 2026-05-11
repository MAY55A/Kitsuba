import {validateAccountInfo, validatePassword} from "../utils/credentials.js";

document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;
    const message = document.getElementById("message");

    let res = validateAccountInfo(username, email);
    if (res.isValid) {
        res = validatePassword(password1, password2);
        if (res.isValid) {
            const userData = {
                email: email,
                username: username,
                password: password1
            };

            try {
                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok)
                    window.location.href = "/login";
                else {
                    let text = await response.text();
                    if (text.length > 50)
                        message.innerText = "An error occurred";
                    else
                        message.innerText = text
                }

            } catch (error) {
                console.log("An error occurred: " + error.message);
                message.innerText = "An error occurred";
            }
        } else {
            message.innerText = res.errorMessage;
        }
    } else {
        message.innerText = res.errorMessage;
    }
});