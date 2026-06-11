function renderList(items) {
  return `<ul class="detail-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderChips(items, mapper = value => value) {
  return `<div class="tags">${items.map(item => `<span class="tag">${escapeHtml(mapper(item))}</span>`).join("")}</div>`;
}

function renderGrants(grants) {
  return `<ul class="grant-list">
    ${grants.map(grant => `
      <li>
        <strong>${escapeHtml(grant.name)}</strong>
        <span>${escapeHtml([grant.year, grant.amount, grant.status].filter(Boolean).join(" - "))}</span>
      </li>
    `).join("")}
  </ul>`;
}

function renderProfile() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const org = organizations.find(item => item.id === id);
  const mount = document.getElementById("profileMount");

  if (!org) {
    mount.innerHTML = `
      <section class="intro">
        <div>
          <p class="eyebrow">Organization Profile</p>
          <h1>Profile not found</h1>
          <p>Select an organization from the directory to view its profile.</p>
        </div>
      </section>
      <div class="empty-state">
        <p><a href="directory.html">Return to the service provider directory</a></p>
      </div>
    `;
    return;
  }

  const profile = profileForOrganization(org);
  document.title = `${org.name} - ConnectCare Ontario`;

  mount.innerHTML = `
    <section class="profile-hero">
      <div>
        <a href="directory.html" class="back-link">Back to directory</a>
        <p class="eyebrow">Organization Profile</p>
        <h1>${escapeHtml(org.name)}</h1>
        <p>${escapeHtml(org.description)}</p>
        <div class="tags">
          <span class="capacity ${getCapacityClass(org.capacity)}">${org.capacity}</span>
          <span class="tag">${formatCity(org.city)}</span>
          ${org.urgency ? '<span class="tag urgent-tag">Urgent referrals</span>' : ""}
        </div>
      </div>
      <aside class="profile-contact">
        <h2>Contact</h2>
        <p><strong>${escapeHtml(profile.contactName)}</strong></p>
        <p>${escapeHtml(org.phone)}</p>
        <p>${escapeHtml(profile.email)}</p>
        <p>${escapeHtml(org.address)}</p>
      </aside>
    </section>

    <section class="profile-summary">
      <div>
        <span>Service Area</span>
        <strong>${profile.serviceArea.map(escapeHtml).join(", ")}</strong>
      </div>
      <div>
        <span>Core Services</span>
        <strong>${org.services.slice(0, 3).map(getServiceName).join(", ")}</strong>
      </div>
      <div>
        <span>Known Partners</span>
        <strong>${profile.partnerships.length}</strong>
      </div>
      <div>
        <span>Projects</span>
        <strong>${profile.currentProjects.length}</strong>
      </div>
    </section>

    <div class="profile-grid">
      <section class="detail-panel">
        <h2>Services</h2>
        ${renderChips(org.services, getServiceName)}
      </section>

      <section class="detail-panel">
        <h2>Population Served</h2>
        ${renderList(profile.populationServed)}
      </section>

      <section class="detail-panel">
        <h2>Referral Requirements</h2>
        ${renderList(profile.referralRequirements)}
      </section>

      <section class="detail-panel">
        <h2>Partnerships</h2>
        ${renderList(profile.partnerships)}
      </section>

      <section class="detail-panel">
        <h2>Grants Received</h2>
        ${renderGrants(profile.grantsReceived)}
      </section>

      <section class="detail-panel">
        <h2>Grants Applied For</h2>
        ${renderGrants(profile.grantsApplied)}
      </section>

      <section class="detail-panel">
        <h2>Current Projects</h2>
        ${renderList(profile.currentProjects)}
      </section>

      <section class="detail-panel">
        <h2>Collaboration Needs</h2>
        ${renderChips(profile.collaborationNeeds, getServiceName)}
        <a class="button-link full-width-link" href="partnerships.html?org=${org.id}">Find matching partners</a>
      </section>
    </div>
  `;
}

renderProfile();
