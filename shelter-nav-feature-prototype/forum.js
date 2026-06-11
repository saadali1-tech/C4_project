const forumStorageKey = "connectCareForumThreads";

function getThreads() {
  let saved = null;
  try {
    saved = localStorage.getItem(forumStorageKey);
  } catch {
    saved = null;
  }

  if (!saved) return [...forumThreads];

  try {
    return JSON.parse(saved);
  } catch {
    return [...forumThreads];
  }
}

function saveThreads(threads) {
  try {
    localStorage.setItem(forumStorageKey, JSON.stringify(threads));
  } catch {
    // Storage can be unavailable when opened directly from the file system.
  }
}

function renderForum() {
  const search = document.getElementById("forumSearch").value.trim().toLowerCase();
  const category = document.getElementById("forumCategory").value;
  const threads = getThreads();

  const filtered = threads.filter(thread => {
    const matchesCategory = !category || thread.category === category;
    const haystack = [thread.title, thread.summary, thread.region, thread.author, thread.category].join(" ").toLowerCase();
    return matchesCategory && (!search || haystack.includes(search));
  });

  document.getElementById("threadCount").textContent = `${filtered.length} thread${filtered.length !== 1 ? "s" : ""}`;

  document.getElementById("forumThreads").innerHTML = filtered.length
    ? filtered.map(thread => `
      <article class="thread-card">
        <div>
          <span class="thread-category">${escapeHtml(thread.category)}</span>
          <h3>${escapeHtml(thread.title)}</h3>
          <p>${escapeHtml(thread.summary)}</p>
          <div class="thread-meta">
            <span>${escapeHtml(thread.region)}</span>
            <span>${escapeHtml(thread.author)}</span>
            <span>${escapeHtml(thread.lastActive)}</span>
          </div>
        </div>
        <div class="thread-stats">
          <strong>${thread.replies}</strong>
          <span>replies</span>
          <strong>${thread.views}</strong>
          <span>views</span>
        </div>
      </article>
    `).join("")
    : '<div class="empty-state"><p>No discussions match your filters.</p></div>';
}

document.getElementById("forumSearch").addEventListener("input", renderForum);
document.getElementById("forumCategory").addEventListener("change", renderForum);

document.getElementById("newThreadForm").addEventListener("submit", event => {
  event.preventDefault();

  const title = document.getElementById("threadTitle").value.trim();
  const category = document.getElementById("threadCategory").value;
  const region = document.getElementById("threadRegion").value.trim() || "Ontario-wide";
  const summary = document.getElementById("threadSummary").value.trim();

  if (!title || !summary) return;

  const threads = getThreads();
  threads.unshift({
    id: Date.now(),
    title,
    category,
    region,
    author: "Demo user",
    replies: 0,
    views: 1,
    lastActive: "Just now",
    summary
  });

  saveThreads(threads);
  event.target.reset();
  renderForum();
});

renderForum();
