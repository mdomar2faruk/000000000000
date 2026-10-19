/* ==========================================================
   হিসাব-কিতাব Dashboard
   STEP 3 — JavaScript
   ========================================================== */

"use strict";


/* ==========================================================
   1. GENERAL UTILITIES
   ========================================================== */

function getTodayInputDate() {
    const d = new Date();

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}


function formatDisplayDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==========================================================
   2. HEADER LOGO
   ========================================================== */

function previewHeaderLogo(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("দয়া করে একটি ছবি নির্বাচন করুন।");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const imageData = e.target.result;

        localStorage.setItem(
            "saved_header_logo",
            imageData
        );

        const logo = document.getElementById("headerBrandLogo");

        if (logo) {
            logo.src = imageData;
        }
    };

    reader.readAsDataURL(file);
}


function loadSavedHeaderLogo() {
    const logo = document.getElementById("headerBrandLogo");

    if (!logo) return;

    const savedLogo = localStorage.getItem(
        "saved_header_logo"
    );

    if (savedLogo) {
        logo.src = savedLogo;
    }
}


/* ==========================================================
   3. USER DATA
   ========================================================== */

function loadHeaderUserData() {

    const currentEmail =
        localStorage.getItem("logged_in_user_email") ||
        "sobkichubazar2026@gmail.com";

    let usersList = [];

    try {
        usersList = JSON.parse(
            localStorage.getItem("all_registered_users")
        ) || [];
    } catch (error) {
        usersList = [];
    }

    const currentUser =
        usersList.find(
            user => user.email === currentEmail
        ) ||
        usersList[0] ||
        {
            username: "MD OMAR FARUK",
            email: currentEmail,
            role: "সুপার অ্যাডমিন",
            isSuper: "Yes"
        };

    const nameElement =
        document.getElementById("displayUserName");

    const emailElement =
        document.getElementById("displayUserEmail");

    const avatarElement =
        document.getElementById("headerUserAvatar");

    const roleElement =
        document.getElementById("popupRoleTitle");

    if (nameElement) {
        nameElement.innerText =
            currentUser.username ||
            "MD OMAR FARUK";
    }

    if (emailElement) {
        emailElement.innerText =
            currentUser.email ||
            currentEmail;
    }

    if (
        avatarElement &&
        currentUser.avatar
    ) {
        avatarElement.src =
            currentUser.avatar;
    }

    if (roleElement) {
        roleElement.innerText =
            currentUser.role ||
            (
                currentUser.isSuper === "Yes"
                    ? "সুপার অ্যাডমিন"
                    : "ব্যবহারকারী"
            );
    }
}


/* ==========================================================
   4. THEME
   ========================================================== */

function toggleTheme() {

    const body =
        document.getElementById("bodyTheme") ||
        document.body;

    const button =
        document.getElementById("themeToggleBtn");

    if (body.classList.contains("dark-mode")) {

        body.classList.remove("dark-mode");
        body.classList.add("light-mode");

        localStorage.setItem(
            "site_theme",
            "light"
        );

        if (button) {
            button.innerText = "🌙";
        }

    } else {

        body.classList.remove("light-mode");
        body.classList.add("dark-mode");

        localStorage.setItem(
            "site_theme",
            "dark"
        );

        if (button) {
            button.innerText = "☀️";
        }
    }
}


function loadSavedTheme() {

    const body =
        document.getElementById("bodyTheme") ||
        document.body;

    const button =
        document.getElementById("themeToggleBtn");

    const theme =
        localStorage.getItem("site_theme") ||
        "dark";

    body.classList.remove(
        "dark-mode",
        "light-mode"
    );

    if (theme === "light") {

        body.classList.add("light-mode");

        if (button) {
            button.innerText = "🌙";
        }

    } else {

        body.classList.add("dark-mode");

        if (button) {
            button.innerText = "☀️";
        }
    }
}


/* ==========================================================
   5. LANGUAGE
   ========================================================== */

function toggleLanguage() {

    const currentLanguage =
        localStorage.getItem("site_lang") ||
        "bn";

    const newLanguage =
        currentLanguage === "bn"
            ? "en"
            : "bn";

    localStorage.setItem(
        "site_lang",
        newLanguage
    );

    applyLanguage(newLanguage);
}


function loadSavedLanguage() {

    const language =
        localStorage.getItem("site_lang") ||
        "bn";

    applyLanguage(language);
}


function applyLanguage(language) {

    const button =
        document.getElementById("langToggleBtn");

    if (button) {
        button.innerText =
            language === "bn"
                ? "EN"
                : "BN";
    }

    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.innerText =
            language === "bn"
                ? "হিসাব-কিতাব | Dashboard"
                : "Accounts Dashboard";
    }

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.placeholder =
            language === "bn"
                ? "সার্চ করুন..."
                : "Search...";
    }

    /*
       data-bn / data-en থাকা সব element
       স্বয়ংক্রিয়ভাবে পরিবর্তন হবে।
    */

    document
        .querySelectorAll("[data-bn][data-en]")
        .forEach(element => {

            element.innerText =
                language === "bn"
                    ? element.dataset.bn
                    : element.dataset.en;
        });
}


/* ==========================================================
   6. LIVE TIME & DATE
   ========================================================== */

function updateLiveDateTime() {

    const now = new Date();

    let hours = now.getHours();
    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12 || 12;

    const timeText =
        `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

    const dateText =
        `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    const timeElement =
        document.getElementById("liveTimeDisplay");

    const dateElement =
        document.getElementById("liveDateDisplay");

    if (timeElement) {
        timeElement.innerText = timeText;
    }

    if (dateElement) {
        dateElement.innerText = dateText;
    }
}


/* ==========================================================
   7. LOGOUT
   ========================================================== */

function handleLogout() {

    const confirmLogout =
        confirm("আপনি কি লগআউট করতে চান?");

    if (!confirmLogout) return;

    localStorage.removeItem(
        "logged_in_user_email"
    );

    window.location.href =
        "login.html";
}


/* ==========================================================
   8. PROFILE DROPDOWN
   ========================================================== */

function toggleProfileDropdown(event) {

    if (event) {
        event.stopPropagation();
    }

    const menu =
        document.getElementById(
            "profilePopupMenu"
        );

    if (!menu) return;

    menu.classList.toggle("show");
}


window.addEventListener("click", function () {

    const menu =
        document.getElementById(
            "profilePopupMenu"
        );

    if (menu) {
        menu.classList.remove("show");
    }
});


function openMyPersonalProfile(event) {

    if (event) {
        event.stopPropagation();
    }

    alert(
        "প্রোফাইল সেটিংস মডিউল পরবর্তী ধাপে যুক্ত করা হবে।"
    );
}


/* ==========================================================
   9. CARD NAME
   ========================================================== */

function loadCardNames() {

    for (let i = 1; i <= 4; i++) {

        const savedName =
            localStorage.getItem(
                `card${i}_custom_name`
            );

        const titleElement =
            document.getElementById(
                `cardTitle${i}`
            );

        if (
            savedName &&
            titleElement
        ) {
            titleElement.innerText =
                savedName;
        }
    }
}


