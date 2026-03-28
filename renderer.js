// ELEMENTS
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");

// ================= QUOTE FUNCTION =================
async function getQuote() {
  quoteText.innerText = "Loading quote...";
  authorText.innerText = "";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://api.quotable.io/random", {
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    quoteText.innerText = data.content;
    authorText.innerText = "- " + data.author;

  } catch (err) {
    // 🔥 fallback quotes
    const fallback = [
      { text: "Believe in yourself.", author: "Unknown" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
      { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
      { text: "Do what you can with what you have.", author: "Theodore Roosevelt" }
    ];

    const q = fallback[Math.floor(Math.random() * fallback.length)];

    quoteText.innerText = q.text;
    authorText.innerText = "- " + q.author;
  }
}

// NEW QUOTE BUTTON
document.getElementById("newQuote").onclick = getQuote;

// ================= COPY =================
document.getElementById("copyQuote").onclick = () => {
  navigator.clipboard.writeText(quoteText.innerText);

  const btn = document.getElementById("copyQuote");
  btn.innerText = "✅";
  setTimeout(() => (btn.innerText = "📋"), 1500);
};

// ================= STORAGE =================
function save(type) {
  let arr = JSON.parse(localStorage.getItem(type)) || [];
  const text = quoteText.innerText;

  if (!arr.includes(text)) {
    arr.push(text);
    localStorage.setItem(type, JSON.stringify(arr));
  }
}

// LIKE & FAVORITE
document.getElementById("likeQuote").onclick = () => save("liked");
document.getElementById("favQuote").onclick = () => save("favorites");

// ================= PANELS =================
function openPanel(type, listId, panelId) {
  let arr = JSON.parse(localStorage.getItem(type)) || [];
  const list = document.getElementById(listId);

  list.innerHTML = "";

  if (arr.length === 0) {
    list.innerHTML = "<p>No quotes yet 🌌</p>";
  } else {
    arr.forEach(q => {
      let li = document.createElement("li");
      li.innerHTML = `
        ${q}
        <button onclick="removeItem('${q}','${type}')">❌</button>
      `;
      list.appendChild(li);
    });
  }

  document.getElementById(panelId).classList.add("active");
}

// BUTTONS
document.getElementById("favBtn").onclick = () =>
  openPanel("favorites", "favoritesList", "favoritesPanel");

document.getElementById("likedBtn").onclick = () =>
  openPanel("liked", "likedList", "likedPanel");

// REMOVE ITEM
function removeItem(text, type) {
  let arr = JSON.parse(localStorage.getItem(type)) || [];
  arr = arr.filter(q => q !== text);
  localStorage.setItem(type, JSON.stringify(arr));
  location.reload();
}

// CLOSE PANELS
document.querySelectorAll(".closePanel").forEach(btn => {
  btn.onclick = () => {
    document
      .querySelectorAll(".side-panel")
      .forEach(p => p.classList.remove("active"));
  };
});

// ================= SHARE =================
document.getElementById("shareTopBtn").onclick = () => {
  let text = quoteText.innerText + " " + authorText.innerText;

  if (navigator.share) {
    navigator.share({
      title: "Stellar Quotes",
      text
    });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }
};

// ================= THEME =================
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// ================= SHOOTING STARS =================
setInterval(() => {
  const star = document.createElement("div");
  star.className = "shooting";
  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.left = Math.random() * window.innerWidth + "px";

  document.querySelector(".shooting-container").appendChild(star);

  setTimeout(() => star.remove(), 1000);
}, 2000);

// ================= PARALLAX =================
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.querySelector(".card").style.transform =
    `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

// ================= INIT =================
getQuote();

// CLOSE PANELS ON LOAD (IMPORTANT FIX)
document.querySelectorAll(".side-panel").forEach(p => {
  p.classList.remove("active");
});

// ================= SERVICE WORKER =================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}