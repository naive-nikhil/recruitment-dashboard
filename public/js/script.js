const formModal = document.getElementById("formModal");
const formContent = document.querySelector(".modal-content");

function openForm(templateId) {
  const template = document.getElementById(templateId);

  if (!template) {
    console.error(`Template with id "${templateId}" not found.`);
    return;
  }

  formContent.innerHTML = "";

  formContent.appendChild(template.content.cloneNode(true));

  formModal.style.display = "flex";

  setTimeout(() => {
    formModal.classList.add("show");
  }, 10);


  const dynamicCloseButton = formContent.querySelector("#closeFormButton");
  if (dynamicCloseButton) {
    dynamicCloseButton.addEventListener("click", closeForm);
  }
}


function closeForm() {
  formModal.classList.remove("show");
  setTimeout(() => {
    formModal.style.display = "none";
  }, 100);
}