function editCardTitle(event, button) {

    if (event) {
        event.stopPropagation();
    }

    const card =
        button?.closest(".stat-card");

    if (!card) return;

    const title =
        card.querySelector(
            ".card-title-text"
        );

    if (!title) return;

    const cardId =
        title.id.replace(
            "cardTitle",
            ""
        );

    const currentName =
        title.innerText.trim();

    const newName =
        prompt(
            "কার্ডের নতুন নাম লিখুন:",
            currentName
        );

    if (
        newName === null ||
        newName.trim() === ""
    ) {
        return;
    }

    const cleanName =
        newName.trim();

    title.innerText = cleanName;

    localStorage.setItem(
        `card${cardId}_custom_name`,
        cleanName
    );
}


/*
   পুরোনো function name-ও রাখা হলো,
   যাতে HTML-এর অন্য জায়গা থেকে call হলেও
   error না হয়।
*/

function editCardName(event, cardId) {

    if (event) {
        event.stopPropagation();
    }

    const title =
        document.getElementById(
            `cardTitle${cardId}`
        );

    if (!title) return;

    const currentName =
        title.innerText;

    const newName =
        prompt(
            "কার্ডের নতুন নাম লিখুন:",
            currentName
        );

    if (
        newName === null ||
        newName.trim() === ""
    ) {
        return;
    }

    title.innerText =
        newName.trim();

    localStorage.setItem(
        `card${cardId}_custom_name`,
        newName.trim()
    );
}


/* ==========================================================
   10. MAIN CARD OPEN
   ========================================================== */

function openCardNewTab(
    event,
    cardId = 1
) {

    if (
        event &&
        event.target.closest(".card-edit-btn")
    ) {
        return;
    }

    const title =
        document.getElementById(
            `cardTitle${cardId}`
        );

    const cardName =
        title?.innerText ||
        `কার্ড নম্বর ${cardId}`;

    const mainContent =
        document.getElementById(
            "mainContentArea"
        );

    if (!mainContent) return;

    renderInnerDashboard(
        cardId,
        cardName
    );
}


/* ==========================================================
   11. INNER DASHBOARD
   ========================================================== */

