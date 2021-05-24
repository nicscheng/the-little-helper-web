/*
function checkInputs() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(emailValue===''){
        setErrorFor(email, 'Email cannot be blank.')
    }

    else {
        setSuccessFor(email);
    }

    if(emailValue===''){
        setErrorFor(password, 'Password cannot be blank.')
    }

    else {
        setSuccessFor(password);
    }
}

function setErrorFor(input, message){
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');

    small.innerText = message;

    formControl.className = 'form_control error';
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success'
}
*/
    /*
    const login_form = document.getElementById('login_form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const login_form = document.getElementById('login_form');
    */

    document.getElementById('button2').addEventListener('click', function(){
        document.querySelector('.bg_modal').style.display = 'flex';
    });

    document.querySelector('.close').addEventListener('click', function(){
        document.querySelector('.bg_modal').style.display = 'none';
    });
    
    document.getElementById('button3').addEventListener('click', function(){
        document.querySelector('.bg_modal2').style.display = 'flex';
    });
    
    document.querySelector('.close2').addEventListener('click', function(){
        document.querySelector('.bg_modal2').style.display = 'none';
    });

    document.getElementById('button4').addEventListener('click', function(){
        document.querySelector('.bg_modal3').style.display = 'flex';
    });
    
    document.querySelector('.close3').addEventListener('click', function(){
        document.querySelector('.bg_modal3').style.display = 'none';
    });

    

/*
const login_form = document.getElementById('login_form');
const email = document.getElementById('email');
const password = document.getElementById('password');

login_form.addEventListener('submit', (e) => {
    e.preventDefault();
    checkInputs();
});
*/






/*
function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form_msg");

    messageElement.textContent = message;
    messageElement.classList.remove("fprm_msg_success", "form_msg_error");
    messageElement.classList.add('form_msg--${type}');
}

function setInputError()

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const regForm = document.querySelector("#register");

    loginForm.addEventListener("submit", e=> {
        e.preventDefault();

        setFormMessage(login, "error", "Invalid email/password.");
    })
});
*/

