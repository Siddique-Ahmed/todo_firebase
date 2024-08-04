/*
###############################################################################################
                                PASSWORD EYE HIDE AND SHOW
###############################################################################################
*/
let p_eye = document.querySelector("#p_eye");
let c_eye = document.querySelector("#c_eye");
let p = document.querySelector("#user_password");
let cp = document.querySelector("#user_confirm_password");

c_eye.addEventListener("click", (e) => {
  e.preventDefault();
  if (cp.type === "password") {
    cp.type = "text";
    c_eye.classList.add("fa-eye-slash");
    c_eye.classList.remove("fa-eye");
  } else {
    cp.type = "password";
    c_eye.classList.add("fa-eye");
    c_eye.classList.remove("fa-eye-slash");
  }
});

p_eye.addEventListener("click", (e) => {
  e.preventDefault();
  if (p.type === "password") {
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
                                GET FIREBASE ELEMENTS
###############################################################################################
*/

import {
  auth,
  createUserWithEmailAndPassword,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
} from "../firebase.js";

/*
###############################################################################################
                                GET HTML ELEMENTS
###############################################################################################
*/
let signup_btn = document.querySelector("#submit_data");
let loader = document.querySelector(".loader");

// create user account \\

function createUserAccount() {
  let user_profile = document.querySelector("#user_profile_img");
  let first_name = document.querySelector("#first_name").value.trim();
  let last_name = document.querySelector("#last_name").value.trim();
  let username = document.querySelector("#username").value.trim();
  let user_email = document.querySelector("#user_email").value.trim();
  let user_password = document.querySelector("#user_password").value.trim();
  let user_confirm_password = document
    .querySelector("#user_confirm_password")
    .value.trim();

  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateUsername(username) {
    return usernameRegex.test(username);
  }
  function validateEmail(email) {
    return emailRegex.test(email);
  }

  // Individual Field Validations
  if (first_name === "") {
    swal.fire("Please enter your first name");
    return;
  }
  if (last_name === "") {
    swal.fire("Please enter your last name");
    return;
  }
  if (username === "") {
    swal.fire("Please enter your username");
    return;
  }
  if (user_email === "") {
    swal.fire("Please enter your email");
    return;
  }
  if (user_password === "") {
    swal.fire("Please enter your password");
    return;
  }
  if (user_confirm_password === "") {
    swal.fire("Please confirm your password");
    return;
  }
  if (!user_profile.files.length) {
    swal.fire("Please select a profile image!");
    return;
  }

  // Additional Validations
  if (first_name.length > 25 || first_name.length < 3) {
    swal.fire("First name should be greater than 3 and less than 25 characters");
    return;
  }
  if (last_name.length > 25 || last_name.length < 3) {
    swal.fire("Last name should be greater than 3 and less than 25 characters");
    return;
  }
  if (!validateUsername(username)) {
    swal.fire("Invalid username!");
    return;
  }
  if (!validateEmail(user_email)) {
    swal.fire("Invalid email!");
    return;
  }
  if (user_password.length < 6) {
    swal.fire("Password is weak!");
    return;
  }
  if (user_confirm_password.length < 6) {
    swal.fire("Password is weak!");
    return;
  }
  if (user_confirm_password !== user_password) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Passwords don't match!",
    });
    return;
  }

  // Proceed with account creation
  loader.style.display = "grid";
  const user_info = {
    first_name,
    last_name,
    username,
    user_email,
    user_password,
  };

  createUserWithEmailAndPassword(auth, user_email, user_password)
    .then((userCredential) => {
      const user = userCredential.user;

      const storageRef = ref(storage, user_email);

      uploadBytes(storageRef, user_profile.files[0]).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        getDownloadURL(storageRef).then(async (url) => {
          console.log(url);
          user_info.img_url = url;
          try {
            const docRef = await addDoc(collection(db, `users`), user_info);
            setTimeout(() => {
              loader.style.display = "none";
              document.querySelector("#user_profile_img").value = "";
              document.querySelector("#first_name").value = "";
              document.querySelector("#last_name").value = "";
              document.querySelector("#username").value = "";
              document.querySelector("#user_email").value = "";
              document.querySelector("#user_password").value = "";
              document.querySelector("#user_confirm_password").value = "";
              window.location.href = "../index.html";
            }, 900);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        });
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      loader.style.display = "none"; // Hide loader on error
      swal.fire(errorMessage);
    });
}

// eventlistener on signup button \\

signup_btn.addEventListener("submit", (e) => { // Corrected event listener
  e.preventDefault();
  createUserAccount();
});