function renderInnerDashboard(
    cardId,
    cardName
) {

    const mainContent =
        document.getElementById(
            "mainContentArea"
        );

    if (!mainContent) return;

    const body =
        document.getElementById(
            "bodyTheme"
        ) ||
        document.body;

    const isDarkMode =
        body.classList.contains(
            "dark-mode"
        );

    const bgCard =
        isDarkMode
            ? "#1e293b"
            : "#ffffff";

    const bgSubCard =
        isDarkMode
            ? "#0f172a"
            : "#f8fafc";

    const textColor =
        isDarkMode
            ? "#ffffff"
            : "#0f172a";

    const textMuted =
        isDarkMode
            ? "#94a3b8"
            : "#64748b";

    const borderColor =
        isDarkMode
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.15)";

    const tableHeaderBg =
        isDarkMode
            ? "#0f172a"
            : "#f1f5f9";

    const hoverShadow =
        isDarkMode
            ? "0 8px 25px rgba(0,0,0,0.6)"
            : "0 8px 25px rgba(0,0,0,0.12)";

    const today =
        getTodayInputDate();

    mainContent.innerHTML = `

        <style>

            .inner-dashboard-wrapper {
                min-height: 100vh;
                box-sizing: border-box;
                font-family:
                    'Segoe UI',
                    Tahoma,
                    Geneva,
                    Verdana,
                    sans-serif;
            }

            .hover-lift-effect {
                cursor: pointer;
                transition:
                    all 0.3s
                    cubic-bezier(
                        0.4,
                        0,
                        0.2,
                        1
                    );
            }

            .hover-lift-effect:hover {
                transform:
                    translateY(-3px);
                box-shadow:
                    ${hoverShadow};
                filter:
                    brightness(1.08);
            }

            .hover-row-effect:hover {
                background-color:
                    ${
                        isDarkMode
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)"
                    };
            }

            .exact-inner-input {
                background:
                    ${bgCard} !important;
                color:
                    ${textColor} !important;
                border:
                    1px solid
                    ${borderColor} !important;
            }

            .bold-sheet-text {
                font-weight: 700 !important;
                color:
                    ${textColor} !important;
            }

            .box-styled-cell {
                border:
                    1px solid
                    ${borderColor} !important;

                background:
                    ${
                        isDarkMode
                            ? "rgba(255,255,255,0.02)"
                            : "#ffffff"
                    } !important;

                border-radius: 6px;
                padding: 10px !important;

                transition:
                    all 0.2s ease;
            }

            .excel-editable-cell {
                min-width: 80px;
                outline: none;
            }

            .excel-editable-cell:focus {
                outline:
                    2px solid
                    #2563eb !important;

                background-color:
                    ${
                        isDarkMode
                            ? "rgba(37,99,235,0.2)"
                            : "rgba(37,99,235,0.08)"
                    } !important;

                border-color:
                    #2563eb !important;
            }

            @media (max-width: 900px) {

                .inner-stat-grid {
                    grid-template-columns:
                        1fr !important;
                }

                .inner-control-area {
                    flex-direction:
                        column !important;
                    align-items:
                        stretch !important;
                }

                .inner-table-wrapper {
                    overflow-x:
                        auto !important;
                }

                #innerDataTable {
                    min-width:
                        850px;
                }
            }

            @media print {

                body * {
                    visibility:
                        hidden;
                }

                #printableSheetArea,
                #printableSheetArea * {
                    visibility:
                        visible;
                }

                #printableSheetArea {
                    position:
                        absolute;

                    left:
                        0;

                    top:
                        0;

                    width:
                        100%;

                    background:
                        ${isDarkMode
                            ? "#0f172a"
                            : "#ffffff"} !important;

                    color:
                        ${textColor} !important;

                    padding:
                        20px;
                }

                .no-print {
                    display:
                        none !important;
                }
            }

        </style>


        <div
            class="inner-dashboard-wrapper"
            style="
                padding:20px;
                color:${textColor};
                background-color:
                    ${isDarkMode
                        ? "#0f172a"
                        : "#f1f5f9"};
                min-height:100vh;
            "
            data-card-id="${cardId}"
        >

            <!-- TOP BAR -->

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                    flex-wrap:wrap;
                    gap:15px;
                "
            >

                <button
                    onclick="goBackToMainDashboard()"
                    class="hover-lift-effect"
                    style="
                        background:#ef4444;
                        border:none;
                        color:white;
                        padding:10px 18px;
                        border-radius:8px;
                        font-weight:600;
                    "
                >
                    ⬅️ হোম পেইজে যান
                </button>


                <div
                    style="
                        position:relative;
                        width:280px;
                    "
                >

                    <span
                        style="
                            position:absolute;
                            left:12px;
                            top:50%;
                            transform:
                                translateY(-50%);
                            color:${textMuted};
                        "
                    >
                        🔍
                    </span>

                    <input
                        type="text"
                        id="liveSearchInput"
                        onkeyup="filterTableSearch()"
                        placeholder="আইটেম সার্চ করুন..."
                        class="exact-inner-input"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:
                                10px
                                12px
                                10px
                                36px;
                            border-radius:8px;
                            outline:none;
                        "
                    >

                </div>

            </div>


            <!-- DATE + BUTTON AREA -->

            <div
                class="inner-control-area"
                style="
                    background:${bgCard};
                    border:
                        1px solid
                        ${borderColor};
                    padding:
                        15px 20px;
                    border-radius:12px;
                    display:flex;
                    justify-content:
                        space-between;
                    align-items:center;
                    margin-bottom:20px;
                    flex-wrap:wrap;
                    gap:15px;
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        flex-wrap:wrap;
                    "
                >

                    <div
                        style="
                            background:${bgSubCard};
                            padding:6px 12px;
                            border-radius:6px;
                            border:
                                1px solid
                                ${borderColor};
                        "
                    >
                        <span
                            style="
                                color:${textMuted};
                                font-weight:600;
                                font-size:12px;
                            "
                        >
                            ফ্রম ডেট:
                        </span>

                        <input
                            type="date"
                            id="fromDateInput"
                            value="${today}"
                            onchange="onDateRangeChangeReload()"
                            class="exact-inner-input"
                            style="
                                border:none;
                                outline:none;
                                font-size:12px;
                            "
                        >
                    </div>


                    <div
                        style="
                            background:${bgSubCard};
                            padding:6px 12px;
                            border-radius:6px;
                            border:
                                1px solid
                                ${borderColor};
                        "
                    >
                        <span
                            style="
                                color:${textMuted};
                                font-weight:600;
                                font-size:12px;
                            "
                        >
                            টু ডেট:
                        </span>

                        <input
                            type="date"
                            id="toDateInput"
                            value="${today}"
                            onchange="onDateRangeChangeReload()"
                            class="exact-inner-input"
                            style="
                                border:none;
                                outline:none;
                                font-size:12px;
                            "
                        >
                    </div>

                </div>


                <div
                    style="
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                    "
                >

                    <button
                        onclick="saveAndResetToToday(${cardId})"
                        class="hover-lift-effect"
                        style="
                            background:#059669;
                            border:none;
                            color:white;
                            padding:7px 14px;
                            border-radius:6px;
                        "
                    >
                        🔄 রিফ্রেশ ও টুডে
                    </button>

                    <button
                        onclick="printSheetData()"
                        class="hover-lift-effect"
                        style="
                            background:#7c3aed;
                            border:none;
                            color:white;
                            padding:7px 14px;
                            border-radius:6px;
                        "
                    >
                        🖨️ প্রিন্ট
                    </button>

                    <button
                        onclick="exportToExcel()"
                        class="hover-lift-effect"
                        style="
                            background:#16a34a;
                            border:none;
                            color:white;
                            padding:7px 14px;
                            border-radius:6px;
                        "
                    >
                        📊 এক্সেল
                    </button>

                    <button
                        onclick="exportToPDF()"
                        class="hover-lift-effect"
                        style="
                            background:#dc2626;
                            border:none;
                            color:white;
                            padding:7px 14px;
                            border-radius:6px;
                        "
                    >
                        📄 পিডিএফ
                    </button>

                </div>

            </div>


            <!-- PRINT AREA -->

            <div
                id="printableSheetArea"
                style="
                    padding:10px;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:
                            space-between;
                        align-items:center;
                        margin-bottom:15px;
                    "
                >

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                        "
                    >

                        <span
                            id="innerCardTitleDisplay"
                            class="bold-sheet-text"
                        >
                            ${escapeHTML(cardName)}
                        </span>

                        <button
                            onclick="editInnerCardTitle(${cardId})"
                            class="hover-lift-effect no-print"
                            style="
                                background:#2563eb;
                                border:none;
                                color:white;
                                padding:4px 10px;
                                border-radius:4px;
                            "
                        >
                            ✏️ এডিট
                        </button>

                    </div>


                    <button
                        onclick="openMasterSetupModal(${cardId})"
                        class="hover-lift-effect no-print"
                        style="
                            background:#0284c7;
                            border:none;
                            color:white;
                            padding:8px 14px;
                            border-radius:6px;
                        "
                    >
                        ⚙️ মাস্টার আইটেম লিস্ট সেটআপ
                    </button>

                </div>


                <!-- STAT BOXES -->

                <div
                    class="inner-stat-grid"
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,1fr);
                        gap:15px;
                        margin-bottom:20px;
                    "
                >

                    <div
                        class="box-styled-cell"
                        style="
                            background:${bgCard};
                            padding:18px;
                            position:relative;
                        "
                    >

                        <div
                            id="statBox1Top"
                            style="
                                font-size:12px;
                                color:${textMuted};
                            "
                        >
                            মোট এন্ট্রি
                        </div>

                        <div
                            id="statBox1Main"
                            style="
                                font-size:26px;
                                font-weight:700;
                                color:#38bdf8;
                            "
                        >
                            0
                        </div>

                        <div
                            id="statBox1Sub"
                            style="
                                font-size:12px;
                                color:#38bdf8;
                            "
                        >
                            টি আইটেম
                        </div>

                        <span
                            onclick="editStatBoxTopLabel(1)"
                            class="no-print"
                            style="
                                position:absolute;
                                top:15px;
                                right:15px;
                                background:#2563eb;
                                color:white;
                                padding:4px 8px;
                                border-radius:4px;
                                cursor:pointer;
                            "
                        >
                            ✏️
                        </span>

                    </div>


                    <div
                        class="box-styled-cell"
                        style="
                            background:${bgCard};
                            padding:18px;
                            position:relative;
                        "
                    >

                        <div
                            id="statBox2Top"
                            style="
                                font-size:12px;
                                color:${textMuted};
                            "
                        >
                            মোট টাকার হিসাব
                        </div>

                        <div
                            id="statBox2Main"
                            style="
                                font-size:26px;
                                font-weight:700;
                                color:#fbbf24;
                            "
                        >
                            ৳0
                        </div>

                        <div
                            id="statBox2Sub"
                            style="
                                font-size:12px;
                                color:${textMuted};
                            "
                        >
                            মোট টাকার পরিমাণ
                        </div>

                        <span
                            onclick="editStatBoxTopLabel(2)"
                            class="no-print"
                            style="
                                position:absolute;
                                top:15px;
                                right:15px;
                                background:#2563eb;
                                color:white;
                                padding:4px 8px;
                                border-radius:4px;
                                cursor:pointer;
                            "
                        >
                            ✏️
                        </span>

                    </div>


                    <div
                        class="box-styled-cell"
                        style="
                            background:${bgCard};
                            padding:18px;
                            position:relative;
                        "
                    >

                        <div
                            id="statBox3Top"
                            style="
                                font-size:12px;
                                color:${textMuted};
                            "
                        >
                            মোট কেজি
                        </div>

                        <div
                            id="statBox3Main"
                            style="
                                font-size:26px;
                                font-weight:700;
                                color:#10b981;
                            "
                        >
                            0 কেজি
                        </div>

                        <div
                            id="statBox3Sub"
                            style="
                                font-size:12px;
                                color:${textMuted};
                            "
                        >
                            মোট পরিমাণ
                        </div>

                        <span
                            onclick="editStatBoxTopLabel(3)"
                            class="no-print"
                            style="
                                position:absolute;
                                top:15px;
                                right:15px;
                                background:#2563eb;
                                color:white;
                                padding:4px 8px;
                                border-radius:4px;
                                cursor:pointer;
                            "
                        >
                            ✏️
                        </span>

                    </div>

                </div>


                <!-- DATA TABLE -->

                <div
                    class="inner-table-wrapper"
                    style="
                        background:${bgCard};
                        border:
                            1px solid
                            ${borderColor};
                        border-radius:12px;
                        overflow:auto;
                        margin-bottom:20px;
                    "
                >

                    <table
                        id="innerDataTable"
                        style="
                            width:100%;
                            border-collapse:
                                separate;
                            border-spacing:4px;
                            text-align:center;
                            font-size:13px;
                        "
                    >

                        <thead>

                            <tr
                                style="
                                    background:
                                        ${tableHeaderBg};
                                    color:
                                        ${textMuted};
                                "
                            >

                                <th class="box-styled-cell">
                                    আইটেম নাম্বার
                                </th>

                                <th class="box-styled-cell">
                                    তারিখ
                                </th>

                                <th class="box-styled-cell">
                                    নাম
                                </th>

                                <th class="box-styled-cell">
                                    মোট পরিমাণ (কেজি)
                                </th>

                                <th class="box-styled-cell">
                                    মোট টাকা
                                </th>

                                <th class="box-styled-cell">
                                    প্রতি কেজি
                                </th>

                                <th class="box-styled-cell">
                                    মোট মূল্য
                                </th>

                                <th
                                    class="
                                        box-styled-cell
                                        no-print
                                    "
                                >
                                    <button
                                        onclick="
                                            addRowToTable(${cardId})
                                        "
                                        style="
                                            background:#16a34a;
                                            border:none;
                                            color:white;
                                            padding:4px 10px;
                                            border-radius:4px;
                                        "
                                    >
                                        + নতুন রো
                                    </button>
                                </th>

                            </tr>

                        </thead>

                        <tbody
                            id="innerTableBody"
                            style="
                                color:${textColor};
                            "
                        >
                        </tbody>

                    </table>

                </div>

            </div>


            <!-- PAGINATION -->

            <div
                class="no-print"
                style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    font-size:13px;
                    color:${textMuted};
                "
            >

                <span>
                    প্রতি পেজে আইটেম দেখুন:
                </span>

                <select
                    id="itemsPerPageSelect"
                    onchange="changePaginationRows()"
                    class="exact-inner-input"
                    style="
                        padding:5px 10px;
                        border-radius:6px;
                    "
                >

                    <option
                        value="All"
                        selected
                    >
                        All (সব)
                    </option>

                    <option value="10">
                        ১০
                    </option>

                    <option value="20">
                        ২০
                    </option>

                    <option value="50">
                        ৫০
                    </option>

                    <option value="100">
                        ১০০
                    </option>

                </select>

            </div>

        </div>


        <!-- MASTER MODAL -->

        <div
            id="masterSetupModal"
            style="
                display:none;
                position:fixed;
                inset:0;
                width:100%;
                height:100%;
                background:
                    rgba(0,0,0,0.6);
                z-index:9999;
                justify-content:center;
                align-items:center;
            "
        >

            <div
                style="
                    background:${bgCard};
                    border:
                        1px solid
                        ${borderColor};
                    width:500px;
                    max-width:90%;
                    border-radius:12px;
                    padding:25px;
                    box-shadow:
                        0 10px 30px
                        rgba(0,0,0,0.5);
                "
            >

                <div
                    style="
                        font-size:18px;
                        font-weight:700;
                        color:${textColor};
                        margin-bottom:10px;
                    "
                >
                    ⚙️ মাস্টার আইটেম লিস্ট সেটআপ
                </div>

                <p
                    style="
                        font-size:12px;
                        color:${textMuted};
                        line-height:1.5;
                    "
                >
                    প্রতি লাইনে একটি করে আইটেমের নাম লিখুন।
                    সেভ করলে নতুন তারিখে এগুলো অটোমেটিক
                    চলে আসবে।
                </p>

                <textarea
                    id="masterItemsTextarea"
                    rows="8"
                    class="exact-inner-input"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:12px;
                        border-radius:8px;
                        outline:none;
                        resize:vertical;
                        margin-bottom:20px;
                    "
                ></textarea>

                <div
                    style="
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                    "
                >

                    <button
                        onclick="closeMasterSetupModal()"
                        style="
                            background:#64748b;
                            border:none;
                            color:white;
                            padding:8px 16px;
                            border-radius:6px;
                        "
                    >
                        বাতিল
                    </button>

                    <button
                        onclick="
                            saveMasterItemsList(${cardId})
                        "
                        style="
                            background:#10b981;
                            border:none;
                            color:white;
                            padding:8px 16px;
                            border-radius:6px;
                        "
                    >
                        সেভ করুন
                    </button>

                </div>

            </div>

        </div>

    `;

    loadSheetDataForDateRange(cardId);
}


