const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const emailElement = document.getElementById("email");
const passElement = document.getElementById("pass")
const loginErrorMsg = document.getElementById("login-error-msg");

//penser à rajouter les errors


function loginFunc(){
    
    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const body={
            email:emailElement.value,
            password:passElement.value
        }

        const responseUser = await fetch('http://localhost:5678/api/users/login',{
        method:"POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type" : "application/json"
            }
        });
        const user = await responseUser.json();
        if (user.token){
            localStorage.setItem("token", user.token)
            window.location.href = "file:///C:/Users/33782/Desktop/CoursOC/Portfolio-architecte-sophie-bluel-master/FrontEnd/index.html"
        }
    })
}

loginFunc();