import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQcTcHavdgP8fG6SEIhOFfn6lyJhRHb7Q",
  authDomain: "link-sharing-app-6a912.firebaseapp.com",
  projectId: "link-sharing-app-6a912",
  storageBucket: "link-sharing-app-6a912.appspot.com",
  messagingSenderId: "170155224904",
  appId: "1:170155224904:web:d08601b8b9095f90fbcd7d",
  measurementId: "G-C28X5L9Z51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(db);


let form = document.getElementById("idForm");
const nameField = document.getElementById("name");
const idField = document.getElementById("id");
const emailField = document.getElementById("email");

let currentId = "";

// Show form and handle password confirmation
let createId_Btn = document.getElementById("create");
createId_Btn.addEventListener("click", function () {
  idcreate();
});

async function idcreate() {
  Swal.fire({
    title: "Enter an admin password",
    input: "password",
    inputAttributes: {
      autocapitalize: "off",
      placeholder: "Type your password here",
      maxlength: 20,
    },
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
    preConfirm: (inputValue) => {
      if (!inputValue) {
        Swal.showValidationMessage("Password is required!");
      } else {
        return inputValue;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const inputValue = result.value.trim();
      if (inputValue === "linksharingapp") {
        console.log("Password is correct:", inputValue);
        Swal.fire({
          title: "Access Granted!",
          text: "Correct password. Now you can add the ID.",
          icon: "success",
        });
        form.style.display = "block"; 
      } else {
        console.log("Incorrect password:", inputValue);
        Swal.fire({
          title: "Access Denied!",
          text: "Incorrect password. Please try again.",
          icon: "error",
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "You didn't submit an admin password.",
        icon: "info",
      });
    }
  });
}
async function submitForm() {
  if (!nameField.value || !idField.value || !emailField.value) {
    Swal.fire({
      title: "Error",
      text: "All fields are required!",
      icon: "error",
    });
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "ID's"), {
      name: nameField.value,
      id: idField.value,
      email: emailField.value,
    });
    console.log("Document written with ID: ", docRef.id);
    Swal.fire({
      title: "ID Created",
      text: "The ID was successfully created.",
      icon: "success",
    });

    nameField.value = "";
    idField.value = "";
    emailField.value = "";
    form.style.display = "none";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

let btn = document.getElementById("formbtn");
btn.addEventListener("click", submitForm);
