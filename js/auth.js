// Check if we are on the profile page
if (window.location.pathname.includes("profile.html")) {
  const session = localStorage.getItem("currentUser");
  
  // If no one is logged in, kick them back to the login page
  if (!session) {
    window.location.href = "auth.html";
  }
}

// ================= ELEMENTS =================
const authForm = document.getElementById("authForm");
const toggle = document.getElementById("toggleAuth");
const title = document.getElementById("authTitle");
const roleGroup = document.getElementById("roleGroup");

const nameInput = document.getElementById("name");
const nameLabel = document.getElementById("nameLabel");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");

let isSignup = false;

// ================= TOGGLE LOGIN / SIGNUP =================
if (toggle) {
  toggle.addEventListener("click", () => {
    isSignup = !isSignup;
    if (isSignup) {
      title.textContent = "Sign Up";
      toggle.textContent = "Login";
      roleGroup.style.display = "block";
      nameInput.style.display = "block";
      nameLabel.style.display = "block"; 
    } else {
      title.textContent = "Login";
      toggle.textContent = "Sign up";
      roleGroup.style.display = "none";
      nameInput.style.display = "none";
      nameLabel.style.display = "none"; 
    }
  });
}

// ================= FORM SUBMIT (ARRAY VERSION) =================
if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Get the list of all users, or an empty list if none exist yet
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      // Check if email already exists
      const exists = users.find(u => u.email === emailInput.value);
      if (exists) {
        alert("This email is already registered!");
        return;
      }

      // 2. Create the new user
      const newUser = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        role: roleInput.value,
        profilePic: "images/profile_pic/amirul-1-1.jpg"
      };

      // 3. Add to the list and save back to localStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Save THIS specific user as the "logged in" person
      localStorage.setItem("currentUser", JSON.stringify(newUser));

    } else {
      // LOGIN LOGIC
      // 4. Look for the user in our list
      const foundUser = users.find(u => 
        u.email === emailInput.value && u.password === passwordInput.value
      );

      if (!foundUser) {
        alert("Invalid login credentials");
        return;
      }

      // 5. Save the found user as the "logged in" person
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
    }

    window.location.href = "profile.html";
  });
}

// ================= PROFILE DISPLAY =================
const user = JSON.parse(localStorage.getItem("currentUser"));
const profilePicEl = document.getElementById("profilePic");
const userNameEl = document.getElementById("userName");

if (userNameEl && user) {
  // Set the Name (will now be white thanks to the CSS)
  userNameEl.textContent = user.name;
  
  const roleEl = document.getElementById("userRole");
  if (roleEl) {
    // Clean up the display name for the badge
    if (user.role === "tp") {
      roleEl.textContent = "Training Provider";
    } else {
      roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
  }
  
  if (profilePicEl) {
    console.log("Loading profile pic:", user.profilePic);
    profilePicEl.src = user.profilePic; 

    profilePicEl.onerror = function() {
      console.error("Image not found at path. Using fallback.");
      this.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=3b8cc4&color=fff";
    };
  }
} else if (userNameEl && !user) {
    // Redirect if trying to access profile without data
    window.location.href = "auth.html";
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // We only remove the CURRENT session, 
    // we DON'T clear "users" (otherwise everyone's accounts are deleted!)
    localStorage.removeItem("currentUser");
    
    // Redirect to the auth page
    window.location.href = "auth.html";
  });
}

// ================= ROLE-BASED CONTENT =================
const dynamicContent = document.getElementById("dynamicContent");

if (user && dynamicContent) {
  let contentHtml = "";

  if (user.role === "trainer") {
    contentHtml = `
      <div class="dash-card">
        <div class="dash-card-icon">📚</div>
        <div class="dash-card-info">
          <h4>My Courses</h4>
          <p>React Basics, UI/UX Design</p>
        </div>
      </div>
      <div class="dash-card">
        <div class="dash-card-icon">📅</div>
        <div class="dash-card-info">
          <h4>Upcoming Sessions</h4>
          <p>Next: Monday 10:00 AM</p>
        </div>
      </div>`;
  } else if (user.role === "tp") {
    // We keep the condition as "tp" but change the labels to Training Provider
    contentHtml = `
      <div class="dash-card">
        <div class="dash-card-icon">🏢</div>
        <div class="dash-card-info">
          <h4>Training Provider Portal</h4>
          <p>Manage your company profile and trainers.</p>
        </div>
      </div>
      <div class="dash-card">
        <div class="dash-card-icon">💰</div>
        <div class="dash-card-info">
          <h4>HRDC Claims</h4>
          <p>3 Claims Pending Approval</p>
        </div>
      </div>`;
  } else {
    contentHtml = `
      <div class="dash-card">
        <div class="dash-card-icon">🎓</div>
        <div class="dash-card-info">
          <h4>My Learning</h4>
          <p>Enrolled in 2 courses</p>
        </div>
      </div>
      <div class="dash-card">
        <div class="dash-card-icon">🏆</div>
        <div class="dash-card-info">
          <h4>Certificates</h4>
          <p>View your achievements</p>
        </div>
      </div>`;
  }

  dynamicContent.innerHTML = contentHtml;
}