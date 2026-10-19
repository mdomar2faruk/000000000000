/* ==========================================
AUTH SYSTEM
REGISTER + LOGIN
========================================== */

document.addEventListener("DOMContentLoaded", function () {

```
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");


/* ==========================================
   REGISTER SYSTEM
========================================== */

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const usernameInput = document.getElementById("registerName");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const confirmPasswordInput = document.getElementById("confirmPassword");

        if (
            !usernameInput ||
            !emailInput ||
            !passwordInput ||
            !confirmPasswordInput
        ) {
            alert("রেজিস্ট্রেশন ফর্মের কোনো একটি ফিল্ড পাওয়া যাচ্ছে না।");
            return;
        }

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        /* ==========================================
           BASIC VALIDATION
        ========================================== */

        if (!username || !email || !password || !confirmPassword) {
            alert("দয়া করে সব তথ্য পূরণ করুন।");
            return;
        }


        /* ==========================================
           PASSWORD LENGTH CHECK
        ========================================== */

        if (password.length < 6) {
            alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
            return;
        }


        /* ==========================================
           PASSWORD MATCH CHECK
        ========================================== */

        if (password !== confirmPassword) {
            alert("দুটি পাসওয়ার্ড মিলছে না।");
            return;
        }


        /* ==========================================
           GET REGISTERED USERS
        ========================================== */

        let usersList = JSON.parse(
            localStorage.getItem("all_registered_users")
        ) || [];


        /* ==========================================
           DUPLICATE EMAIL CHECK
        ========================================== */

        const existingUser = usersList.find(
            user =>
                user.email &&
                user.email.toLowerCase() === email
        );

        if (existingUser) {
            alert(
                "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।"
            );
            return;
        }


        /* ==========================================
           CREATE NEW USER
        ========================================== */

        const newUser = {

            id: Date.now(),

            username: username,

            email: email,

            password: password,

            role: "ব্যবহারকারী",

            activeStatus: "Active",

            isSuper: "No",

            avatar: "",

            device: navigator.userAgent,

            createdAt: new Date().toISOString()
        };


        /* ==========================================
           SAVE USER
        ========================================== */

        usersList.push(newUser);

        localStorage.setItem(
            "all_registered_users",
            JSON.stringify(usersList)
        );


        /* ==========================================
           REGISTRATION SUCCESS
        ========================================== */

        alert(
            "রেজিস্ট্রেশন সফল হয়েছে!\n\nএখন আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।"
        );


        /* ==========================================
           GO TO LOGIN PAGE
        ========================================== */

        window.location.href = "login.html";

    });
}



/* ==========================================
   LOGIN SYSTEM
========================================== */

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        if (!emailInput || !passwordInput) {
            alert("লগইন ফর্মের কোনো একটি ফিল্ড পাওয়া যাচ্ছে না।");
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;


        /* ==========================================
           BASIC VALIDATION
        ========================================== */

        if (!email || !password) {
            alert("দয়া করে ইমেইল ও পাসওয়ার্ড দিন।");
            return;
        }


        /* ==========================================
           GET REGISTERED USERS
        ========================================== */

        let usersList = JSON.parse(
            localStorage.getItem("all_registered_users")
        ) || [];


        /* ==========================================
           FIND USER
        ========================================== */

        const currentUser = usersList.find(
            user =>
                user.email &&
                user.email.toLowerCase() === email &&
                user.password === password
        );


        /* ==========================================
           LOGIN FAILED
        ========================================== */

        if (!currentUser) {
            alert("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
            return;
        }


        /* ==========================================
           ACCOUNT ACTIVE STATUS CHECK
        ========================================== */

        if (currentUser.activeStatus === "Inactive") {

            alert(
                "আপনার অ্যাকাউন্ট বর্তমানে ইনঅ্যাক্টিভ।\n\nসুপার অ্যাডমিনের সাথে যোগাযোগ করুন।"
            );

            return;
        }


        /* ==========================================
           LOGIN SESSION SAVE
        ========================================== */

        localStorage.setItem(
            "logged_in_user_email",
            currentUser.email
        );


        /* ==========================================
           LOGIN SUCCESS
        ========================================== */

        alert("লগইন সফল হয়েছে!");


        /* ==========================================
           GO TO MAIN PAGE
        ========================================== */

        window.location.href = "index.html";

    });
}
```

});
