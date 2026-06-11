function intersection(left, right) {
  return left.filter(item => right.includes(item));
}

function unique(values) {
  return [...new Set(values)];
}

function scorePartner(myOrg, partner, goal) {
  const myProfile = profileForOrganization(myOrg);
  const partnerProfile = profileForOrganization(partner);
  const sharedServices = intersection(myOrg.services, partner.services);
  const complementaryNeeds = intersection(myProfile.collaborationNeeds, partner.services);
  const partnerNeedsMet = intersection(partnerProfile.collaborationNeeds, myOrg.services);
  const sharedFocus = intersection(myOrg.special, partner.special);

  let score = 0;
  const reasons = [];

  if (myOrg.city === partner.city) {
    score += 4;
    reasons.push(`Same region: ${formatCity(partner.city)}`);
  }

  if (goal && partner.services.includes(goal)) {
    score += myOrg.services.includes(goal) ? 2 : 5;
    reasons.push(`Strong fit for ${getServiceName(goal)}`);
  }

  if (complementaryNeeds.length) {
    score += complementaryNeeds.length * 3;
    reasons.push(`Offers what your organization is seeking: ${complementaryNeeds.map(getServiceName).join(", ")}`);
  }

  if (partnerNeedsMet.length) {
    score += partnerNeedsMet.length * 2;
    reasons.push(`They are seeking your strengths: ${partnerNeedsMet.map(getServiceName).join(", ")}`);
  }

  if (sharedServices.length) {
    score += Math.min(sharedServices.length, 3);
    reasons.push(`Shared service focus: ${sharedServices.slice(0, 3).map(getServiceName).join(", ")}`);
  }

  if (sharedFocus.length) {
    score += sharedFocus.length * 2;
    reasons.push(`Shared population lens: ${sharedFocus.map(getSpecialName).join(", ")}`);
  }

  if (partner.capacity === "Available") {
    score += 1;
    reasons.push("Currently showing available capacity");
  }

  return {
    org: partner,
    profile: partnerProfile,
    score,
    reasons: unique(reasons).slice(0, 4)
  };
}

function populateControls() {
  const orgSelect = document.getElementById("myOrg");
  const goalSelect = document.getElementById("matchGoal");
  const params = new URLSearchParams(window.location.search);
  const selectedOrg = params.get("org") || "1";

  orgSelect.innerHTML = organizations.map(org =>
    `<option value="${org.id}" ${String(org.id) === selectedOrg ? "selected" : ""}>${escapeHtml(org.name)}</option>`
  ).join("");

  goalSelect.innerHTML = partnershipGoals.map(goal =>
    `<option value="${goal.value}">${escapeHtml(goal.label)}</option>`
  ).join("");
}

function renderPartners() {
  const myOrg = organizations.find(org => String(org.id) === document.getElementById("myOrg").value);
  const goal = document.getElementById("matchGoal").value;
  const container = document.getElementById("partnerResults");
  const count = document.getElementById("partnerCount");

  const results = organizations
    .filter(org => org.id !== myOrg.id)
    .map(org => scorePartner(myOrg, org, goal))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

  count.textContent = `${results.length} suggestions`;

  container.innerHTML = results.map(item => `
    <article class="card partner-card">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(item.org.name)}</h3>
          <div class="card-city">${formatCity(item.org.city)} &middot; Match score ${item.score}</div>
        </div>
        <span class="capacity ${getCapacityClass(item.org.capacity)}">${item.org.capacity}</span>
      </div>
      <p class="card-desc">${escapeHtml(item.org.description)}</p>
      <h4>Why this match</h4>
      <ul class="reasons">${item.reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <div class="tags">${item.profile.collaborationNeeds.map(need => `<span class="tag">${getServiceName(need)}</span>`).join("")}</div>
      <div class="card-actions">
        <a class="button-link" href="profile.html?id=${item.org.id}">View profile</a>
      </div>
    </article>
  `).join("");

  renderOpportunityBoard(myOrg);
}

function renderOpportunityBoard(myOrg) {
  const board = document.getElementById("opportunityBoard");
  const opportunities = organizations
    .filter(org => org.id !== myOrg.id)
    .slice(0, 8)
    .map(org => {
      const profile = profileForOrganization(org);
      return {
        org,
        title: profile.currentProjects[0],
        needs: profile.collaborationNeeds
      };
    });

  board.innerHTML = opportunities.map(item => `
    <article class="opportunity">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.org.name)} - ${formatCity(item.org.city)}</span>
      <div class="tags">${item.needs.slice(0, 3).map(need => `<span class="tag">${getServiceName(need)}</span>`).join("")}</div>
    </article>
  `).join("");
}

populateControls();
renderPartners();

document.getElementById("runMatchBtn").addEventListener("click", renderPartners);
document.getElementById("myOrg").addEventListener("change", renderPartners);
document.getElementById("matchGoal").addEventListener("change", renderPartners);
