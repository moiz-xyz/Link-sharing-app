const nameField = document.getElementById("name");
const idField = document.getElementById("id");
const emailField = document.getElementById("email");

let currentId = "";
let btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    currentId = idField.value;
// console.log(currentId);
    nameField.value = "";
    idField.value = "";
    emailField.value = "";
});

export function getIdFieldValue() {
    return currentId;
}
