/************************************
 * CONFIG
 ************************************/
const API_URL = "http://localhost:3000/api/posts"; // change after deploy

/************************************
 * LOCOMOTIVE SCROLL
 ************************************/
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  multiplier: 1,
  class: "is-inview",
});

/************************************
 * GSAP
 ************************************/
gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero-title", {
  opacity: 0,
  y: 50,
  duration: 1.5,
  ease: "power3.out",
});

gsap.from(".hero p", {
  opacity: 0,
  y: 30,
  duration: 1.5,
  delay: 0.3,
  ease: "power3.out",
});

gsap.from(".cta-button", {
  opacity: 0,
  scale: 0.8,
  duration: 1,
  delay: 0.6,
  ease: "back.out(1.7)",
});

/************************************
 * GUEST ID (ANONYMITY)
 ************************************/
let guestId = localStorage.getItem("guestId");
if (!guestId) {
  guestId = "guest_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("guestId", guestId);
}

/************************************
 * GLOBAL STATE
 ************************************/
let posts = [];

/************************************
 * FETCH POSTS FROM BACKEND
 ************************************/
async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    posts = await res.json();
    renderPosts();
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

/************************************
 * RENDER POSTS
 ************************************/
function renderPosts(filter = "all", searchTerm = "") {
  const postsGrid = document.getElementById("postsGrid");
  postsGrid.innerHTML = "";

  let filteredPosts = posts;

  if (filter !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.tag === filter);
  }

  if (searchTerm) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  filteredPosts.forEach((post, index) => {
    const postCard = document.createElement("div");
    postCard.className = "post-card";
    postCard.style.opacity = "0";
    postCard.style.transform = "translateY(30px)";

    postCard.innerHTML = `
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-tag">#${post.tag}</span>
      </div>

      <h3 class="post-title">${post.title}</h3>

      <p class="post-description">
        ${post.description.substring(0, 100)}...
      </p>

      <div class="post-footer">
        <div class="post-stats">
          <span class="stat">👍 ${post.upvotes}</span>
        </div>

        <div>
          <button class="upvote-btn" onclick="upvotePost('${post._id}')">
            Upvote
          </button>
        </div>
      </div>
    `;

    postCard.onclick = () => openThread(post._id);
    postsGrid.appendChild(postCard);

    gsap.to(postCard, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.08,
      ease: "power2.out",
    });
  });

  scroll.update();
}

/************************************
 * CATEGORY FILTER
 ************************************/
document.querySelectorAll(".category-pill").forEach((pill) => {
  pill.onclick = function () {
    document
      .querySelectorAll(".category-pill")
      .forEach((p) => p.classList.remove("active"));

    this.classList.add("active");

    renderPosts(
      this.getAttribute("data-category"),
      document.getElementById("searchInput").value,
    );
  };
});

/************************************
 * SEARCH
 ************************************/
document.getElementById("searchInput").addEventListener("input", (e) => {
  const activeCategory = document
    .querySelector(".category-pill.active")
    .getAttribute("data-category");

  renderPosts(activeCategory, e.target.value);
});

/************************************
 * MODAL CONTROLS
 ************************************/
function openModal() {
  const modal = document.getElementById("createPostModal");
  modal.classList.add("active");

  gsap.from(".modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)",
  });
}

function closeModal() {
  document.getElementById("createPostModal").classList.remove("active");
}

/************************************
 * CREATE POST
 ************************************/
async function submitPost(e) {
  e.preventDefault();

  const postData = {
    title: postTitle.value,
    description: postDescription.value,
    tag: postTag.value,
    author: "Anonymous",
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    closeModal();
    postForm.reset();
    fetchPosts();
  } catch (err) {
    console.error("Error creating post:", err);
  }
}

/************************************
 * UPVOTE
 ************************************/
async function upvotePost(id) {
  event.stopPropagation();
  await fetch(`${API_URL}/${id}/upvote`, { method: "PATCH" });
  fetchPosts();
}

/************************************
 * DELETE POST
 ************************************/
async function deletePost(id) {
  event.stopPropagation();
  if (!confirm("Delete this post?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchPosts();
}

/************************************
 * THREAD VIEW
 ************************************/
function openThread(id) {
  const post = posts.find((p) => p._id === id);
  if (!post) return;

  const modal = document.getElementById("threadModal");
  const content = document.getElementById("threadContent");

  content.innerHTML = `
    <div class="thread-post">
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-tag">#${post.tag}</span>
      </div>

      <h2 class="post-title">${post.title}</h2>
      <p class="post-description">${post.description}</p>

      <button class="upvote-btn" onclick="upvotePost('${post._id}')">
        Upvote (${post.upvotes})
      </button>
    </div>
  `;

  modal.classList.add("active");

  gsap.from(".thread-post", {
    y: 30,
    opacity: 0,
    duration: 0.4,
  });
}

function closeThreadModal() {
  document.getElementById("threadModal").classList.remove("active");
}

/************************************
 * RANDOM QUOTES
 ************************************/
const quotes = [
  "You are not alone",
  "Healing is progress",
  "Your feelings are valid",
  "Tomorrow is a new day",
  "You are stronger than you think",
];

function updateQuote() {
  const el = document.getElementById("random-quote");
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  gsap.to(el, {
    opacity: 0,
    duration: 0.4,
    onComplete: () => {
      el.textContent = quote;
      gsap.to(el, { opacity: 1, duration: 0.4 });
    },
  });
}

setInterval(updateQuote, 10000);

/************************************
 * DARK MODE
 ************************************/
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
}

if (localStorage.getItem("darkMode") === "true") {
  toggleDarkMode();
}

/************************************
 * SCROLL TO FORUM
 ************************************/
function scrollToForum() {
  scroll.scrollTo("#forum");
}

/************************************
 * CLOSE MODALS ON OUTSIDE CLICK
 ************************************/
window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
  }
};

/************************************
 * INIT
 ************************************/
fetchPosts();
