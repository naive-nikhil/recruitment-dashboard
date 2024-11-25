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

  const dynamicCloseButton = formContent.querySelector("#closeFormButton");
  if (dynamicCloseButton) {
    dynamicCloseButton.addEventListener("click", closeForm);
  }
}

function closeForm() {
  formModal.style.display = "none";
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const flash = document.getElementById("flash");
  if (flash) {
    setTimeout(() => {
      flash.remove();
    }, 10000);
  }
});