/* ==========================================================
   12. BACK TO MAIN DASHBOARD
   ========================================================== */

function goBackToMainDashboard() {
    location.reload();
}


/* ==========================================================
   13. MASTER ITEM LIST
   ========================================================== */

function getDefaultMasterItems() {

    return [
        "পুকুরের শিং মাছ",
        "গুলসা টেংরা মাছ",
        "পোয়া মাছ",
        "নদীর বাটা মাছ",
        "মলা মাছ",
        "গুঁতুম মাছ",
        "হাওরের মিশ্র পচিমশালী মাছ"
    ];
}


function openMasterSetupModal(cardId) {

    const textarea =
        document.getElementById(
            "masterItemsTextarea"
        );

    const modal =
        document.getElementById(
            "masterSetupModal"
        );

    if (!textarea || !modal) return;

    let masterNames;

    try {

        masterNames =
            JSON.parse(
                localStorage.getItem(
                    `master_items_list_card_${cardId}`
                )
            );

    } catch (error) {

        masterNames = null;
    }

    if (
        !Array.isArray(masterNames) ||
        masterNames.length === 0
    ) {
        masterNames =
            getDefaultMasterItems();
    }

    textarea.value =
        masterNames.join("\n");

    modal.style.display =
        "flex";
}


function closeMasterSetupModal() {

    const modal =
        document.getElementById(
            "masterSetupModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}


function saveMasterItemsList(cardId) {

    const textarea =
        document.getElementById(
            "masterItemsTextarea"
        );

    if (!textarea) return;

    const items =
        textarea.value
            .split("\n")
            .map(item => item.trim())
            .filter(item => item !== "");

    if (items.length === 0) {

        alert(
            "দয়া করে অন্তত একটি আইটেমের নাম লিখুন!"
        );

        return;
    }

    localStorage.setItem(
        `master_items_list_card_${cardId}`,
        JSON.stringify(items)
    );

    closeMasterSetupModal();

    loadSheetDataForDateRange(cardId);

    alert(
        "মাস্টার আইটেম লিস্ট সফলভাবে আপডেট হয়েছে।"
    );
}


/* ==========================================================
   14. DATE RANGE
   ========================================================== */

function onDateRangeChangeReload() {

    const container =
        document.querySelector(
            ".inner-dashboard-wrapper"
        );

    const cardId =
        parseInt(
            container?.dataset.cardId
        ) || 1;

    loadSheetDataForDateRange(cardId);
}


function getStorageKeyForDate(
    dateString,
    cardId
) {

    return `sheet_data_card_${cardId}_${dateString}`;
}


/* ==========================================================
   15. LOAD SHEET DATA
   ========================================================== */

function loadSheetDataForDateRange(cardId) {

    const fromInput =
        document.getElementById(
            "fromDateInput"
        );

    const toInput =
        document.getElementById(
            "toDateInput"
        );

    const tbody =
        document.getElementById(
            "innerTableBody"
        );

    if (
        !fromInput ||
        !toInput ||
        !tbody
    ) {
        return;
    }

    const fromDateStr =
        fromInput.value;

    const toDateStr =
        toInput.value;

    if (
        !fromDateStr ||
        !toDateStr
    ) {
        return;
    }

    const fromDate =
        new Date(
            `${fromDateStr}T00:00:00`
        );

    const toDate =
        new Date(
            `${toDateStr}T00:00:00`
        );

    if (fromDate > toDate) {

        alert(
            "ফ্রম ডেট, টু ডেটের চেয়ে বড় হতে পারে না!"
        );

        return;
    }


    let masterNames;

    try {

        masterNames =
            JSON.parse(
                localStorage.getItem(
                    `master_items_list_card_${cardId}`
                )
            );

    } catch (error) {

        masterNames = null;
    }

    if (
        !Array.isArray(masterNames) ||
        masterNames.length === 0
    ) {
        masterNames =
            getDefaultMasterItems();
    }


    const allDaysData = [];

    const currentDate =
        new Date(fromDate);


    while (
        currentDate <= toDate
    ) {

        const year =
            currentDate.getFullYear();

        const month =
            String(
                currentDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                currentDate.getDate()
            ).padStart(2, "0");

        const rawDate =
            `${year}-${month}-${day}`;

        const displayDate =
            `${day}/${month}/${year}`;

        const storageKey =
            getStorageKeyForDate(
                rawDate,
                cardId
            );

        let savedDayData = null;

        try {

            savedDayData =
                JSON.parse(
                    localStorage.getItem(
                        storageKey
                    )
                );

        } catch (error) {

            savedDayData = null;
        }


        if (
            !Array.isArray(savedDayData)
        ) {

            savedDayData =
                masterNames.map(
                    (name, index) => ({
                        id: index + 1,
                        date: displayDate,
                        rawDate: rawDate,
                        name: name,
                        kg: "",
                        taka: "",
                        perKg: "0.00",
                        totalPrice: "0",
                        isCustom: false
                    })
                );

        } else {

            savedDayData =
                savedDayData.map(
                    (item, index) => ({
                        id:
                            item.id ||
                            index + 1,

                        date:
                            displayDate,

                        rawDate:
                            rawDate,

                        name:
                            item.name ||
                            "",

                        kg:
                            item.kg ||
                            "",

                        taka:
                            item.taka ||
                            "",

                        perKg:
                            item.perKg ||
                            "0.00",

                        totalPrice:
                            item.totalPrice ||
                            "0",

                        isCustom:
                            Boolean(
                                item.isCustom
                            )
                    })
                );
        }


        allDaysData.push(
            ...savedDayData
        );


        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }


    /*
       যেসব row-তে data আছে,
       সেগুলো উপরে দেখানো হবে।
    */

    allDaysData.sort(
        (a, b) => {

            const aHasValue =
                (
                    parseFloat(a.kg) > 0
                ) ||
                (
                    parseFloat(a.taka) > 0
                ) ||
                a.isCustom;

            const bHasValue =
                (
                    parseFloat(b.kg) > 0
                ) ||
                (
                    parseFloat(b.taka) > 0
                ) ||
                b.isCustom;

            if (
                aHasValue &&
                !bHasValue
            ) {
                return -1;
            }

            if (
                !aHasValue &&
                bHasValue
            ) {
                return 1;
            }

            return 0;
        }
    );


    tbody.innerHTML = "";


    allDaysData.forEach(
        (rowObj, index) => {

            const tr =
                document.createElement("tr");

            tr.className =
                "hover-row-effect";

            tr.dataset.rawDate =
                rowObj.rawDate;

            tr.dataset.isCustom =
                rowObj.isCustom
                    ? "true"
                    : "false";


            tr.innerHTML = `

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        row-serial-number
                    "
                >
                    ${index + 1}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                    "
                >
                    ${escapeHTML(rowObj.date)}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        excel-editable-cell
                    "
                    contenteditable="true"
                    oninput="
                        autoSaveCurrentSheet()
                    "
                    onkeydown="
                        handleExcelArrowKeys(
                            event,
                            this
                        )
                    "
                >
                    ${escapeHTML(rowObj.name)}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        excel-editable-cell
                    "
                    contenteditable="true"
                    onfocus="
                        clearZeroOnFocus(this)
                    "
                    onblur="
                        restoreZeroOnBlur(this)
                    "
                    oninput="
                        calculateRow(this);
                        autoSaveCurrentSheet();
                    "
                    onkeydown="
                        handleExcelArrowKeys(
                            event,
                            this
                        )
                    "
                >
                    ${escapeHTML(rowObj.kg)}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        excel-editable-cell
                    "
                    contenteditable="true"
                    onfocus="
                        clearZeroOnFocus(this)
                    "
                    onblur="
                        restoreZeroOnBlur(this)
                    "
                    oninput="
                        calculateRow(this);
                        autoSaveCurrentSheet();
                    "
                    onkeydown="
                        handleExcelArrowKeys(
                            event,
                            this
                        )
                    "
                >
                    ${escapeHTML(rowObj.taka)}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        row-per-kg
                    "
                >
                    ${escapeHTML(rowObj.perKg)}
                </td>

                <td
                    class="
                        box-styled-cell
                        bold-sheet-text
                        row-total-price
                    "
                >
                    ${escapeHTML(rowObj.totalPrice)}
                </td>

                <td
                    class="
                        box-styled-cell
                        no-print
                    "
                >
                    <button
                        onclick="
                            deleteTableRow(this)
                        "
                        class="
                            hover-lift-effect
                        "
                        style="
                            background:#dc2626;
                            border:none;
                            color:white;
                            padding:
                                4px 10px;
                            border-radius:4px;
                        "
                    >
                        ডিলিট
                    </button>
                </td>

            `;

            tbody.appendChild(tr);
        }
    );


    changePaginationRows();
    updateAutoCalculations();
}


/* ==========================================================
   16. ZERO INPUT
   ========================================================== */

function clearZeroOnFocus(cell) {

    if (
        cell.innerText.trim() === "0"
    ) {
        cell.innerText = "";
    }
}


function restoreZeroOnBlur(cell) {

    /*
       এখানে blank-কে 0 করা হচ্ছে না।
       কারণ user চাইলে blank রাখতে পারবে।
    */

    if (
        cell.innerText.trim() === ""
    ) {
        cell.innerText = "";
    }
}


/* ==========================================================
   17. EXCEL ARROW NAVIGATION
   ========================================================== */

function handleExcelArrowKeys(
    event,
    currentCell
) {

    const allowedKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter"
    ];

    if (
        !allowedKeys.includes(
            event.key
        )
    ) {
        return;
    }

    event.preventDefault();

    const currentRow =
        currentCell.parentElement;

    const tbody =
        currentRow.parentElement;

    const rows =
        Array.from(
            tbody.rows
        );

    const rowIndex =
        rows.indexOf(
            currentRow
        );

    const cells =
        Array.from(
            currentRow.cells
        );

    const cellIndex =
        cells.indexOf(
            currentCell
        );

    let targetCell = null;


    if (
        event.key === "ArrowDown" ||
        event.key === "Enter"
    ) {

        if (
            rowIndex + 1 <
            rows.length
        ) {
            targetCell =
                rows[
                    rowIndex + 1
                ].cells[
                    cellIndex
                ];
        }

    } else if (
        event.key === "ArrowUp"
    ) {

        if (
            rowIndex - 1 >= 0
        ) {
            targetCell =
                rows[
                    rowIndex - 1
                ].cells[
                    cellIndex
                ];
        }

    } else if (
        event.key === "ArrowRight"
    ) {

        if (
            cellIndex + 1 <
            cells.length
        ) {
            targetCell =
                cells[
                    cellIndex + 1
                ];
        }

    } else if (
        event.key === "ArrowLeft"
    ) {

        if (
            cellIndex - 1 >= 0
        ) {
            targetCell =
                cells[
                    cellIndex - 1
                ];
        }
    }


    if (
        targetCell &&
        targetCell.getAttribute(
            "contenteditable"
        ) === "true"
    ) {

        targetCell.focus();

        const range =
            document.createRange();

        const selection =
            window.getSelection();

        range.selectNodeContents(
            targetCell
        );

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(range);
    }
}


/* ==========================================================
   18. CALCULATE ROW
   ========================================================== */

function calculateRow(inputCell) {

    const row =
        inputCell.closest("tr");

    if (!row) return;

    const cells =
        row.querySelectorAll("td");

    if (cells.length < 7) return;


    const totalKg =
        parseFloat(
            cells[3].innerText
        ) || 0;

    const totalTaka =
        parseFloat(
            cells[4].innerText
        ) || 0;


    const perKgCell =
        cells[5];

    const totalPriceCell =
        cells[6];


    const perKgPrice =
        totalKg > 0
            ? totalTaka / totalKg
            : 0;


    perKgCell.innerText =
        perKgPrice > 0
            ? perKgPrice.toFixed(2)
            : "0.00";


    totalPriceCell.innerText =
        totalTaka > 0
            ? totalTaka
            : "0";
}


/* ==========================================================
   19. AUTO SAVE
   ========================================================== */

function autoSaveCurrentSheet() {

    const container =
        document.querySelector(
            ".inner-dashboard-wrapper"
        );

    if (!container) return;

    const cardId =
        parseInt(
            container.dataset.cardId
        ) || 1;


    const rows =
        document.querySelectorAll(
            "#innerTableBody tr"
        );

    const dateMap = {};


    rows.forEach(row => {

        const rawDate =
            row.dataset.rawDate;

        if (!rawDate) return;


        const isCustom =
            row.dataset.isCustom ===
            "true";


        const cells =
            row.querySelectorAll("td");


        if (cells.length < 7) {
            return;
        }


        const itemName =
            cells[2].innerText.trim();

        const kgVal =
            cells[3].innerText.trim();

        const takaVal =
            cells[4].innerText.trim();

        const perKgVal =
            cells[5].innerText.trim();

        const totalPriceVal =
            cells[6].innerText.trim();


        const hasValue =
            (
                parseFloat(kgVal) > 0
            ) ||
            (
                parseFloat(takaVal) > 0
            );


        /*
           শুধুমাত্র data থাকা row
           অথবা custom row save হবে।
        */

        if (
            !hasValue &&
            !isCustom
        ) {
            return;
        }


        if (!dateMap[rawDate]) {
            dateMap[rawDate] = [];
        }


        dateMap[rawDate].push({

            id:
                dateMap[rawDate].length + 1,

            name:
                itemName,

            kg:
                kgVal,

            taka:
                takaVal,

            perKg:
                perKgVal,

            totalPrice:
                totalPriceVal,

            isCustom:
                isCustom

        });

    });


    const fromInput =
        document.getElementById(
            "fromDateInput"
        );

    const toInput =
        document.getElementById(
            "toDateInput"
        );


    if (
        !fromInput ||
        !toInput
    ) {
        return;
    }


    const fromDate =
        new Date(
            `${fromInput.value}T00:00:00`
        );

    const toDate =
        new Date(
            `${toInput.value}T00:00:00`
        );


    const currentDate =
        new Date(fromDate);


    while (
        currentDate <= toDate
    ) {

        const year =
            currentDate.getFullYear();

        const month =
            String(
                currentDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                currentDate.getDate()
            ).padStart(2, "0");


        const dateKey =
            `${year}-${month}-${day}`;


        const storageKey =
            getStorageKeyForDate(
                dateKey,
                cardId
            );


        if (
            dateMap[dateKey] &&
            dateMap[dateKey].length
        ) {

            localStorage.setItem(
                storageKey,
                JSON.stringify(
                    dateMap[dateKey]
                )
            );

        } else {

            localStorage.removeItem(
                storageKey
            );
        }


        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }


    updateAutoCalculations();
}


/* ==========================================================
   20. AUTO STAT CALCULATIONS
   ========================================================== */

function updateAutoCalculations() {

    const rows =
        document.querySelectorAll(
            "#innerTableBody tr"
        );

    let totalActiveEntries = 0;
    let totalKgSum = 0;
    let totalTakaSum = 0;


    rows.forEach(row => {

        if (
            row.style.display === "none"
        ) {
            return;
        }


        const cells =
            row.querySelectorAll("td");


        if (cells.length < 5) {
            return;
        }


        const itemName =
            cells[2].innerText.trim();

        const kgVal =
            parseFloat(
                cells[3].innerText
            ) || 0;

        const takaVal =
            parseFloat(
                cells[4].innerText
            ) || 0;


        if (
            itemName !== "" &&
            (
                kgVal > 0 ||
                takaVal > 0
            )
        ) {

            totalActiveEntries++;

            totalKgSum +=
                kgVal;

            totalTakaSum +=
                takaVal;
        }

    });


    const statBox1Main =
        document.getElementById(
            "statBox1Main"
        );

    const statBox1Sub =
        document.getElementById(
            "statBox1Sub"
        );


    if (statBox1Main) {
        statBox1Main.innerText =
            totalActiveEntries;
    }

    if (statBox1Sub) {
        statBox1Sub.innerText =
            "টি আইটেম";
    }


    const statBox2Main =
        document.getElementById(
            "statBox2Main"
        );

    const statBox2Sub =
        document.getElementById(
            "statBox2Sub"
        );


    if (statBox2Main) {

        statBox2Main.innerText =
            `৳${totalTakaSum.toFixed(2)}`;
    }

    if (statBox2Sub) {
        statBox2Sub.innerText =
            "মোট টাকার পরিমাণ";
    }


    const statBox3Main =
        document.getElementById(
            "statBox3Main"
        );

    const statBox3Sub =
        document.getElementById(
            "statBox3Sub"
        );


    if (statBox3Main) {

        statBox3Main.innerText =
            `${totalKgSum.toFixed(2)} কেজি`;
    }

    if (statBox3Sub) {
        statBox3Sub.innerText =
            "মোট পরিমাণ";
    }
}


/* ==========================================================
   21. PAGINATION
   ========================================================== */

function changePaginationRows() {

    const select =
        document.getElementById(
            "itemsPerPageSelect"
        );

    if (!select) return;

    const limitValue =
        select.value;

    const rows =
        document.querySelectorAll(
            "#innerTableBody tr"
        );


    rows.forEach(
        (row, index) => {

            if (
                limitValue === "All"
            ) {

                row.style.display =
                    "";

            } else {

                const limit =
                    parseInt(
                        limitValue
                    );

                row.style.display =
                    index < limit
                        ? ""
                        : "none";
            }
        }
    );


    updateAutoCalculations();
}


/* ==========================================================
   22. RESET TO TODAY
   ========================================================== */

function saveAndResetToToday(cardId) {

    autoSaveCurrentSheet();


    const today =
        getTodayInputDate();


    const fromInput =
        document.getElementById(
            "fromDateInput"
        );

    const toInput =
        document.getElementById(
            "toDateInput"
        );


    if (fromInput) {
        fromInput.value =
            today;
    }

    if (toInput) {
        toInput.value =
            today;
    }


    loadSheetDataForDateRange(
        cardId
    );


    alert(
        "ডাটা সফলভাবে সেভ হয়েছে এবং Today শিটে রিফ্রেশ করা হয়েছে।"
    );
}


/* ==========================================================
   23. PRINT / PDF
   ========================================================== */

function printSheetData() {
    window.print();
}


function exportToPDF() {

    alert(
        'Print dialog থেকে "Save as PDF" নির্বাচন করুন।'
    );

    window.print();
}


/* ==========================================================
   24. EXPORT CSV / EXCEL
   ========================================================== */

function exportToExcel() {

    const table =
        document.getElementById(
            "innerDataTable"
        );

    if (!table) {
        alert(
            "এক্সপোর্ট করার মতো কোনো টেবিল পাওয়া যায়নি।"
        );
        return;
    }


    const csv = [];


    for (
        let i = 0;
        i < table.rows.length;
        i++
    ) {

        const row = [];

        const columns =
            table.rows[i]
                .querySelectorAll(
                    "td, th"
                );


        for (
            let j = 0;
            j < columns.length - 1;
            j++
        ) {

            if (
                columns[j]
                    .classList
                    .contains("no-print")
            ) {
                continue;
            }


            const data =
                columns[j]
                    .innerText
                    .replace(
                        /(\r\n|\n|\r)/gm,
                        " "
                    )
                    .replace(
                        /"/g,
                        '""'
                    );


            row.push(
                `"${data}"`
            );
        }


        csv.push(
            row.join(",")
        );
    }


    const csvFile =
        new Blob(
            [
                "\uFEFF" +
                csv.join("\n")
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const downloadLink =
        document.createElement(
            "a"
        );


    const fromDate =
        document.getElementById(
            "fromDateInput"
        )?.value ||
        getTodayInputDate();


    const toDate =
        document.getElementById(
            "toDateInput"
        )?.value ||
        getTodayInputDate();


    downloadLink.download =
        `hisab_kitab_${fromDate}_to_${toDate}.csv`;


    downloadLink.href =
        URL.createObjectURL(
            csvFile
        );


    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
        downloadLink
    );


    setTimeout(() => {

        URL.revokeObjectURL(
            downloadLink.href
        );

    }, 1000);
}


/* ==========================================================
   25. LIVE TABLE SEARCH
   ========================================================== */

function filterTableSearch() {

    const input =
        document.getElementById(
            "liveSearchInput"
        );

    if (!input) return;


    const searchText =
        input.value
            .trim()
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#innerTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.innerText
                .toLowerCase();


        row.style.display =
            text.includes(
                searchText
            )
                ? ""
                : "none";
    });


    updateAutoCalculations();
}


