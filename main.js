import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore,
   collection, 
   addDoc ,
   doc, 
  getDoc,
  setDoc
  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
// console.log(db);


let form = document.getElementById("idForm");
const nameField = document.getElementById("name");
const idField = document.getElementById("id");
const emailField = document.getElementById("email");
let currentId = "";
let url_links = document.getElementById("urllinks");
let send_button = document.getElementById("send");
let coming_links = document.getElementById("coming_links");

send_button.addEventListener("click", () => {
    let userInput = url_links.value; 
    
    if (userInput.indexOf("http://") === 0 || userInput.indexOf("https://") === 0) {
        if (userInput.indexOf(".") > -1) {
        coming_links.innerHTML += `<a href="${userInput}" target="_blank">${userInput}</a><br>`; 
        }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid link entered!",
      });
    }
    url_links.value = "";
});

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
        Swal.fire({
          title: "Access Granted!",
          text: "Correct password. Now you can add the ID.",
          icon: "success",
        });
        form.style.display = "block"; 
      } else {
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

    const idRef = collection(db, "ID's"); 
       try {
      await setDoc(doc(idRef, idField.value), {
            link : url_links.value,
             });

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

//  read  data ka function 
let getid = document.getElementById("enterdid")
getid.addEventListener ("keydown" ,( event) => {
  if (event.key === "Enter") {
    // console.log(getid.value);
    readData ()
    getid.value = "";
  }
})
async function readData() {
  const documentId = getid.value.trim(); 
  if (!documentId) {
    Swal.fire({
      title: "Error",
      text: "Please enter a valid document ID!",
      icon: "error",
    });
    return;
  }
// console.log("Document reference:", doc(db, "ID's", documentId));

  try {
    const docRef = doc(db, "ID's", documentId);
    // console.log("Document reference:", docRef)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      coming_links.innerHTML += `${JSON.stringify(docSnap.data())} <br>`;
      Swal.fire({
        title: "Document Found",
        // text: `Data: ${JSON.stringify(docSnap.data())}`,
        icon: "success",
      });
    } else {
      console.log("No such document!");
      Swal.fire({
        title: "Error",
        text: "No document found with the given ID.",
        icon: "error",
      });
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    Swal.fire({
      title: "Error",
      text: "An error occurred while fetching the document.",
      icon: "error",
    });
  }
}

