// ── ConnectCare Ontario – Auth ──────────────────────────────────────────────
// Users stored in localStorage (persists across sessions).
// Session stored in sessionStorage (clears on tab close).
const AUTH_USERS_KEY = "cco_users";
const AUTH_SESSION_KEY = "cco_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(u) { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(u)); }

function currentUser() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || "null"); }
  catch { return null; }
}

function signUp(orgName, email, password) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: "An account with that email already exists." };
  const user = { id: "u_" + Date.now(), orgName, email, password, joinedDate: new Date().toLocaleDateString("en-CA") };
  users.push(user);
  saveUsers(users);
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

function signIn(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: "Incorrect email or password." };
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

function signOut() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  updateAuthNav();
  // Close modal if open
  const m = document.getElementById("authModal");
  if (m) m.classList.add("hidden");
}

// ── Auth modal ──────────────────────────────────────────────────────────────
function openAuthModal(tab) {
  const m = document.getElementById("authModal");
  if (!m) return;
  m.classList.remove("hidden");
  // Clear all inputs and errors when opening fresh
  ["siEmail","siPassword","suOrg","suEmail","suPassword"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  const errEl = document.getElementById("authError");
  if (errEl) errEl.textContent = "";
  showAuthTab(tab || "signin");
}

function showAuthTab(tab) {
  document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.getElementById("authSignIn").classList.toggle("hidden", tab !== "signin");
  document.getElementById("authSignUp").classList.toggle("hidden", tab !== "signup");
  document.getElementById("authError").textContent = "";
  // Clear inputs on tab switch to prevent visual bleed
  if (tab === "signin") {
    ["siEmail","siPassword"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  } else {
    ["suOrg","suEmail","suPassword"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  }
}

function closeAuthModal() {
  const m = document.getElementById("authModal");
  if (m) m.classList.add("hidden");
}

// Inject the modal HTML once into the body
function injectAuthModal() {
  if (document.getElementById("authModal")) return;
  const modal = document.createElement("div");
  modal.id = "authModal";
  modal.className = "auth-modal hidden";
  modal.innerHTML = `
    <div class="auth-modal-backdrop" onclick="closeAuthModal()"></div>
    <div class="auth-modal-card">
      <button class="auth-modal-close" onclick="closeAuthModal()" aria-label="Close">&times;</button>
      <div class="auth-tabs">
        <button class="auth-tab-btn active" data-tab="signin" onclick="showAuthTab('signin')">Sign In</button>
        <button class="auth-tab-btn" data-tab="signup" onclick="showAuthTab('signup')">Create Account</button>
      </div>
      <div id="authError" class="form-error" style="margin-bottom:8px;"></div>

      <div id="authSignIn">
        <div class="field-group">
          <label for="siEmail">Email</label>
          <input type="email" id="siEmail" placeholder="you@organization.ca" autocomplete="email" />
        </div>
        <div class="field-group">
          <label for="siPassword">Password</label>
          <input type="password" id="siPassword" autocomplete="current-password" />
        </div>
        <button class="auth-submit-btn" onclick="handleSignIn()">Sign In</button>
      </div>

      <div id="authSignUp" class="hidden">
        <div class="field-group">
          <label for="suOrg">Organization name <span class="required">*</span></label>
          <input type="text" id="suOrg" placeholder="e.g. Youth Services Bureau" />
        </div>
        <div class="field-group">
          <label for="suEmail">Email <span class="required">*</span></label>
          <input type="email" id="suEmail" placeholder="you@organization.ca" autocomplete="email" />
        </div>
        <div class="field-group">
          <label for="suPassword">Password <span class="required">*</span></label>
          <input type="password" id="suPassword" autocomplete="new-password" />
        </div>
        <button class="auth-submit-btn" onclick="handleSignUp()">Create Account</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Allow enter key in sign-in fields
  document.getElementById("siPassword").addEventListener("keydown", e => { if (e.key === "Enter") handleSignIn(); });
  document.getElementById("suPassword").addEventListener("keydown", e => { if (e.key === "Enter") handleSignUp(); });
}

function handleSignIn() {
  const email = document.getElementById("siEmail").value.trim();
  const pw    = document.getElementById("siPassword").value;
  const err   = document.getElementById("authError");
  if (!email || !pw) { err.textContent = "Please enter your email and password."; return; }
  const res = signIn(email, pw);
  if (!res.ok) { err.textContent = res.error; return; }
  closeAuthModal();
  updateAuthNav();
}

function handleSignUp() {
  const orgName = document.getElementById("suOrg").value.trim();
  const email   = document.getElementById("suEmail").value.trim();
  const pw      = document.getElementById("suPassword").value;
  const err     = document.getElementById("authError");
  if (!orgName || !email || !pw) { err.textContent = "Please fill in all fields."; return; }
  const res = signUp(orgName, email, pw);
  if (!res.ok) { err.textContent = res.error; return; }
  closeAuthModal();
  updateAuthNav();
  // Redirect to post listing
  window.location.href = "post-listing.html";
}

// ── Nav injection ──────────────────────────────────────────────────────────
function updateAuthNav() {
  const user = currentUser();
  const nav  = document.querySelector("header nav");
  if (!nav) return;
  nav.querySelectorAll(".auth-nav-item").forEach(el => el.remove());

  if (user) {
    const nameLink = Object.assign(document.createElement("a"), {
      href: "post-listing.html", className: "auth-nav-item auth-name", textContent: user.orgName
    });
    const outLink = Object.assign(document.createElement("a"), {
      href: "#", className: "auth-nav-item auth-signout", textContent: "Sign out"
    });
    outLink.addEventListener("click", e => { e.preventDefault(); signOut(); });
    nav.appendChild(nameLink);
    nav.appendChild(outLink);
  } else {
    const inLink = Object.assign(document.createElement("a"), {
      href: "#", className: "auth-nav-item auth-signin-btn", textContent: "Sign in / Register"
    });
    inLink.addEventListener("click", e => { e.preventDefault(); openAuthModal("signin"); });
    nav.appendChild(inLink);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectAuthModal();
  updateAuthNav();
});
