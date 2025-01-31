
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQcTcHavdgP8fG6SEIhOFfn6lyJhRHb7Q",
  authDomain: "link-sharing-app-6a912.firebaseapp.com",
  projectId: "link-sharing-app-6a912",
  storageBucket: "link-sharing-app-6a912.appspot.com",
  messagingSenderId: "170155224904",
  appId: "1:170155224904:web:d08601b8b9095f90fbcd7d",
  measurementId: "G-C28X5L9Z51",
};

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

let getid = document.getElementById("enterdid");
getid.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const documentId = getid.value.trim();
    if (!documentId) {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid document ID!",
        icon: "error",
      });
      return;
    }

    currentId = documentId;

    await fetchLinks(currentId);
  }
});

async function fetchLinks(documentId) {
  try {
    const docRef = doc(db, "ID's", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const links = data.links || [];

      // Display the links
      coming_links.innerHTML = links
        .map(
          (link) => `
            <div>
              <a href="${link}" target="_blank">${link}</a>
              <i class="fa-solid fa-trash delete" data-link="${link}"></i>
            </div>
          `
        )
        .join("");

      // Attach event listeners to delete icons
      const deleteIcons = document.querySelectorAll(".delete");
      deleteIcons.forEach((icon) => {
        icon.addEventListener("click", async (event) => {
          const linkToDelete = event.target.getAttribute("data-link");
          await deleteLink(documentId, linkToDelete);
        });
      });

      Swal.fire({
        title: "Document Found",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Invalid ID",
        text: "Please put the correct ID or Create it.",
        icon: "info",
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
// Add a link to the current ID
send_button.addEventListener("click", async () => {
  let userInput = url_links.value;

  if (!currentId) {
    Swal.fire({
      title: "Error",
      text: "Please enter an ID first!",
      icon: "error",
    });
    return;
  }

  if (userInput.indexOf("http://") === 0 || userInput.indexOf("https://") === 0) {
    if (userInput.indexOf(".") > -1) {
      try {
        const docRef = doc(db, "ID's", currentId);

        // Update the document by adding the new link to the "links" array
        await updateDoc(docRef, {
          links: arrayUnion(userInput),
        });

        coming_links.innerHTML += `<a href="${userInput}" target="_blank">${userInput}</a><br>`;

        Swal.fire({
          title: "Link Added",
          text: "The link was successfully added.",
          icon: "success",
        });
      } catch (e) {
        console.error("Error adding link: ", e);
        Swal.fire({
          title: "Error",
          text: "An error occurred while adding the link.",
          icon: "error",
        });
      }
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
      links: [], 
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

async function deleteLink(documentId, linkToDelete) {
  try {
    const docRef = doc(db, "ID's", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let links = docSnap.data().links || [];

      // Remove the specific link
      links = links.filter((link) => link !== linkToDelete);

      // Update Firestore document
      await updateDoc(docRef, {
        links: links,
      });

      // Re-fetch the updated links
      await fetchLinks(documentId);

      Swal.fire({
        title: "Deleted",
        text: "The link has been removed successfully.",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("Error deleting link: ", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while deleting the link.",
      icon: "error",
    });
  }
}
