





// directory.js — defensive loader that avoids redeclaring globals present in portal-data.js



// Use existing globals from portal-data.js when available, otherwise provide fallbacks

const _getServiceName = window.getServiceName || (k => (window.serviceNames && window.serviceNames[k]) || k);

const _formatCity = window.formatCity || (c => ({ ottawa:"Ottawa", toronto:"Toronto", hamilton:"Hamilton", london:"London", kingston:"Kingston", other:"Ontario" }[c] || c || "Ontario"));

const _getCapacityClass = window.getCapacityClass || (c => ({ Available:"cap-available", Limited:"cap-limited", Full:"cap-full" }[c] || ""));

const _escapeHtml = window.escapeHtml || function(str) {

  if (!str) return "";

  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");

};



function renderAll(list) {

  const container = document.getElementById("directoryContainer");

  const count     = document.getElementById("directoryCount");



  if (!container || !count) return; // nothing to mount into



  count.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;



  if (list.length === 0) {

    container.innerHTML = '<div class="empty-state"><p>No organizations match your search.</p></div>';

    return;

  }



  try {

    container.innerHTML = list.map(org => {

      // Seed orgs have profile extras; posted orgs have inline data

      let populations = [], referral = "", profileHref = "#";



      if (org._seed) {

        const profile = (typeof profileForOrganization === "function") ? profileForOrganization(

          (typeof organizations !== 'undefined' ? organizations.find(o => o.id === org._id) : {}) || {}

        ) : { populationServed:[], referralRequirements:[] };

        populations = (profile.populationServed || []).slice(0,2);

        referral = (profile.referralRequirements || [])[0] || "";

        profileHref = `profile.html?id=${org._id}`;

      } else {

        populations = (org.populationServed || []).slice(0,2);

        referral = (org.referralRequirements || [])[0] || "";

        profileHref = `posted-profile.html?uid=${org.userId}`;

      }



      const services = (org.services || []).slice(0,4).map(_getServiceName).join(", ");

      const tags     = (org.services || []).slice(0,5).map(s => `<span class="tag">${_escapeHtml(_getServiceName(s))}</span>`).join("");

      const websiteLink = org.website && org.website !== "#"

        ? `<a href="${_escapeHtml(org.website)}" target="_blank" rel="noopener">Website</a>` : "";

      const postedBadge = org._seed ? "" : `<span class="tag" style="background:#e0f2fe;color:#0369a1;font-weight:600;">Posted</span>`;



      // Additional info bits

      const bedInfo = (org.bedsAvailable != null)

        ? `<div><dt>Beds available</dt><dd>${org.bedsAvailable}${org.bedsTotal != null ? " / " + org.bedsTotal : ""}</dd></div>` : "";

      const intakeInfo = org.intakeHours

        ? `<div><dt>Intake hours</dt><dd>${_escapeHtml(org.intakeHours)}</dd></div>` : "";



      const referralHtml = referral ? `<div><dt>Referral</dt><dd>${_escapeHtml(referral)}</dd></div>` : "";

      // Render phone as a tel: link labeled "Phone" and align it with other action links.

      const phoneLink = org.phone ? `<div class="phone-row"><a href="tel:${_escapeHtml((org.phone || '').replace(/[^\d+]/g,''))}" title="${_escapeHtml(org.phone)}">Phone</a></div>` : "";



      return `

        <div class="card directory-card">

          <div class="card-top">

            <div>

              <h3>${_escapeHtml(org.orgName || org.name)}</h3>

              <div class="card-city">${_formatCity(org.city)}${org.address ? " · " + _escapeHtml(org.address) : ""}</div>

            </div>

            <span class="capacity ${_getCapacityClass(org.capacity)}">${org.capacity || "—"}</span>

          </div>



          <p class="card-desc">${_escapeHtml(org.description)}</p>



          <dl class="mini-profile">

            <div><dt>Services</dt><dd>${_escapeHtml(services)}</dd></div>

            ${populations.length ? `<div><dt>Population</dt><dd>${_escapeHtml(populations.join(", "))}</dd></div>` : ""}

            ${referralHtml}

            ${bedInfo}${intakeInfo}

          </dl>



          <div class="tags">${tags}${postedBadge}</div>



          <div class="card-actions">

            <a class="button-link view-btn" href="${profileHref}">View profile</a>

            ${phoneLink}

            ${websiteLink ? `<div class="website-row">${websiteLink}</div>` : ""}

          </div>

        </div>

      `;

    }).join("");

  } catch (err) {

    console.error('Error rendering directory', err, list);

    container.innerHTML = `<div class="empty-state"><p>Unable to render directory — check the console for details.</p></div>`;

  }

}



// Unified listings loader:

// - Prefer the in-page listings store (listings.js) so posted listings in localStorage appear

// - Fallback to network fetch of listings.json when the store is not present

async function fetchListings() {

  try {

    if (typeof window.getAllListings === 'function') {

      const res = window.getAllListings();

      if (res && typeof res.then === 'function') return await res;

      return res;

    }



    // Fallback to absolute path used by GitHub Pages (this repo's Pages path)

    const repoPrefix = '/C4_project/shelter-fixed/shelter-fixed/listings.json';

    const resp = await fetch(repoPrefix);

    if (!resp.ok) throw new Error('Network error: ' + resp.status);

    return await resp.json();

  } catch (e) {

    console.error('Failed to load listings', e);

    return [];

  }

}



async function applyFilters() {

  const keyword = (document.getElementById("dirSearch") || {value:''}).value.trim().toLowerCase();

  const city    = (document.getElementById("dirCityFilter") || {value:''}).value;

  const service = (document.getElementById("dirServiceFilter") || {value:''}).value;



  const listings = await fetchListings();

  let filtered = (Array.isArray(listings) ? listings.slice() : []);



  if (city)    filtered = filtered.filter(o => o.city === city);

  if (service) filtered = filtered.filter(o => (o.services || []).includes(service));

  if (keyword) {

    filtered = filtered.filter(o => {

      const haystack = [

        o.orgName, o.name, o.description, o.city, o.address,

        ...(o.services || []).map(_getServiceName),

        ...(o.tags || []),

        ...(o.populationServed || []),

        ...(o.referralRequirements || []),

      ].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(keyword);

    });

  }



  renderAll(filtered);

}



// Read listings on page load. Use the unified loader so posted listings (localStorage)

// are included when available. Wire up filters and render.

document.addEventListener("DOMContentLoaded", async () => {

  const listings = await fetchListings();

  const totalEl = document.getElementById("directoryTotal");

  if (totalEl) totalEl.textContent = Array.isArray(listings) ? listings.length : 0;



  const searchEl = document.getElementById("dirSearch");

  const cityEl = document.getElementById("dirCityFilter");

  const serviceEl = document.getElementById("dirServiceFilter");



  if (searchEl) searchEl.addEventListener("input", applyFilters);

  if (cityEl) cityEl.addEventListener("change", applyFilters);

  if (serviceEl) serviceEl.addEventListener("change", applyFilters);



  renderAll(Array.isArray(listings) ? listings : []);

});
