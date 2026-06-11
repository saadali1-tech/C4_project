const serviceNames = {
  shelter:"Emergency shelter", housing:"Housing", food:"Food and meals",
  healthcare:"Healthcare", mental_health:"Mental health",
  employment:"Employment and training", legal:"Legal aid",
  addiction:"Addiction services", children:"Children and family services"
};
const getServiceName = k => serviceNames[k] || k;
const formatCity = c => ({ ottawa:"Ottawa", toronto:"Toronto", hamilton:"Hamilton", london:"London", kingston:"Kingston", other:"Ontario" }[c] || c || "Ontario");
const getCapacityClass = c => ({ Available:"cap-available", Limited:"cap-limited", Full:"cap-full" }[c] || "");

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function renderAll(list) {
  const container = document.getElementById("directoryContainer");
  const count     = document.getElementById("directoryCount");

  count.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No organizations match your search.</p></div>';
    return;
  }

  container.innerHTML = list.map(org => {
    // Seed orgs have profile extras; posted orgs have inline data
    let populations = [], referral = "", profileHref = "#";

    if (org._seed) {
      const profile = (typeof profileForOrganization === "function") ? profileForOrganization(
        organizations.find(o => o.id === org._id) || {}
      ) : { populationServed:[], referralRequirements:[] };
      populations = profile.populationServed.slice(0,2);
      referral = profile.referralRequirements[0] || "";
      profileHref = `profile.html?id=${org._id}`;
    } else {
      populations = (org.populationServed || []).slice(0,2);
      referral = (org.referralRequirements || [])[0] || "";
      profileHref = `posted-profile.html?uid=${org.userId}`;
    }

    const services = (org.services || []).slice(0,4).map(getServiceName).join(", ");
    const tags     = (org.services || []).slice(0,5).map(s => `<span class="tag">${escapeHtml(getServiceName(s))}</span>`).join("");
    const websiteLink = org.website && org.website !== "#"
      ? `<a href="${escapeHtml(org.website)}" target="_blank" rel="noopener">Website</a>` : "";
    const postedBadge = org._seed ? "" : `<span class="tag" style="background:#e0f2fe;color:#0369a1;font-weight:600;">Posted</span>`;

    // Additional info bits
    const bedInfo = (org.bedsAvailable != null)
      ? `<div><dt>Beds available</dt><dd>${org.bedsAvailable}${org.bedsTotal != null ? " / " + org.bedsTotal : ""}</dd></div>` : "";
    const intakeInfo = org.intakeHours
      ? `<div><dt>Intake hours</dt><dd>${escapeHtml(org.intakeHours)}</dd></div>` : "";

    return `
      <div class="card directory-card">
        <div class="card-top">
          <div>
            <h3>${escapeHtml(org.orgName || org.name)}</h3>
            <div class="card-city">${formatCity(org.city)}${org.address ? " · " + escapeHtml(org.address) : ""}</div>
          </div>
          <span class="capacity ${getCapacityClass(org.capacity)}">${org.capacity || "—"}</span>
        </div>
        <p class="card-desc">${escapeHtml(org.description)}</p>
        <dl class="mini-profile">
          <div><dt>Services</dt><dd>${escapeHtml(services)}</dd></div>
          ${populations.length ? `<div><dt>Population</dt><dd>${escapeHtml(populations.join(", "))}</dd></div>` : ""}
          ${referral ? `<div><dt>Referral</dt><dd>${escapeHtml(referral)}</dd></div>` : ""}
          ${bedInfo}${intakeInfo}
        </dl>
        <div class="tags">${tags}${postedBadge}</div>
        <div class="card-actions">
          <span class="phone">${escapeHtml(org.phone || "")}</span>
          <a class="button-link" href="${profileHref}">View profile</a>
          ${websiteLink}
        </div>
      </div>
    `;
  }).join("");
}

function applyFilters() {
  const keyword = document.getElementById("dirSearch").value.trim().toLowerCase();
  const city    = document.getElementById("dirCityFilter").value;
  const service = document.getElementById("dirServiceFilter").value;

  let filtered = getAllListings();

  if (city)    filtered = filtered.filter(o => o.city === city);
  if (service) filtered = filtered.filter(o => (o.services || []).includes(service));
  if (keyword) {
    filtered = filtered.filter(o => {
      const haystack = [
        o.orgName, o.name, o.description, o.city, o.address,
        ...(o.services || []).map(getServiceName),
        ...(o.tags || []),
        ...(o.populationServed || []),
        ...(o.referralRequirements || []),
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
  }

  renderAll(filtered);
}

// Re-read listings fresh on each page load so cross-account posts always appear
document.addEventListener("DOMContentLoaded", () => {
  const allListings = getAllListings();
  const totalEl = document.getElementById("directoryTotal");
  if (totalEl) totalEl.textContent = allListings.length;

  document.getElementById("dirSearch").addEventListener("input", applyFilters);
  document.getElementById("dirCityFilter").addEventListener("change", applyFilters);
  document.getElementById("dirServiceFilter").addEventListener("change", applyFilters);

  renderAll(allListings);
});
