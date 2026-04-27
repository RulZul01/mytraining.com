// ================= GLOBAL ELEMENTS =================
const form = document.getElementById("contactForm");
const inputs = form ? form.querySelectorAll("input, textarea") : [];
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const scrollWrapper = document.querySelector('.card-scroll-wrapper');
const shapes = document.querySelectorAll('.floating-shape');

// ================= FORM VALIDATION =================
function checkForm() {
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        let errorMsg = "";

        // Reset styling
        input.style.borderBottomColor = "var(--border)";
        
        // Find or create error element
        let errorEl = input.parentElement.querySelector(".error-msg");
        if (!errorEl) {
            errorEl = document.createElement("div");
            errorEl.className = "error-msg";
            errorEl.style.cssText = "color: red; font-size: 0.75rem; margin-top: 5px; height: 15px;";
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = "";

        // Required check
        if (value === "") {
            isValid = false;
        }

        // Email validation
        if (input.type === "email" && value !== "") {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!emailValid) {
                isValid = false;
                errorMsg = "Invalid email format.";
            }
        }

        // Contact Number (60xxxxxxxx)
        if (input.id === "contactNo" && value !== "") {
            const phonePattern = /^60\d{9,10}$/; 
            if (!phonePattern.test(value)) {
                isValid = false;
                errorMsg = "Use format: 601137525269";
            }
        }

        // Apply error styles
        if (errorMsg) {
            input.style.borderBottomColor = "red";
            errorEl.textContent = errorMsg;
        }
    });

    if (submitBtn) submitBtn.disabled = !isValid;
}

// Attach listeners to form inputs
if (form) {
    inputs.forEach(input => input.addEventListener("input", checkForm));

    // ================= FORM SUBMIT (SweetAlert2) =================
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (submitBtn.disabled) return;

    Swal.fire({
        title: 'Message Sent!',
        text: 'Thank you! We will get in touch with you soon.',
        icon: 'success',
        iconColor: '#3b8cc4',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#0e2a47',
        allowOutsideClick: true, // Allows clicking away to close
        allowEscapeKey: true,
    }).then((result) => {
        /* This code runs AFTER the user clicks "Great!" */
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop) {
            form.reset();
            if (submitBtn) submitBtn.disabled = true;
            
            // This forces the floating labels to reset correctly
            inputs.forEach(input => {
                input.blur();
                const errorEl = input.parentElement.querySelector(".error-msg");
                if (errorEl) errorEl.textContent = "";
                input.style.borderBottomColor = "var(--border)";
            });
        }
    });
});

    // ================= FORM CLEAR =================
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            form.reset();
            if (submitBtn) submitBtn.disabled = true;
            inputs.forEach(input => {
                input.blur();
                const errorEl = input.parentElement.querySelector(".error-msg");
                if (errorEl) errorEl.textContent = "";
                input.style.borderBottomColor = "var(--border)";
            });
        });
    }
}

// ================= SMOOTH SCROLL (With Exact Offset) =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offset = 20; // Matches your sticky header height + breathing room
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ================= AUTO-SCROLL TRAININGS =================
if (scrollWrapper) {
    let isPaused = false;
    let scrollSpeed = 1; 

    function step() {
        if (!isPaused) {
            scrollWrapper.scrollLeft += scrollSpeed;
            if (scrollWrapper.scrollLeft >= (scrollWrapper.scrollWidth - scrollWrapper.offsetWidth - 1)) {
                scrollWrapper.scrollLeft = 0;
            }
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    scrollWrapper.addEventListener('mouseenter', () => isPaused = true);
    scrollWrapper.addEventListener('mouseleave', () => isPaused = false);
    scrollWrapper.addEventListener('touchstart', () => isPaused = true, {passive: true});
    scrollWrapper.addEventListener('touchend', () => isPaused = false, {passive: true});
    scrollWrapper.addEventListener('mousedown', () => isPaused = true);
}

// ================= FLOATING SHAPES PARALLAX =================
if (shapes.length > 0) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05); 
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}