/* ==========================================================
   26. ADD NEW ROW
   ========================================================== */

function addRowToTable(cardId) {

    const tbody =
        document.getElementById(
            "innerTableBody"
        );

    const fromDate =
        document.getElementById(
            "fromDateInput"
        )?.value;


    if (
        !tbody ||
        !fromDate
    ) {
        return;
    }


    const formattedDate =
        formatDisplayDate(
            fromDate
        );


    const tr =
        document.createElement(
            "tr"
        );


    tr.className =
        "hover-row-effect";


    tr.dataset.rawDate =
        fromDate;


    tr.dataset.isCustom =
        "true";


    tr.innerHTML = `

        <td
            class="
                box-styled-cell
                bold-sheet-text
                row-serial-number
            "
        >
            1
        </td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
            "
        >
            ${formattedDate}
        </td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
                excel-editable-cell
            "
            contenteditable="true"
            oninput="
                autoSaveCurrentSheet()
            "
            onkeydown="
                handleExcelArrowKeys(
                    event,
                    this
                )
            "
        >
            নতুন আইটেম
        </td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
                excel-editable-cell
            "
            contenteditable="true"
            onfocus="
                clearZeroOnFocus(this)
            "
            onblur="
                restoreZeroOnBlur(this)
            "
            oninput="
                calculateRow(this);
                autoSaveCurrentSheet();
            "
            onkeydown="
                handleExcelArrowKeys(
                    event,
                    this
                )
            "
        ></td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
                excel-editable-cell
            "
            contenteditable="true"
            onfocus="
                clearZeroOnFocus(this)
            "
            onblur="
                restoreZeroOnBlur(this)
            "
            oninput="
                calculateRow(this);
                autoSaveCurrentSheet();
            "
            onkeydown="
                handleExcelArrowKeys(
                    event,
                    this
                )
            "
        ></td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
                row-per-kg
            "
        >
            0.00
        </td>

        <td
            class="
                box-styled-cell
                bold-sheet-text
                row-total-price
            "
        >
            0
        </td>

        <td
            class="
                box-styled-cell
                no-print
            "
        >

            <button
                onclick="
                    deleteTableRow(this)
                "
                style="
                    background:#dc2626;
                    border:none;
                    color:white;
                    padding:
                        4px 10px;
                    border-radius:4px;
                "
            >
                ডিলিট
            </button>

        </td>

    `;


    tbody.insertBefore(
        tr,
        tbody.firstChild
    );


    autoSaveCurrentSheet();

    updateAutoCalculations();
}


