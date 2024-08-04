/*
###############################################################################################
                                PASSWORD EYE HIDE AND SHOW
###############################################################################################
*/
let p_eye = document.querySelector("#login_eye");
let p = document.querySelector("#user_password");

p_eye.addEventListener("click", (e) => {
  e.preventDefault();
  if (p.type == "password") {
    p.type = "text";
    p_eye.classList.add("fa-eye-slash");
    p_eye.classList.remove("fa-eye");
  } else {
    p.type = "password";
    p_eye.classList.add("fa-eye");
    p_eye.classList.remove("fa-eye-slash");
  }
});

/*
###############################################################################################
                               IMPORT ELEMENTS FROM FIREBASE
###############################################################################################
*/

import {
  signInWithEmailAndPassword,
  auth,
  onAuthStateChanged
} from "./firebase.js"

/*
###############################################################################################
                                LOGIN FUNCTION
###############################################################################################
*/

let login_btn = document.querySelector("#login_user");

async function loginUserAccount() {
  let user_email = document.querySelector("#user_email").value.trim();
  let user_password = document.querySelector("#user_password").value.trim();

  // Input Validation
  if (user_email === "" || user_password === "") {
    swal.fire("Please fill in the required fields");
    return;
  }

  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, user_email, user_password);
    const user = userCredential.user;

    // Redirecting based on authentication
    if (window.location.pathname !== '/todo/todo.html') {
      window.location.href = "../todo/todo.html";
    }

  } catch (error) {
    // Error Handling
    const errorMessage = error.message;
    swal.fire(`Error: ${errorMessage}`);  // Showing the error to the user
    console.log(errorMessage);  // Logging for debugging purposes
  }
}


login_btn.addEventListener("click", (e) => {
  e.preventDefault();
  loginUserAccount();
});
