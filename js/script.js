const form = document.getElementById("contactForm");
const inputs = form.querySelectorAll("input");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

// ======= SUCCESS MESSAGE =======
const successMessage = document.createElement("div");
successMessage.id = "successMessage";
successMessage.className = "success-message";
successMessage.innerHTML = "<p>Thank you! We will get in touch with you soon.</p>";
document.body.appendChild(successMessage);

// ================= FORM VALIDATION =================
function checkForm() {
  let isValid = true;

  inputs.forEach(input => {
    const value = input.value.trim();
    let errorMsg = "";

    // reset previous error
    let errorEl = input.parentElement.querySelector(".error-msg");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "error-msg";
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = "";

    // empty check
    if (value === "") {
      isValid = false;
    }

    // email validation
    if (input.type === "email") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailValid) {
        isValid = false;
        errorMsg = "Please enter a valid email address.";
      }
    }

    // contact number validation (with country code)
if (input.id === "contactNo") {
  // must start with country code 60 and 11–12 digits total
  const phonePattern = /^60\d{9,10}$/; 
  if (!phonePattern.test(value)) {
    isValid = false;
    errorMsg = "Please enter in format: 601137525269";
  }
}

    // apply error style if any
    if (errorMsg) {
      input.style.borderColor = "red";
      errorEl.textContent = errorMsg;
    } else {
      input.style.borderColor = "var(--border)";
      errorEl.textContent = "";
    }
  });

  submitBtn.disabled = !isValid;
}

// run on input
inputs.forEach(input => input.addEventListener("input", checkForm));

// ================= FORM CLEAR =================
clearBtn.addEventListener("click", () => {
  form.reset();
  submitBtn.disabled = true;

  inputs.forEach(input => input.blur()); // reset label state
});

// ================= FORM SUBMIT =================
form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent actual page reload

  // check again if valid
  checkForm();
  if (submitBtn.disabled) return; // don't show message if invalid

  // show success message
  successMessage.classList.add("show");

  // hide after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 3000);

  // reset form
  form.reset();
  submitBtn.disabled = true;

  inputs.forEach(input => input.blur());
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);

    const offset = 80; // header height
    const top = target.offsetTop - offset;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
});

// click outside to close modal
successMessage.addEventListener("click", (e) => {
  if (e.target === successMessage) { // only if clicked on overlay
    successMessage.classList.remove("show");
  }
});

// ================= FLOATING SHAPES PARALLAX =================
const shapes = document.querySelectorAll('.floating-shape');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  shapes.forEach((shape, index) => {
    // Each shape moves at a slightly different speed
    const speed = 0.2 + index * 0.05; 
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
});