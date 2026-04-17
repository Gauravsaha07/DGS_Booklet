let loginBtn = document.getElementById("loginBtn");
let signupBtn = document.getElementById("signupBtn");
let loginModal = document.getElementById("loginModal");
let signupModal = document.getElementById("signupModal");
let centerContainer = document.getElementById("centerContainer");
let homePage = document.getElementById("homePage");
let logoutBtn = document.getElementById("logoutBtn");
let booksContainer = document.getElementById("booksContainer");
let navItems = document.querySelectorAll(".nav-item");
let searchInput = document.getElementById("searchInput");

// --- Element Display Functions ---
function hideBackground() {
    centerContainer.style.display = "none";
}

function showBackground() {
    // Show only if homePage is NOT active
    if (homePage.style.display !== "block") {
        centerContainer.style.display = "block";
    }
}

// --- OPEN FORMS ---
loginBtn.onclick = () => {
    signupModal.style.display = "none";
    loginModal.style.display = "flex";
    hideBackground(); // Hide text when login opens
}

signupBtn.onclick = () => {
    loginModal.style.display = "none";
    signupModal.style.display = "flex";
    hideBackground(); // Hide text when signup opens
}

// --- CLOSE FORMS (by clicking outside) ---
window.onclick = function(e) {
    if (e.target == loginModal || e.target == signupModal) {
        loginModal.style.display = "none";
        signupModal.style.display = "none";
        showBackground(); // Show text back when form closes
    }
}

// VALIDATE MOBILE
function validateMobile(num) {
    let regex = /^[6-9][0-9]{9}$/;
    return regex.test(num);
}

// SIGNUP LOGIC
document.getElementById("signupSubmit").onclick = function() {
    let mobile = document.getElementById("signupMobile").value;
    let pass = document.getElementById("signupPassword").value;
    let confirm = document.getElementById("confirmPassword").value;
    let error = document.getElementById("signupError");

    if (!validateMobile(mobile)) { error.innerText = "Invalid Mobile Number"; return; }
    if (pass == "") { error.innerText = "Please Enter Password"; return; }
    if (pass !== confirm) { error.innerText = "Password Doesn't Match"; return; }
    if (localStorage.getItem(mobile)) { error.innerText = "Mobile Number Already Exists"; return; }

    localStorage.setItem(mobile, pass);
    localStorage.setItem("loggedIn", "true");
    showDashboard();
}

// LOGIN LOGIC
document.getElementById("loginSubmit").onclick = function() {
    let mobile = document.getElementById("loginMobile").value;
    let pass = document.getElementById("loginPassword").value;
    let error = document.getElementById("loginError");

    if (!validateMobile(mobile)) { error.innerText = "Invalid Mobile Number"; return; }
    let storedPass = localStorage.getItem(mobile);
    if (!storedPass) { error.innerText = "ID Doesn't Exist"; return; }
    if (storedPass !== pass) { error.innerText = "Wrong Password"; return; }

    localStorage.setItem("loggedIn", "true");
    showDashboard();
}

// --- Dashboard Logic (Home Page after Login) ---
function showDashboard() {
    document.getElementById("heroSection").style.display = "none";
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    centerContainer.style.display = "none"; // Final hide
    homePage.style.display = "block";
    loadCards("home"); // Show Home default
}

// Load 9 cards per category
function loadCards(category) {
    booksContainer.innerHTML = "";
    const allData = {
        home: ["Harry Potter", "The Alchemist", "Atomic Habits", "Ikigai", "Think and Grow Rich", "Psychology of Money", "Deep Work", "Rich Dad Poor Dad", "Sherlock Holmes"],
        books: ["1984", "Great Gatsby", "To Kill a Mockingbird", "The Hobbit", "Pride and Prejudice", "Animal Farm", "Ulysses", "Moby Dick", "The Shining"],
        stories: ["Vikram Betaal", "Tenali Raman", "Akbar Birbal", "Panchatantra", "Malgudi Days", "The Blue Umbrella", "Monkey King", "Aesop's Fables", "Grandma's Tales"],
        shows: ["Stranger Things", "Breaking Bad", "Dark", "Money Heist", "The Crown", "Witcher", "Friends", "Office", "Narcos"]
    };

    allData[category].forEach(title => {
        let card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `<h3>${title}</h3><p style="color:#666; margin-top:10px;">Click to View</p>`;
        booksContainer.appendChild(card);
    });
}

// --- Navigation ---
navItems.forEach(item => {
    item.addEventListener("click", function() {
        navItems.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
        searchInput.value = ""; // Clear search
        loadCards(this.dataset.type);
    });
});

// --- Search Logic ---
searchInput.onfocus = () => {
    // Remove active underlines when searching
    navItems.forEach(nav => nav.classList.remove("active"));
};

searchInput.addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        let query = searchInput.value.toLowerCase().trim();
        if (query === "") return;
        
        booksContainer.innerHTML = "";
        let found = false;
        let categories = ["home", "books", "stories", "shows"];
        let allTitles = { home: ["Harry Potter", "The Alchemist", "Atomic Habits", "Ikigai", "Think and Grow Rich", "Psychology of Money", "Deep Work", "Rich Dad Poor Dad", "Sherlock Holmes"], books: ["1984", "Great Gatsby", "To Kill a Mockingbird", "The Hobbit", "Pride and Prejudice", "Animal Farm", "Ulysses", "Moby Dick", "The Shining"], stories: ["Vikram Betaal", "Tenali Raman", "Akbar Birbal", "Panchatantra", "Malgudi Days", "The Blue Umbrella", "Monkey King", "Aesop's Fables", "Grandma's Tales"], shows: ["Stranger Things", "Breaking Bad", "Dark", "Money Heist", "The Crown", "Witcher", "Friends", "Office", "Narcos"] };

        categories.forEach(cat => {
            allTitles[cat].forEach(title => {
                if (title.toLowerCase() === query) {
                    let card = document.createElement("div");
                    card.className = "book-card";
                    card.style.gridColumn = "2"; // Center it
                    card.innerHTML = `<h3>${title}</h3><p style="color:#666; margin-top:10px;">Found in ${cat}</p>`;
                    booksContainer.appendChild(card);
                    found = true;
                }
            });
        });

        if (!found) {
            booksContainer.innerHTML = `<div class="not-found">Result not found</div>`;
        }
    }
});

// LOGOUT
logoutBtn.onclick = function() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

// Keep Login Session
if (localStorage.getItem("loggedIn")) showDashboard();