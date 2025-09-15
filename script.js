/*Switch Mode*/
let darkmode = localStorage.getItem("darkmode")
const modeSwitch = document.querySelector(".switch-mode")

const enableDarkmode = () => {
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "active")
};

const disableDarkmode = () => {
    document.body.classList.remove("darkmode")
    localStorage.setItem("darkmode", null)
};

if(darkmode === "active") enableDarkmode()

modeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode")
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
});

/*Menu*/
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") == "true";
    hamburger.setAttribute("aria-expanded", !expanded);
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});


/*Edit*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-edit").forEach(btn =>{
    const targetId = btn.getAttribute("data-target") ;
    const target = document.getElementById( targetId);

    if (!target) return;
    const saved = localStorage.getItem( targetId);
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
          if (btn.textContent === "Save" && target.textContent.trim() === originalText) {
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
});

/*Modal*/
document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");

  if (!modal || !modalImg || !modalClose) return;

  document.querySelectorAll('[data-img]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const imgSrc = btn.getAttribute('data-img');
      if (!imgSrc) return;

      modalImg.src = imgSrc;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImg.src = '';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});
