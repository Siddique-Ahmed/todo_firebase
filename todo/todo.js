/*
###############################################################################################
                               IMPORT DATA FROM FIREBASE
###############################################################################################
*/
import { collection, db, auth, signOut, getDocs, addDoc } from "../firebase.js";

/*
###############################################################################################
                                  SHOW AND HIDE TODO LIST
###############################################################################################
*/
let content_box = document.querySelector(".content_box");
let todo_box = document.querySelector(".todo_box");
let show_todo = document.querySelector("#show_todo");
let loader = document.querySelector(".loader");

show_todo.addEventListener("click", (e) => {
  e.preventDefault();
  if ((todo_box.style.display = "none")) {
    content_box.style.display = "none";
    loader.style.display = "grid";
    setTimeout(() => {
      loader.style.display = "grid";
      todo_box.style.display = "flex";
      loader.style.display = "none";
    }, 800);
  }
});

/*
###############################################################################################
                              LOGOUT USER
###############################################################################################
*/

let logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      loader.style.display = "grid";
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    })
    .catch((error) => {
      swal.fire("you have and error");
    });
});

/*
###############################################################################################
                            HAMBURGER
###############################################################################################
*/

let bar = document.querySelector("nav i");
let list = document.querySelector("nav .list");

bar.addEventListener("click", (e) => {
  e.preventDefault();
  if (list.style.left == "-800px") {
    list.style.left = "0";
    bar.classList.add("fa-xmark");
    bar.classList.remove("fa-bar");
  } else {
    list.style.left = "-800px";
    bar.classList.remove("fa-xmark");
    bar.classList.add("fa-bar");
  }
});

/*
###############################################################################################
                              GETTING PROFILE PICTURE 
###############################################################################################
*/

let user_profile = document.querySelector(".user_profile");

function getUserProfile(currentUser) {
  const userEmail = currentUser.email;

  getDocs(collection(db, "users"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().user_email === userEmail) {
          if (doc.data().img_url) {
            let img = document.createElement("img");
            img.src = doc.data().img_url;
            user_profile.appendChild(img);
          } else {
            console.error("No image URL found for the user");
          }
        } else {
          console.log("This is not the logged-in user");
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    getUserProfile(user);
  } else {
    window.location.href = "../index.html";
  }
});

/*
###############################################################################################
                              LOAD TODO ITEMS
###############################################################################################
*/

async function loadTodo() {
  const querySnapshot = await getDocs(collection(db, "todo"));
  querySnapshot.forEach((doc) => {
    task_box.style.display = "flex";
    task_box.innerHTML += `<div class="box">
            <input type="text" id="edit_data" value="${
              doc.data().todo_item
            }" disabled/>
            <div class="items">
              <button id="edit_btn" class="fa-solid fa-pen-to-square"></button>
              <button id="delete_btn" class="fa-solid fa-trash"></button>
            </div>
          </div>`;

    let todo_obj = {
      todo_item: todo_input,
    };
  });
}
loadTodo();

/*
###############################################################################################
                              TODO WORK START 
###############################################################################################
*/

let add_task = document.querySelector("#add_task");
let task_box = document.querySelector(".task_box");

async function todoAddTask() {
  let todo_input = document.querySelector("#todo_input").value.trim();

  if (todo_input === "") {
    swal.fire("please add task!");
  }

  loadTodo();

  try {
    const docRef = await addDoc(collection(db, "todo"), todo_obj);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

add_task.addEventListener("click", (e) => {
  e.preventDefault();
  todoAddTask();
});

document.addEventListener("DOMContentLoaded",loadTodo());