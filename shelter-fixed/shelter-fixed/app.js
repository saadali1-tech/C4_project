function getFormValues() {
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const city = document.getElementById("city").value;
  const urgency = document.getElementById("urgency").value;

  const services = Array.from(document.querySelectorAll("#services input:checked")).map(el => el.value);
  const special = Array.from(document.querySelectorAll("#special input:checked")).map(el => el.value);

  return { age, gender, city, urgency, services, special };
}

function scoreOrg(org, criteria) {
  let score = 0;
  let reasons = [];

  if (criteria.age && org.ageGroups.includes(criteria.age)) {
    score += 3;
    reasons.push("Serves this age group");
  } else if (criteria.age && !org.ageGroups.includes(criteria.age)) {
    return null;
  }

  if (criteria.gender) {
    if (org.genders.includes(criteria.gender)) {
      score += 2;
      reasons.push("Matches gender");
    } else if (org.genders.length < 3) {
      return null;
    }
  }

  if (criteria.city && org.city !== criteria.city) {
    return null;
  }

  criteria.services.forEach(service => {
    if (org.services.includes(service)) {
      score += 2;
      reasons.push(`Offers: ${getServiceName(service)}`);
    }
  });

  criteria.special.forEach(item => {
    if (org.special.includes(item)) {
      score += 3;
      reasons.push(`Matches: ${getSpecialName(item)}`);
    }
  });

  if (criteria.urgency === "urgent" && org.urgency) {
    score += 2;
    reasons.push("Accepts urgent referrals");
  }

  if (org.capacity === "Available") score += 1;

  reasons = [...new Set(reasons)];

  return { org, score, reasons };
}

function renderCard(item) {
  const { org, reasons } = item;
  const tags = org.tags.slice(0, 5).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const reasonList = reasons.slice(0, 4).map(r => `<li>${escapeHtml(r)}</li>`).join("");
  const websiteLink = org.website && org.website !== "#"
    ? `<a href="${org.website}" target="_blank" rel="noopener">Website</a>`
    : "";

  return `
    <div class="card">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(org.name)}</h3>
          <div class="card-city">${formatCity(org.city)} &middot; ${escapeHtml(org.address)}</div>
        </div>
        <span class="capacity ${getCapacityClass(org.capacity)}">${org.capacity}</span>
      </div>
      <p class="card-desc">${escapeHtml(org.description)}</p>
      <div class="tags">${tags}</div>
      ${reasons.length > 0 ? `<ul class="reasons">${reasonList}</ul>` : ""}
      <div class="card-actions">
        <span class="phone">${escapeHtml(org.phone)}</span>
        <a href="profile.html?id=${org.id}">View profile</a>
        ${websiteLink}
      </div>
    </div>
  `;
}

function runSearch() {
  const criteria = getFormValues();
  const noFilters = !criteria.age && !criteria.gender && !criteria.city
    && criteria.services.length === 0 && criteria.special.length === 0 && !criteria.urgency;

  let results;
  if (noFilters) {
    results = organizations.map(org => ({ org, score: 0, reasons: [] }));
  } else {
    results = organizations
      .map(org => scoreOrg(org, criteria))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  window._lastResults = results;
  renderResults(results, "");

  document.getElementById("resultsHeader").classList.remove("hidden");
  document.getElementById("matchCount").textContent = `${results.length} matching organization${results.length !== 1 ? "s" : ""} found`;
}

function renderResults(results, keyword) {
  const container = document.getElementById("resultsContainer");
  let filtered = results;

  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    filtered = results.filter(item =>
      item.org.name.toLowerCase().includes(kw) ||
      item.org.description.toLowerCase().includes(kw) ||
      item.org.tags.some(t => t.toLowerCase().includes(kw)) ||
      item.org.city.toLowerCase().includes(kw)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No matching organizations found. Try adjusting the filters.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(renderCard).join("");
}

document.getElementById("searchBtn").addEventListener("click", runSearch);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("intakeForm").reset();
  document.getElementById("resultsContainer").innerHTML = `<div class="empty-state"><p>Fill in the form and click <strong>Find Matching Services</strong> to see results.</p></div>`;
  document.getElementById("resultsHeader").classList.add("hidden");
  window._lastResults = null;
});

document.getElementById("keyword").addEventListener("input", event => {
  if (window._lastResults) {
    renderResults(window._lastResults, event.target.value);
  }
});
