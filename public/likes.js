(() => {
  const root = document.querySelector("[data-post-likes]");
  if (!root) return;

  const button = root.querySelector("[data-like-button]");
  const count = root.querySelector("[data-like-count]");
  const status = root.querySelector("[data-likes-status]");
  const path = window.location.pathname;

  async function request(method) {
    const options = method === "POST"
      ? { method, headers: { "content-type": "application/json" }, body: JSON.stringify({ path }) }
      : {};
    const url = method === "GET" ? `/api/likes?path=${encodeURIComponent(path)}` : "/api/likes";
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Likes request failed: ${response.status}`);
    return response.json();
  }

  request("GET").then((result) => {
    count.value = String(result.count);
    root.hidden = false;
  }).catch(() => {
    status.textContent = status.dataset.error;
  });

  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      const result = await request("POST");
      count.value = String(result.count);
      button.setAttribute("aria-pressed", "true");
    } catch {
      status.textContent = status.dataset.error;
    } finally {
      button.disabled = false;
    }
  });
})();
