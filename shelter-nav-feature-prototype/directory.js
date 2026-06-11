function renderAll(list) {
  const container = document.getElementById("directoryContainer");
  const count = document.getElementById("directoryCount");

  count.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No organizations match your search.</p></div>';
    return;
  }

  container.innerHTML = list.map(org => {
    const profile = profileForOrganization(org);
    const tags = org.tags.slice(0, 5).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    const services = org.services.slice(0, 4).map(getServiceName).join(", ");
    const populations = profile.populationServed.slice(0, 2).join(", ");
    const websiteLink = org.website && org.website !== "#"
      ? `<a href="${org.website}" target="_blank" rel="noopener">Website</a>`
      : "";

    return `
      <div class="card directory-card">
        <div class="card-top">
          <div>
            <h3>${escapeHtml(org.name)}</h3>
            <div class="card-city">${formatCity(org.city)} &middot; ${escapeHtml(org.address)}</div>
          </div>
          <span class="capacity ${getCapacityClass(org.capacity)}">${org.capacity}</span>
        </div>
        <p class="card-desc">${escapeHtml(org.description)}</p>
        <dl class="mini-profile">
          <div>
            <dt>Services</dt>
            <dd>${escapeHtml(services)}</dd>
          </div>
          <div>
            <dt>Population</dt>
            <dd>${escapeHtml(populations)}</dd>
          </div>
          <div>
            <dt>Referral</dt>
            <dd>${escapeHtml(profile.referralRequirements[0])}</dd>
          </div>
        </dl>
        <div class="tags">${tags}</div>
        <div class="card-actions">
          <a class="button-link" href="profile.html?id=${org.id}">View profile</a>
          ${websiteLink}
        </div>
      </div>
    `;
  }).join("");
}

function applyFilters() {
  const keyword = document.getElementById("dirSearch").value.trim().toLowerCase();
  const city = document.getElementById("dirCityFilter").value;
  const service = document.getElementById("dirServiceFilter").value;

  let filtered = organizations;

  if (city) filtered = filtered.filter(org => org.city === city);
  if (service) filtered = filtered.filter(org => org.services.includes(service));
  if (keyword) {
    filtered = filtered.filter(org => {
      const profile = profileForOrganization(org);
      const haystack = [
        org.name,
        org.description,
        org.city,
        org.address,
        ...org.tags,
        ...org.services.map(getServiceName),
        ...profile.populationServed,
        ...profile.referralRequirements,
        ...profile.currentProjects
      ].join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
  }

  renderAll(filtered);
}

document.getElementById("directoryTotal").textContent = organizations.length;
document.getElementById("dirSearch").addEventListener("input", applyFilters);
document.getElementById("dirCityFilter").addEventListener("change", applyFilters);
document.getElementById("dirServiceFilter").addEventListener("change", applyFilters);

renderAll(organizations);
