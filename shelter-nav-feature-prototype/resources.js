function formatDeadline(deadline) {
  if (deadline === "Rolling") return "Rolling";
  const date = new Date(`${deadline}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderResources() {
  const search = document.getElementById("resourceSearch").value.trim().toLowerCase();
  const type = document.getElementById("resourceType").value;
  const focus = document.getElementById("resourceFocus").value;

  const filtered = fundingResources.filter(resource => {
    const matchesType = !type || resource.type === type;
    const matchesFocus = !focus || resource.focus === focus;
    const haystack = [
      resource.title,
      resource.type,
      resource.focus,
      resource.source,
      resource.description,
      resource.amount,
      ...resource.reporting,
      ...resource.tags
    ].join(" ").toLowerCase();

    return matchesType && matchesFocus && (!search || haystack.includes(search));
  });

  document.getElementById("resourceCount").textContent = `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;

  const container = document.getElementById("resourceContainer");
  container.innerHTML = filtered.length
    ? filtered.map(resource => `
      <article class="resource-card">
        <div class="resource-top">
          <span class="thread-category">${escapeHtml(resource.type)}</span>
          <span>${escapeHtml(resource.focus)}</span>
        </div>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
        <dl class="resource-facts">
          <div>
            <dt>Source</dt>
            <dd>${escapeHtml(resource.source)}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>${escapeHtml(resource.amount)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>${escapeHtml(formatDeadline(resource.deadline))}</dd>
          </div>
        </dl>
        <h4>Reporting requirements</h4>
        <ul class="detail-list">${resource.reporting.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="tags">${resource.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      </article>
    `).join("")
    : '<div class="empty-state"><p>No resources match your filters.</p></div>';
}

document.getElementById("resourceSearch").addEventListener("input", renderResources);
document.getElementById("resourceType").addEventListener("change", renderResources);
document.getElementById("resourceFocus").addEventListener("change", renderResources);

renderResources();
