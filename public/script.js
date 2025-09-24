document.addEventListener("DOMContentLoaded", () => {
  /* Dark Mode Switch*/
  let darkmode = localStorage.getItem("darkmode");
  const modeSwitch = document.querySelector(".switch-mode");

  const enableDarkmode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  };

  const disableDarkmode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
  };

  if (darkmode === "active") enableDarkmode();

  if (modeSwitch) {
    modeSwitch.addEventListener("click", () => {
      darkmode = localStorage.getItem("darkmode");
      darkmode !== "active" ? enableDarkmode() : disableDarkmode();
    });
  }

  /*Mobile Menu*/
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") == "true";
      hamburger.setAttribute("aria-expanded", !expanded);
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  /* Edit feature*/
  document.querySelectorAll(".toggle-edit").forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const target = document.getElementById(targetId);

    if (!target) return;
    const saved = localStorage.getItem(targetId);
    if (saved !== null) {
      target.innerHTML = saved;
    }

    let originalText = "";

    btn.addEventListener("click", () => {
      if (btn.textContent === "Edit") {
        originalText = target.textContent.trim();
        target.contentEditable = "true";
        target.focus();
        btn.textContent = "Save";

        target.addEventListener("blur", function handleBlur() {
          if (
            btn.textContent === "Save" &&
            target.textContent.trim() === originalText
          ) {
            target.contentEditable = "false";
            btn.textContent = "Edit";
          }
          target.removeEventListener("blur", handleBlur);
        });
      } else {
        target.contentEditable = "false";
        const newText = target.textContent.trim();

        if (newText !== originalText) {
          localStorage.setItem(targetId, newText);
        }
        btn.textContent = "Edit";
      }
    });
  });

  /*Modal */
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");

  if (modal && modalImg && modalClose) {
    document.querySelectorAll("[data-img]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const imgSrc = btn.getAttribute("data-img");
        if (!imgSrc) return;

        modalImg.src = imgSrc;
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
      modalImg.src = "";
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  }

  /* Profile Image Upload */
  const profileInput = document.getElementById("profile-file-input");
  const profileImg = document.getElementById("profile-image");

  if (profileInput && profileImg) {
    profileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await fetch("/upload/profile", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          profileImg.src = result.imagePath;
        } else {
          console.error("Profile upload failed:", result);
        }
      } catch (err) {
        console.error("Profile upload error:", err);
      }
    });
  }

  /*Project Image Uploads*/
  document.querySelectorAll(".project-file-input").forEach((input) => {
    const card = input.closest(".card");
    const projectImg = card?.querySelector(".project-img");
    const viewBtn = card?.querySelector("[data-img]");
    const projectId = input.dataset.project;

    if (!projectId || !projectImg) return;

    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("projectImage", file);

      try {
        const response = await fetch(`/upload/project/${projectId}`, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          projectImg.src = result.imagePath;
          if (viewBtn) {
            viewBtn.setAttribute("data-img", result.imagePath);
          }
        } else {
          console.error(`Project ${projectId} upload failed:`, result);
        }
      } catch (err) {
        console.error(`Project ${projectId} upload error:`, err);
      }
    });
  });
});
