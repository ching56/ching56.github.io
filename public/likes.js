// The likes control as an explicit state machine. Every change goes through
// send(event); render() derives the whole DOM from the current state, so no
// flag can disagree with another.
//
//   loading ──loaded──▶ ready ──press──▶ sending ──sent──▶ liked
//      │                  ▲                 │                │
//      └─loadFailed─▶ unavailable           └─sendFailed─▶ failed
//                                     (liked and failed accept press again)
(() => {
  const root = document.querySelector("[data-post-likes]");
  if (!root) return;

  const button = root.querySelector("[data-like-button]");
  const count = root.querySelector("[data-like-count]");
  const status = root.querySelector("[data-likes-status]");
  const path = window.location.pathname;

  const transitions = {
    loading: { loaded: "ready", loadFailed: "unavailable" },
    ready: { press: "sending" },
    sending: { sent: "liked", sendFailed: "failed" },
    liked: { press: "sending" },
    failed: { press: "sending" },
    unavailable: {},
  };

  let state = "loading";
  const context = { count: 0, liked: false };

  function render() {
    root.dataset.state = state;
    // Shown once a count has arrived; a page that cannot reach the count
    // keeps the control hidden rather than offering a dead button.
    root.hidden = state === "loading" || state === "unavailable";
    button.disabled = state === "sending";
    button.setAttribute("aria-busy", String(state === "sending"));
    button.setAttribute("aria-pressed", String(context.liked));
    count.value = String(context.count);
    status.textContent = state === "failed" ? status.dataset.error : "";
  }

  function send(event, data = {}) {
    const next = transitions[state][event];
    if (!next) return false;
    if (typeof data.count === "number") context.count = data.count;
    if (event === "sent") context.liked = true;
    state = next;
    render();
    return true;
  }

  async function request(method) {
    const options = method === "POST"
      ? { method, headers: { "content-type": "application/json" }, body: JSON.stringify({ path }) }
      : {};
    const url = method === "GET" ? `/api/likes?path=${encodeURIComponent(path)}` : "/api/likes";
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Likes request failed: ${response.status}`);
    return response.json();
  }

  render();
  request("GET").then(
    (result) => send("loaded", { count: result.count }),
    () => send("loadFailed"),
  );

  button.addEventListener("click", async () => {
    if (!send("press")) return;
    try {
      const result = await request("POST");
      send("sent", { count: result.count });
    } catch {
      send("sendFailed");
    }
  });
})();
