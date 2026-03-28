// ================= ELEMENTS =================
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");

// ================= OFFLINE QUOTES =================
const offlineQuotes = [
  { text: "Believe in yourself.", author: "Unknown" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Do what you can with what you have.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference.", author: "William James" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "If opportunity doesn’t knock, build a door.", author: "Milton Berle" },
  { text: "Don’t wait. The time will never be just right.", author: "Napoleon Hill" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Life is what happens when you’re busy making plans.", author: "John Lennon" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Keep going. Be all in.", author: "Bryan Hutchinson" },
  { text: "Dream as if you’ll live forever.", author: "James Dean" },
  { text: "Turn your dreams into plans.", author: "Unknown" },
  { text: "Small steps every day.", author: "Unknown" },
  { text: "Push yourself, because no one else will.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Success doesn’t just find you.", author: "Unknown" },
  { text: "Don’t stop until you’re proud.", author: "Unknown" },
  { text: "Make it happen.", author: "Unknown" },
  { text: "Stay positive, work hard, make it happen.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Work hard in silence.", author: "Unknown" },
  { text: "Don’t watch the clock.", author: "Sam Levenson" },
  { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  { text: "Start where you are.", author: "Arthur Ashe" },
  { text: "Do what you can.", author: "Arthur Ashe" },
  { text: "Use what you have.", author: "Arthur Ashe" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Success is walking from failure to failure.", author: "Winston Churchill" }
];

// ================= GET QUOTE =================
async function getQuote() {
  // fade out
  quoteText.style.opacity = 0;

  setTimeout(async () => {
    // 1️⃣ show offline instantly
    const q = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];
    quoteText.innerText = q.text;
    authorText.innerText = "- " + q.author;

    quoteText.style.opacity = 1;

    // 2️⃣ try API in background
    try {
      const res = await fetch("https://api.quotable.io/random");
      if (!res.ok) throw new Error();

      const data = await res.json();

      // smooth replace
      setTimeout(() => {
        quoteText.style.opacity = 0;

        setTimeout(() => {
          quoteText.innerText = data.content;
          authorText.innerText = "- " + data.author;
          quoteText.style.opacity = 1;
        }, 200);

      }, 800);

    } catch (err) {
      console.log("Offline mode");
    }

  }, 200);
}

// ================= BUTTONS =================
document.getElementById("newQuote").onclick = getQuote;

document.getElementById("copyQuote").onclick = () => {
  navigator.clipboard.writeText(quoteText.innerText);
};

document.getElementById("likeQuote").onclick = () => save("liked");
document.getElementById("favQuote").onclick = () => save("favorites");

// ================= STORAGE =================
function save(type) {
  let arr = JSON.parse(localStorage.getItem(type)) || [];
  const text = quoteText.innerText;

  if (!arr.includes(text)) {
    arr.push(text);
    localStorage.setItem(type, JSON.stringify(arr));
  }
}

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
      li.innerHTML = `${q} <button onclick="removeItem('${q}','${type}')">❌</button>`;
      list.appendChild(li);
    });
  }

  document.getElementById(panelId).classList.add("active");
}

function removeItem(text, type) {
  let arr = JSON.parse(localStorage.getItem(type)) || [];
  arr = arr.filter(q => q !== text);
  localStorage.setItem(type, JSON.stringify(arr));
  location.reload();
}

// BUTTONS
document.getElementById("favBtn").onclick = () =>
  openPanel("favorites", "favoritesList", "favoritesPanel");

document.getElementById("likedBtn").onclick = () =>
  openPanel("liked", "likedList", "likedPanel");

// CLOSE PANELS
document.querySelectorAll(".closePanel").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".side-panel").forEach(p => p.classList.remove("active"));
  };
});

// ================= SHARE =================
document.getElementById("shareTopBtn").onclick = () => {
  let text = quoteText.innerText + " " + authorText.innerText;

  if (navigator.share) {
    navigator.share({ title: "Stellar Quotes", text });
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

// CLOSE PANELS ON LOAD
document.querySelectorAll(".side-panel").forEach(p => {
  p.classList.remove("active");
});

// ================= SERVICE WORKER =================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}