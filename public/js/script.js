const formModal = document.getElementById("formModal");
const formContent = document.querySelector(".modal-content");

// Function to dynamically load jobs
function loadJobs(companyId) {
  const sectionTwo = document.querySelector(".section-two");
  fetch(`/companies/${companyId}/jobs`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load jobs");
      return response.text();
    })
    .then((html) => {
      sectionTwo.innerHTML = html;
      applicationsFunctionality(sectionTwo); // Reinitialize applications functionality
    })
    .catch((error) => console.error("Error fetching jobs:", error));
}

// Load companies and setup event listeners
function loadCompanyJobs() {
  const companiesList = document.querySelector(".data-list");
  const firstCompanyElement = companiesList.querySelector(".company");

  if (firstCompanyElement) {
    loadJobs(firstCompanyElement.dataset.companyId);
  }

  companiesList.addEventListener("click", function (event) {
    const companyElement = event.target.closest(".company");
    if (companyElement && !event.target.closest(".job-option")) {
      loadJobs(companyElement.dataset.companyId);
    }
  });
}

// Functionality for applications
function applicationsFunctionality(parent = document) {
  parent.querySelectorAll(".view-applications-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const companyId = this.dataset.companyId;
      const jobId = this.dataset.jobId;

      fetch(`/companies/${companyId}/jobs/${jobId}/applications`)
        .then((response) => response.text())
        .then((html) => {
          formContent.innerHTML = html;
          formModal.style.display = "flex";
          const closeButton = document.querySelector("#closeFormButton");
          if (closeButton) {
            closeButton.addEventListener("click", () => {
              formModal.style.display = "none";
            });
          }
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const flash = document.getElementById("flash");
  if (flash) {
    setTimeout(() => flash.remove(), 10000);
  }

  fetch("/companies")
    .then((response) => response.text())
    .then((html) => {
      const companiesList = document.querySelector(".section-one");
      companiesList.innerHTML = html;
      loadCompanyJobs();
    });
});

// Form handlers
function addCompanyForm() {
  fetch("/companies/add")
    .then((response) => response.text())
    .then((html) => {
      formContent.innerHTML = html;
      formModal.style.display = "flex";
      document
        .querySelector("#closeFormButton")
        .addEventListener("click", () => {
          formModal.style.display = "none";
        });
    });
}

function addJobsForm(companyId) {
  fetch(`/companies/${companyId}/jobs/add`)
    .then((response) => response.text())
    .then((html) => {
      formContent.innerHTML = html;
      formModal.style.display = "flex";
      document
        .querySelector("#closeFormButton")
        .addEventListener("click", () => {
          formModal.style.display = "none";
        });
    });
}

function viewJDForm(companyId, jobId) {
  fetch(`/companies/${companyId}/jobs/${jobId}/viewJD`)
    .then((response) => response.text())
    .then((html) => {
      formContent.innerHTML = html;
      formModal.style.display = "flex";
      document
        .querySelector("#closeFormButton")
        .addEventListener("click", () => {
          formModal.style.display = "none";
        });
    });
}

function addApplicationForm(companyId, jobId) {
  fetch(`/companies/${companyId}/jobs/${jobId}/applications/add`)
    .then((response) => response.text())
    .then((html) => {
      formContent.innerHTML = html;
      formModal.style.display = "flex";
      document
        .querySelector("#closeFormButton")
        .addEventListener("click", () => {
          formModal.style.display = "none";
        });
    });
}