/* ==========================================================
   27. DELETE ROW
   ========================================================== */

function deleteTableRow(btn) {

    const row =
        btn?.closest("tr");

    if (!row) return;


    const confirmDelete =
        confirm(
            "আপনি কি এই আইটেমটি ডিলিট করতে চান?"
        );


    if (!confirmDelete) {
        return;
    }


    row.remove();

    autoSaveCurrentSheet();

    changePaginationRows();
}


/* ==========================================================
   28. INNER CARD TITLE EDIT
   ========================================================== */

function editInnerCardTitle(cardId) {

    const title =
        document.getElementById(
            "innerCardTitleDisplay"
        );

    if (!title) return;


    const currentName =
        title.innerText;


    const newName =
        prompt(
            "কার্ডের নতুন নাম লিখুন:",
            currentName
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {
        return;
    }


    const cleanName =
        newName.trim();


    title.innerText =
        cleanName;


    const mainCardTitle =
        document.getElementById(
            `cardTitle${cardId}`
        );


    if (mainCardTitle) {

        mainCardTitle.innerText =
            cleanName;
    }


    localStorage.setItem(
        `card${cardId}_custom_name`,
        cleanName
    );
}


/* ==========================================================
   29. STAT BOX LABEL EDIT
   ========================================================== */

function editStatBoxTopLabel(
    boxNumber
) {

    const element =
        document.getElementById(
            `statBox${boxNumber}Top`
        );


    if (!element) return;


    const currentText =
        element.innerText;


    const newText =
        prompt(
            "ওপরের লেবেল পরিবর্তন করুন:",
            currentText
        );


    if (
        newText === null ||
        newText.trim() === ""
    ) {
        return;
    }


    element.innerText =
        newText.trim();
}


/* ==========================================================
   30. CUSTOM SIDEBAR FILES
   ========================================================== */

function getCustomFiles() {

    try {

        const files =
            JSON.parse(
                localStorage.getItem(
                    "custom_dashboard_files"
                )
            );

        return Array.isArray(files)
            ? files
            : [];

    } catch (error) {

        return [];
    }
}


function saveCustomFiles(files) {

    localStorage.setItem(
        "custom_dashboard_files",
        JSON.stringify(files)
    );
}


function renderSidebarFiles() {

    const container =
        document.getElementById(
            "sidebarFilesContainer"
        );

    if (!container) return;


    const files =
        getCustomFiles();


    if (files.length === 0) {

        container.innerHTML = `
            <div
                style="
                    padding:10px;
                    opacity:0.7;
                    font-size:13px;
                "
            >
                📁 কোনো কাস্টম ফাইল নেই।
            </div>
        `;

        return;
    }


    container.innerHTML =
        files.map(
            (file, index) => `

                <div
                    class="sidebar-file-item"
                    data-file-index="${index}"
                    onclick="
                        openCustomSidebarFile(
                            ${index}
                        )
                    "
                >
                    📁
                    ${escapeHTML(file.name)}
                </div>

            `
        ).join("");
}


function addNewCustomFile() {

    const fileName =
        prompt(
            "নতুন ফাইলের নাম লিখুন:"
        );


    if (
        fileName === null ||
        fileName.trim() === ""
    ) {
        return;
    }


    const files =
        getCustomFiles();


    files.push({

        id:
            Date.now(),

        name:
            fileName.trim(),

        createdAt:
            new Date().toISOString()

    });


    saveCustomFiles(
        files
    );


    renderSidebarFiles();


    alert(
        "নতুন ফাইল সফলভাবে যোগ হয়েছে।"
    );
}


function openCustomSidebarFile(
    index
) {

    const files =
        getCustomFiles();


    const file =
        files[index];


    if (!file) return;


    alert(
        `"${file.name}" ফাইলটি পরবর্তী ধাপে পূর্ণ হিসাব মডিউলের সাথে যুক্ত করা হবে।`
    );
}


/* ==========================================================
   31. RIGHT CLICK CONTEXT MENU
   ========================================================== */

let selectedContextFileIndex =
    null;


function handleCardRightClick(
    event,
    element
) {

    event.preventDefault();

    const cardTitle =
        element.querySelector(
            ".card-title-text"
        );


    if (!cardTitle) {
        return;
    }


    selectedContextFileIndex =
        cardTitle.id;


    const menu =
        document.getElementById(
            "customContextMenu"
        );


    if (!menu) return;


    menu.style.display =
        "block";


    menu.style.left =
        `${event.pageX}px`;


    menu.style.top =
        `${event.pageY}px`;
}


function closeContextMenu() {

    const menu =
        document.getElementById(
            "customContextMenu"
        );


    if (menu) {

        menu.style.display =
            "none";
    }
}


function renameFilePrompt() {

    closeContextMenu();


    if (
        !selectedContextFileIndex
    ) {
        return;
    }


    const title =
        document.getElementById(
            selectedContextFileIndex
        );


    if (!title) return;


    const currentName =
        title.innerText;


    const newName =
        prompt(
            "নতুন নাম লিখুন:",
            currentName
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {
        return;
    }


    title.innerText =
        newName.trim();


    const cardId =
        selectedContextFileIndex
            .replace(
                "cardTitle",
                ""
            );


    localStorage.setItem(
        `card${cardId}_custom_name`,
        newName.trim()
    );
}


function deleteFileAction() {

    closeContextMenu();


    if (
        !selectedContextFileIndex
    ) {
        return;
    }


    const title =
        document.getElementById(
            selectedContextFileIndex
        );


    if (!title) return;


    const confirmDelete =
        confirm(
            "আপনি কি এই কার্ডটি ডিলিট করতে চান?"
        );


    if (!confirmDelete) {
        return;
    }


    const card =
        title.closest(
            ".stat-card"
        );


    if (card) {

        card.style.display =
            "none";
    }


    const cardId =
        selectedContextFileIndex
            .replace(
                "cardTitle",
                ""
            );


    localStorage.removeItem(
        `card${cardId}_custom_name`
    );
}


window.addEventListener(
    "click",
    closeContextMenu
);


/* ==========================================================
   32. MAIN SEARCH
   ========================================================== */

function setupMainSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        function () {

            const value =
                input.value
                    .trim()
                    .toLowerCase();


            document
                .querySelectorAll(
                    ".stat-card"
                )
                .forEach(card => {

                    const text =
                        card.innerText
                            .toLowerCase();

                    if (
                        card.classList.contains(
                            "placeholder-card"
                        )
                    ) {
                        return;
                    }


                    card.style.display =
                        text.includes(value)
                            ? ""
                            : "none";
                });
        }
    );
}


/* ==========================================================
   33. INITIALIZE WEBSITE
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSavedTheme();

        loadSavedLanguage();

        loadSavedHeaderLogo();

        loadHeaderUserData();

        loadCardNames();

        renderSidebarFiles();

        setupMainSearch();

        updateLiveDateTime();


        setInterval(
            updateLiveDateTime,
            1000
        );

    }
);