import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore ,
    collection, 
    addDoc
 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQcTcHavdgP8fG6SEIhOFfn6lyJhRHb7Q",
  authDomain: "link-sharing-app-6a912.firebaseapp.com",
  projectId: "link-sharing-app-6a912",
  storageBucket: "link-sharing-app-6a912.appspot.com", // Corrected the storageBucket URL
  messagingSenderId: "170155224904",
  appId: "1:170155224904:web:d08601b8b9095f90fbcd7d",
  measurementId: "G-C28X5L9Z51",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// console.log(db);

let createId_Btn = document.getElementById ("create");
createId_Btn.addEventListener ("click" , idcreate());
async function idcreate () {
    try {
    const docRef = await addDoc(collection(db, "ID's"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

 }
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
      const inputPassword = result.value;
      if (inputPassword === "Linksharingapp") {
        console.log("Password is correct:", inputPassword); // Logs the input value if correct
        Swal.fire({
          title: "Access Granted!",
          text: "Correct password. Now you can add the ID.",
          icon: "success",
        });
      } else {
        console.log("Incorrect password:", inputPassword); // Logs the incorrect input
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
  
//   ${result.value}