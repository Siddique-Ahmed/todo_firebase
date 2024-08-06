/*
###############################################################################################
                                HIDE AND SHOW LIST
###############################################################################################
*/
let bar = document.querySelector("nav i");
let list = document.querySelector(".list");

bar.addEventListener("click", (e) => {
  e.preventDefault();
  if (list.style.left === "-800px") {
    list.style.left = "0";
    bar.classList.add("fa-xmark");
    bar.classList.remove("fa-bar");
  } else {
    list.style.left = "-800px";
    bar.classList.add("fa-bar");
    bar.classList.remove("fa-xmark");
  }
});

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
    loader.style.display = "grid";
    setTimeout(() => {
      loader.style.display = "none";
      todo_box.style.display = "flex";
      content_box.style.display = "none";
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
  loader.style.display = "grid";
  signOut(auth)
    .then(() => {
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    })
    .catch((error) => {
      swal.fire("you have an error");
    });
});

/*
###############################################################################################
                               IMPORT DATA FROM FIREBASE
###############################################################################################
*/
import {
  collection,
  db,
  auth,
  signOut,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "../firebase.js";

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

/*
###############################################################################################
                              LOAD TODO ITEMS
###############################################################################################
*/

async function loadTodo(currUser) {
  task_box.innerHTML = "";
  loader.style.display = "grid";

  const querySnapshot = await getDocs(collection(db, "todo"));
  const currUserEmail = currUser.email;

  let found = false;

  querySnapshot.forEach((doc) => {
    if (doc.data().user_email === currUserEmail) {
      found = true;
      task_box.style.display = "flex";
      task_box.innerHTML += `<div class="box" data-id="${doc.id}">
        <div class="editable-box" contenteditable="false">${
          doc.data().todo_item
        }</div>
        <div class="items">
          <button id="edit_btn" class="edit_btn fa-solid fa-pen-to-square"></button>
          <button id="delete_btn" class="delete_btn fa-solid fa-trash"></button>
        </div>
      </div>`;
    }
  });

  if (!found) {
  }

  loader.style.display = "none";

  document.querySelectorAll(".edit_btn").forEach((button) => {
    button.addEventListener("click", handleEdit);
  });

  document.querySelectorAll(".delete_btn").forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}
/*
###############################################################################################
                              EDIT DATA FROM TODO 
###############################################################################################
*/

function handleEdit(event) {
  const box = event.target.closest(".box");
  const editableBox = box.querySelector(".editable-box");

  if (editableBox.contentEditable === "false") {
    editableBox.contentEditable = "true";
    editableBox.focus();
    event.target.classList.replace("fa-pen-to-square", "fa-save");
  } else {
    editableBox.contentEditable = "false";
    event.target.classList.replace("fa-save", "fa-pen-to-square");

    const newTodoItem = editableBox.innerText;
    const docId = box.getAttribute("data-id");

    updateDoc(doc(db, "todo", docId), {
      todo_item: newTodoItem,
    })
      .then(() => {
        console.log("Todo item updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }
}

/*
###############################################################################################
                              DELETE DATA FROM TODO 
###############################################################################################
*/

function handleDelete(event) {
  const box = event.target.closest(".box");
  const docId = box.getAttribute("data-id");

  deleteDoc(doc(db, "todo", docId))
    .then(() => {
      console.log("Todo item deleted successfully.");
      box.remove();
      if (box.innerHTML.trim() === "") {
        task_box.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
}

/*
###############################################################################################
                              TODO WORK START 
###############################################################################################
*/

let add_task = document.querySelector("#add_task");
let task_box = document.querySelector(".task_box");

async function todoAddTask() {
  let todo_input = document.querySelector("#todo_input").value.trim();
  let currUserEmail = auth.currentUser.email;

  if (todo_input === "") {
    swal.fire("please add task!");
    return;
  }

  let todo_obj = {
    todo_item: todo_input,
    user_email: currUserEmail,
  };

  try {
    const docRef = await addDoc(collection(db, "todo"), todo_obj);
    await loadTodo(auth.currentUser);
  } catch (e) {
    swal.fire(e);
  }
  document.querySelector("#todo_input").value = "";
}

auth.onAuthStateChanged((user) => {
  if (user) {
    getUserProfile(user);
    loadTodo(user);
  } else {
    window.location.href = "../index.html";
  }
});
add_task.addEventListener("click", (e) => {
  e.preventDefault();
  todoAddTask();
});
