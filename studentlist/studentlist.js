// ==========================================================
// 1. INITIAL DATA AND GLOBAL VARIABLES
// ==========================================================

// TODO: Google Apps Script API-এর Web App URL-টি এখানে বসাতে হবে।
const GOOGLE_APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywiC-3y1AxpwYuy4-9nFJgFTR7Yx-Xe0uJssfZIt9CqGIiZV1gDYuQRwpEaqFooVum/exec"; 

// Local Fallback Data: যদি API থেকে ডেটা লোড না হয়, তবে এই ডেটা ব্যবহার করা হবে।
// 💡 মোট ৮টি কার্ড দেখার জন্য এখানে ৬টি অতিরিক্ত ডামি ডেটা যোগ করা হলো
const initialStudentData = [
    { roll: 1, name: "Student 01 (Team 1)", initials: "S1", batch: "WDD 15", team: "1", course: "Web Design & Development", id: "FIT-WDD-1501", email: "example@mail.com", phone: "017xxxxxxxx", linkedin: "https://linkedin.com/user", facebook: "https://facebook.com/user", github: "#", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "https://fiverr.com/", upwork: "https://upwork.com/", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Active" },
    { roll: 2, name: "Student 02 (Team 1)", initials: "S2", batch: "WDD 15", team: "1", course: "Web Design & Development", id: "FIT-WDD-1502", email: "example@mail.com", phone: "017xxxxxxxx", linkedin: "https://linkedin.com/user", facebook: "https://facebook.com/user", github: "#", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "https://fiverr.com/", upwork: "https://upwork.com/", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Active" },
    
    // 👇 অতিরিক্ত ৬টি ডামি এন্ট্রি যোগ করা হলো
    { roll: 3, name: "Student 03 (Team 2)", initials: "S3", batch: "WDD 15", team: "2", course: "Web Design & Development", id: "FIT-WDD-1503", email: "ex3@mail.com", phone: "017xxxxxxxx", linkedin: "https://linkedin.com/user3", facebook: "#", github: "https://github.com/user3", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "#", upwork: "https://upwork.com/", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Active" },
    { roll: 4, name: "Student 04 (Team 2)", initials: "S4", batch: "WDD 15", team: "2", course: "Web Design & Development", id: "FIT-WDD-1504", email: "ex4@mail.com", phone: "017xxxxxxxx", linkedin: "#", facebook: "https://facebook.com/user4", github: "#", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "https://fiverr.com/", upwork: "#", extra_field_1: "Certificate: Ongoing", extra_field_2: "Status: Active" },
    { roll: 5, name: "Student 05 (Team 3)", initials: "S5", batch: "WDD 15", team: "3", course: "Web Design & Development", id: "FIT-WDD-1505", email: "ex5@mail.com", phone: "017xxxxxxxx", linkedin: "https://linkedin.com/user5", facebook: "https://facebook.com/user5", github: "https://github.com/user5", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "https://fiverr.com/", upwork: "https://upwork.com/", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Pending" },
    { roll: 6, name: "Student 06 (Team 3)", initials: "S6", batch: "WDD 15", team: "3", course: "Web Design & Development", id: "FIT-WDD-1506", email: "ex6@mail.com", phone: "017xxxxxxxx", linkedin: "#", facebook: "https://facebook.com/user6", github: "#", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "img/FIT-WDD-1506.jpg", fiverr: "#", upwork: "https://upwork.com/", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Inactive" },
    { roll: 7, name: "Student 07 (Team 4)", initials: "S7", batch: "WDD 15", team: "4", course: "Web Design & Development", id: "FIT-WDD-1507", email: "ex7@mail.com", phone: "017xxxxxxxx", linkedin: "https://linkedin.com/user7", facebook: "https://facebook.com/user7", github: "https://github.com/user7", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "https://fiverr.com/", upwork: "#", extra_field_1: "Certificate: Completed", extra_field_2: "Status: Active" },
    { roll: 8, name: "Student 08 (Team 4)", initials: "S8", batch: "WDD 15", team: "4", course: "Web Design & Development", id: "FIT-WDD-1508", email: "ex8@mail.com", phone: "017xxxxxxxx", linkedin: "#", facebook: "#", github: "https://github.com/user8", indeed: "#", freelancer: "#", institute_name: "FREEDOM IT INSTITUTIONS", profileimage: "", fiverr: "#", upwork: "https://upwork.com/", extra_field_1: "Certificate: Ongoing", extra_field_2: "Status: Active" },
];

// গ্লোবাল স্টুডেন্ট লিস্ট (রেন্ডার করার জন্য ব্যবহৃত হয়)
let studentList = []; 
// মূল, আনফিল্টারড ডেটা সংরক্ষণের জন্য মাস্টার কপি
let globalStudentDataMaster = []; 

let currentAdminMode = false;
let customFieldCounter = 0; 
let editingRoll = null; // যে রোল নম্বরটি এডিট করা হচ্ছে, তা ট্র্যাক করবে
let isEditing = false; // এডিট মোড চালু আছে কিনা


// ==========================================================
// 1. UTILITY FUNCTIONS (Section 1) - UPDATED
// ==========================================================

// Utility function to check if a value is meaningful (not null/empty/placeholder)
const isValidValue = (value) => {
    if (value === null || value === undefined) return false;
    const trimmedValue = value.toString().trim();
    // Check for common placeholders
    return trimmedValue !== '' && trimmedValue !== '#' && trimmedValue !== '-';
};

// Utility function to get the display value or 'N/A'
const getDisplayValue = (student, key) => {
    const value = student[key];
    return isValidValue(value) ? value : 'N/A';
};

// Utility function for search (returns lowercase string or '')
const getStringValue = (student, key) => {
    const value = student[key];
    return value ? value.toString().toLowerCase() : '';
};

// ==========================================================
// 2. ASYNCHRONOUS DATA FETCHING & PERSISTENCE
// ==========================================================

/**
 * Google Apps Script Web App থেকে ডেটা Fetch করার ফাংশন। (GET)
 * @returns {Promise<boolean>} ডেটা লোড সফল হলে true, অন্যথায় false.
 */
async function fetchData() {
    try {
        console.log("Fetching data from Google Sheet API...");
        const response = await fetch(GOOGLE_APP_SCRIPT_URL + '?action=getStudents'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.status === 'SUCCESS' && Array.isArray(data.students)) {
            // ✅ সফলতা: দুটি ভ্যারিয়েবলই আপডেট হচ্ছে
            studentList = data.students; 
            globalStudentDataMaster = data.students; 
            console.log(`Data fetched successfully. Total students: ${studentList.length}`);
            return true;
        } else {
            // ✅ ফলব্যাক: API ডেটা না পেলে Local Fallback দিয়ে দুটি ভ্যারিয়েবলই আপডেট হচ্ছে
            console.warn("API returned invalid data structure. Using local fallback.");
            studentList = initialStudentData;
            globalStudentDataMaster = initialStudentData; 
            return false;
        }

    } catch (error) {
        // ✅ Error: নেটওয়ার্ক বা অন্য কোনো সমস্যায় Local Fallback দিয়ে দুটি ভ্যারিয়েবলই আপডেট হচ্ছে
        console.error("Error fetching data from Apps Script. Using local fallback:", error);
        studentList = initialStudentData;
        globalStudentDataMaster = initialStudentData; 
        return false;
    }
}

// ==========================================================
// 3. API UTILITY: Apps Script-এর সাথে ডেটা কমিউনিকেশন
// ==========================================================

async function updateSheetData(data, action, roll = null) {
    const webAppUrl = GOOGLE_APP_SCRIPT_URL; 
    
    // বাটন নিয়ন্ত্রণ (ডাবল সাবমিশন ঠেকাতে)
    const form = document.getElementById('addStudentForm') || document.getElementById('editStudentForm');
    const saveButton = form ? form.querySelector('.save') : null;

    if (saveButton && saveButton.disabled) return; 

    if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveButton.disabled = true;
    }

    const payload = {
        action: action, 
        data: data,     
        roll: roll      
    };

    try {
        await fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload), 
        });

        console.log(`Request sent: ${action}`);
        alert("সফলভাবে সম্পন্ন হয়েছে!");
        
        // ৩ সেকেন্ড পর পেজ রিফ্রেশ হবে যাতে ডাটা লোড হতে সময় পায়
        setTimeout(() => {
            location.reload();
        }, 2000);

        return { status: 'SUCCESS' };

    } catch (error) {
        console.error('API Error:', error);
        alert(`Failed to communicate with Google Sheet API: ${error.message}`);
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = 'Save';
        }
    }
}

// ==========================================================
// 4. INITIAL SETUP
// ==========================================================

async function initApp() {
    try {
        const loadSuccess = await fetchData(); 
        
        if (typeof renderStudentList === 'function') {
            renderStudentList(studentList);
        }
        if (typeof toggleAdminButtons === 'function') {
            toggleAdminButtons(currentAdminMode);
        }
        if (typeof updateSlider === 'function') {
            updateSlider(); 
        }
        
        if (!loadSuccess) {
            console.warn("App initialized with local fallback data.");
        }
    } catch (error) {
        console.error("App Initialization failed:", error);
    }
}

// এটি নিশ্চিত করে যে পেজ লোড হলে অ্যাপ শুরু হবে
document.addEventListener('DOMContentLoaded', initApp);



// ==========================================================
// 5. RENDERING FUNCTIONS (Section 5) - CORRECTED & CLEANED
// ==========================================================

// Generates the HTML for the profile picture (initials or image) - NO INLINE STYLE
function getProfileHtml(student) {
    const defaultImage = "img/default.jpg"; 
    const studentId = student.id ? student.id.toString().trim() : null; 
    const imageIdPath = (studentId && studentId !== '') 
                        ? `img/${studentId}.jpg`
                        : null;
    
    let finalImageSrc = student.profileimage; 

    if (!isValidValue(student.profileimage) && imageIdPath) {
        finalImageSrc = imageIdPath;
    }

    // ✅ পরিবর্তন: শুধু HTML স্ট্রাকচার রাখা হলো, CSS দিয়ে বৃত্তাকার করা হবে।
    if (finalImageSrc && finalImageSrc !== '#') {
        return `
            <div class="profile-img-container">
                <img src="${finalImageSrc}" alt="${student.name}'s Profile" class="profile-img-tag" onerror="this.onerror=null; this.src='${defaultImage}'">
            </div>
        `;
    } else {
         const initials = (student.name || 'NN').split(' ').map(n => (n[0] || '').toUpperCase()).join('').slice(0, 2);
        return `
            <div class="profile-img-container">
                <div class="profile-initials">${initials}</div>
            </div>
        `;
    }
}

function renderStudentList(students, headerText = null) {
    // 💡 ফিক্স: কন্টেইনার ID 'studentListContainer' থেকে 'studentList' এ পরিবর্তন করা হলো।
    const container = document.getElementById('studentList'); 
    
    if (!container) {
        console.error("HTML container 'studentList' not found. Rendering failed."); 
        return;
    }
    
    // ... (বাকি কোড অপরিবর্তিত) ...
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = `<div class="no-results">No students found matching your criteria.</div>`;
        return;
    }
    
    // 💡 টপ টিম ফিল্টার বার তৈরি
    if (headerText) {
        const topBarHtml = `
            <div class="top-team-filter-bar">
                <h2>${headerText} Students List</h2>
            </div>
        `;
        container.innerHTML += topBarHtml;
    }

    // Group students by 'team' (Team Number)
    const groupedByTeam = students.reduce((acc, student) => {
        const team = student.team ? student.team.trim() : ''; 
        if (team && team.toLowerCase() !== 'unknown team') { 
            if (!acc[team]) {
                acc[team] = [];
            }
            acc[team].push(student);
        }
        return acc;
    }, {});

    // Render each team section
    Object.keys(groupedByTeam).sort((a, b) => {
        
        if (a === 'Unknown Team') return 1;
        if (b === 'Unknown Team') return -1;
        
        const valA = a.replace(/[^0-9]/g, ''); 
        const valB = b.replace(/[^0-9]/g, ''); 

        const numA = parseInt(valA) || Infinity;
        const numB = parseInt(valB) || Infinity;
        
        return numA - numB; 
    }).forEach(team => {
        const teamStudents = groupedByTeam[team];

    // 🚀 লিডারের ছবি নির্ধারণের লজিক
        let leader1Image = 'images/default_leader.jpg'; 
        let leader2Image = 'images/default_leader.jpg'; 
        const teamNumber = team.replace(/[^0-9]/g, ''); 

        switch (teamNumber) {
            case '1': 
                leader1Image = 'img/FIT-WDD-1523.jpg'; 
                leader2Image = 'img/FIT-WDD-1501.jpg'; 
                break;
            case '2': 
                leader1Image = 'img/FIT-WDD-1555.jpg';
                break;
            case '3': 
                leader1Image = 'img/FIT-WDD-1553.jpg';
                break;
            case '4': 
                leader1Image = 'img/FIT-WDD-1517.jpg';
                break;
            default:
                break;
        }

        // 💡 ডাইনামিক লিডার ইমেজ HTML (টিম ১ হলে ২ জন, অন্যথায় ১ জন)
        let leadersHtml = `<img src="${leader1Image}" alt="Team ${team} Leader 1" class="leader-profile-img leader-1">`;
        if (teamNumber === '1') {
            leadersHtml += `<img src="${leader2Image}" alt="Team ${team} Leader 2" class="leader-profile-img leader-2">`;
        }

        // 1. Team Header তৈরি
        const headerHtml = `
            <div class="team-section-header">
                <div class="team-header-info">
                    <h1>${team}</h1> 
                    <span class="team-count">(${teamStudents.length} Members)</span>
                </div>
                <div class="team-leaders-images">
                    ${leadersHtml}
                </div>
            </div>
        `;
        container.innerHTML += headerHtml;

       // 2. Card Grid for the team
        let cardGridHtml = '<div class="card-grid">';
        
        teamStudents.forEach(student => {
            const studentRoll = student.roll ? student.roll : 'N/A';
            const studentName = student.name ? student.name.trim() : 'MISSING NAME DATA'; 

            // কার্ডের ভেতরের HTML
            cardGridHtml += `
                <div class="card" data-roll="${studentRoll}">
                    
                    ${typeof getProfileHtml === 'function' ? getProfileHtml(student) : '<div class="profile-image-placeholder"></div>'}

                    <div class="student-info">
                        <div>
                            <p class="student-roll">Roll: ${studentRoll}</p>
                            <h3 class="student-name">${studentName}</h3>
                            </div>

                        <div class="social-icons">
                                ${isValidValue(student.linkedin) ? `<a href="${student.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                                ${isValidValue(student.facebook) ? `<a href="${student.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook-square"></i></a>` : ''}
                                ${isValidValue(student.github) ? `<a href="${student.github}" target="_blank" title="GitHub"><i class="fab fa-github-square"></i></a>` : ''}
                                
                                ${isValidValue(student.fiverr) ? 
                                    `<a href="${student.fiverr}" target="_blank" title="Fiverr">
                                        <img src="logoimg/fiverr.png" alt="Fiverr Logo" class="social-logo">
                                    </a>` : ''
                                }
                                ${isValidValue(student.upwork) ? 
                                    `<a href="${student.upwork}" target="_blank" title="Upwork">
                                        <img src="logoimg/upwork.png" alt="Upwork Logo" class="social-logo">
                                    </a>` : ''
                                }
                                
                                ${isValidValue(student.indeed) ? `<a href="${student.indeed}" target="_blank" title="Indeed"><i class="fas fa-file-alt"></i></a>` : ''}
                                ${isValidValue(student.freelancer) ? `<a href="${student.freelancer}" target="_blank" title="Freelancer"><i class="fas fa-globe"></i></a>` : ''}
                            </div>
                        
                        <div class="card-buttons">
                            <button class="open" onclick="openDetailsModal(${studentRoll})"><i class="fas fa-eye"></i> View Details</button>
                            ${currentAdminMode ? `
                                <button class="edit" onclick="openEditModal(${studentRoll})"><i class="fas fa-edit"></i> Edit</button>
                                <button class="delete" onclick="deleteStudent(${studentRoll})"><i class="fas fa-trash-alt"></i> Delete</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        cardGridHtml += '</div>';
        container.innerHTML += cardGridHtml;
    });
        
    // Ensure admin buttons are hidden/shown correctly after render
    toggleAdminButtons(currentAdminMode);
}

// ==========================================================
// 6. SEARCH, FILTER, REFRESH
// ==========================================================

// Handles search input (called by button click)
function checkinput() {
    
    // 1. ইনপুট ডেটা সংগ্রহ
    const inputElement = document.getElementById('input');
    const searchTerm = inputElement ? inputElement.value.toLowerCase().trim() : '';
    
    // যদি সার্চ টার্ম খালি হয়, তাহলে কোনো ফল দেখানো হবে না 
    if (searchTerm === '') {
        renderStudentList([]); 
        return;
    } 

    if (!globalStudentDataMaster || globalStudentDataMaster.length === 0) {  
        console.error("Error: Master data list is empty or not loaded. Cannot search.");
        renderStudentList([]);
        return;
    }
    
    // 🔑 সমাধান: সার্চ টার্মকে সংখ্যায় রূপান্তর করে শক্তিশালী Exact Match করা 
    const searchRollNumber = parseInt(searchTerm);
    const isNumericSearch = !isNaN(searchRollNumber);

    const exactRollMatch = globalStudentDataMaster.find(student => {
        // A. যদি সার্চটি একটি সংখ্যা হয়, তবে সংখ্যা হিসেবে কঠোরভাবে তুলনা করুন
        if (isNumericSearch) {
            const studentRollNumber = parseInt(student.roll);
            // studentRollNumber যদি বৈধ সংখ্যা হয় এবং searchRollNumber এর সাথে মেলে
            if (!isNaN(studentRollNumber) && studentRollNumber === searchRollNumber) {
                return true;
            }
        }
        // B. যদি সংখ্যা না হয়, তবে স্ট্রিং হিসেবে কঠোরভাবে তুলনা করুন
        return getStringValue(student, 'roll') === searchTerm;
    });


    if (exactRollMatch) {
        // যদি একটি সঠিক রোল ম্যাচ পাওয়া যায়, তবে ONLY সেই স্টুডেন্টকে রেন্ডার করুন
        renderStudentList([exactRollMatch]);
        return; // এখানেই ফাংশন শেষ
    }

    // 2. যদি কোনো হুবহু রোল ম্যাচ না পাওয়া যায়, তবে আংশিক মিলের জন্য সমস্ত ফিল্ড সার্চ করুন
    const searchResults = globalStudentDataMaster.filter(student => {
        
        // roll নম্বর চেক করার দরকার নেই, কারণ তা উপরেই হয়ে গেছে।
        
        const isPartialMatch = getStringValue(student, 'name').includes(searchTerm) || 
                               getStringValue(student, 'batch').includes(searchTerm) ||
                               getStringValue(student, 'team').includes(searchTerm) || 
                               getStringValue(student, 'course').includes(searchTerm) ||
                               getStringValue(student, 'id').includes(searchTerm) ||
                               getStringValue(student, 'phone').includes(searchTerm) || 
                               getStringValue(student, 'institute_name').includes(searchTerm) || 
                               getStringValue(student, 'email').includes(searchTerm); 
        
        return isPartialMatch;
    });

    // 3. ফিল্টার করা ডেটা রেন্ডার করা
    renderStudentList(searchResults);
} 

// Refreshes the list to show all students instantly
function refreshData() {
    // 1. সার্চ ইনপুট খালি করা
    const inputElement = document.getElementById('input');
    if (inputElement) {
        inputElement.value = '';
    } else {
        console.warn("Search input element with ID 'input' not found in refreshData.");
    }
    
    // 2. কোনো ফিল্টারিং ছাড়াই সম্পূর্ণ মাস্টার ডেটা রেন্ডার করা
    renderStudentList(globalStudentDataMaster); 
    
    console.log("Data refreshed instantly using local master copy.");
    
    // 3. Admin buttons ensure
    toggleAdminButtons(currentAdminMode);
    
    // 4. ব্যাকগ্রাউন্ডে নতুন ডেটা লোড করার চেষ্টা করা
    fetchData(); 
}

// Filters students by team number (called by Nav Dropdown)
function filterByTeam(teamNumber) {

    const displayHeader = `Team ${teamNumber}`;

    const filteredStudents = globalStudentDataMaster.filter(student => {

        const sheetValue = getStringValue(student, 'team');

        // 🛠️ লজিক: 'Team 1' বা '01' থেকে শুধু সংখ্যা বের করে সংখ্যায় রূপান্তর করা
        const teamNumFromSheet = parseInt(sheetValue.replace(/[^0-9]/g, ''));

        // সংখ্যা দিয়ে তুলনা করা (যেমন: 1 === 1)
        return teamNumFromSheet === teamNumber;
    });

    // Optionally update search input for clarity 
    const inputElement = document.getElementById('input');
    if (inputElement) {
        inputElement.value = displayHeader;
    }

    renderStudentList(filteredStudents, displayHeader);

    // 🚀 অটো-স্ক্রল লজিক
    const targetElement = document.getElementById('studentListContainer');

    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth', 
            block: 'start'      
        });
    } else {
        console.warn("Target element with ID 'studentListContainer' not found for scrolling.");
    }
}

// ==========================================================
// 7. ADMIN MODE TOGGLE 
// ==========================================================

function toggleAdminButtons(isAdmin) {
    // ১. এডিট, ডিলিট এবং অ্যাড ডাটা বাটনগুলো কন্ট্রোল করা
    const actionButtons = document.querySelectorAll('.edit, .delete, #addData, #copyData');
    actionButtons.forEach(button => {
        button.style.display = isAdmin ? 'inline-block' : 'none';
    });

    // ২. তোমার ২টা টগল বাটনকে একসাথে সিলেক্ট করা
    // এখানে '.admin-toggle-btn' ক্লাসটি দুটো বাটনেই আছে কিনা নিশ্চিত করো
    const allToggleBtns = document.querySelectorAll('.admin-toggle-btn');
    
    allToggleBtns.forEach(btn => {
        if (isAdmin) {
            btn.style.backgroundColor = '#f44336'; // লাল রঙ
            btn.innerHTML = '<i class="fas fa-user-lock"></i> Admin ON';
        } else {
            btn.style.backgroundColor = '#ffc107'; // হলুদ রঙ
            btn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Toggle';
        }
    });
}

function toggleAdminMode() {
    // যদি অ্যাডমিন মোড বর্তমানে অফ থাকে, তবে পাসওয়ার্ড চাইবে
    if (!currentAdminMode) {
        const password = prompt("অ্যাডমিন প্যানেলে প্রবেশের জন্য পাসওয়ার্ড দিন:");
        
        // এখানে তোমার পাসওয়ার্ড '1234' সেট করা আছে
        if (password === "1234") {
            currentAdminMode = true;
            alert("অ্যাডমিন মোড সক্রিয় হয়েছে!");
        } else {
            alert("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
            return; // পাসওয়ার্ড ভুল হলে নিচের কোড আর চলবে না
        }
    } else {
        // যদি অলরেডি অন থাকে, তবে সরাসরি অফ করে দেবে
        currentAdminMode = false;
        alert("অ্যাডমিন মোড বন্ধ করা হয়েছে।");
    }

    // মাস্টার ডেটা দিয়ে লিস্ট রি-রেন্ডার করা
    renderStudentList(globalStudentDataMaster);
    
    // বাটনগুলোর অবস্থা আপডেট করা (Action Bar এবং Admin Photo-র নিচের বাটন)
    toggleAdminButtons(currentAdminMode);
}

// ==========================================================
// 8. MODAL FUNCTIONS & DETAILS VIEW (FIXED)
// ==========================================================

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    if (modalId === 'addDataModal') {
        document.getElementById('addStudentForm').reset();
        clearCustomFields('add-custom-fields-container');
    } else if (modalId === 'editDataModal') {
        document.getElementById('editStudentForm').reset();
        clearCustomFields('edit-custom-fields-container');
    }
    // Only for dataEntryModal (if used)
    if (modalId === 'dataEntryModal') { 
        editingRoll = null;
        isEditing = false;
        const rollInput = document.getElementById('roll');
        if(rollInput) rollInput.disabled = false; // রোল ফিল্ড আবার এনাবেল করা
        // ফর্মে reset করার লজিক এখানে থাকলে যুক্ত হবে
    }
}

function openAddDataModal() {
    if (!currentAdminMode) {
        alert("You must be in Admin Mode to add data.");
        return;
    }
    document.getElementById('addDataModal').style.display = 'flex';
}

function openDetailsModal(roll) {
    // ✅ সংশোধন: মাস্টার কপি ব্যবহার
    const student = globalStudentDataMaster.find(s => s.roll == roll);
    if (!student) return;

    const modal = document.getElementById('detailsModal');
    const header = modal.querySelector('.modal-profile-header');
    const body = document.getElementById('studentDetailsBody');
    
    // Profile HTML (reused from getProfileHtml but with modal class)
    const profileHtml = getProfileHtml(student).replace('profile-img-container', 'profile-img-container-modal');
    
    // Roll and Name are displayed here (in the header)
    header.innerHTML = `
        ${profileHtml}
        <h2 style="color: #ffffff; margin-bottom: 5px;">${getDisplayValue(student, 'name')}</h2>
        <p style="color: #ffffff; font-weight: 700;">Roll: ${getDisplayValue(student, 'roll')} | ID: ${getDisplayValue(student, 'id')}</p>
    `;

    let bodyHtml = '';
    
    // Core Details
    // FIX: Using getDisplayValue() to show 'N/A' if empty/placeholder
    bodyHtml += `<p><strong>Batch:</strong> ${getDisplayValue(student, 'batch')}</p>`;
    bodyHtml += `<p><strong>Group:</strong> ${getDisplayValue(student, 'team')}</p>`; 
    bodyHtml += `<p><strong>Course:</strong> ${getDisplayValue(student, 'course')}</p>`;
    bodyHtml += `<p><strong>Institute:</strong> ${getDisplayValue(student, 'institute_name')}</p>`;

    // Contact Details (FIXED: Showing 'N/A' instead of hiding the line)
    
    // Email
    const email = student.email;
    bodyHtml += `<p><strong>Email:</strong> ${isValidValue(email) ? `<a href="mailto:${email}">${email}</a>` : 'N/A'}</p>`;
    
    // Phone
    const phone = student.phone;
    // FIX: Using <a href="tel:..." only if value is valid
    bodyHtml += `<p><strong>Phone:</strong> ${isValidValue(phone) ? `<a href="tel:${phone}">${phone}</a>` : 'N/A'}</p>`; 

    // Social Links (FIXED: Showing 'N/A' instead of hiding the line, using isValidValue)
    const linkedin = student.linkedin;
    bodyHtml += `<p><strong>LinkedIn:</strong> ${isValidValue(linkedin) ? `<a href="${linkedin}" target="_blank">View Profile</a>` : 'N/A'}</p>`;
    
    const facebook = student.facebook;
    bodyHtml += `<p><strong>Facebook:</strong> ${isValidValue(facebook) ? `<a href="${facebook}" target="_blank">View Profile</a>` : 'N/A'}</p>`;

    const github = student.github;
    bodyHtml += `<p><strong>GitHub:</strong> ${isValidValue(github) ? `<a href="${github}" target="_blank">View Profile</a>` : 'N/A'}</p>`;
    
    const freelancer = student.freelancer;
    bodyHtml += `<p><strong>Freelancer:</strong> ${isValidValue(freelancer) ? `<a href="${freelancer}" target="_blank">View Profile</a>` : 'N/A'}</p>`;
    
    const indeed = student.indeed;
    bodyHtml += `<p><strong>Indeed:</strong> ${isValidValue(indeed) ? `<a href="${indeed}" target="_blank">View Profile</a>` : 'N/A'}</p>`;

    const fiverr = student.fiverr; bodyHtml += `<p><strong>Fiverr:</strong> ${isValidValue(fiverr) ? `<a href="${fiverr}" target="_blank">View Profile</a>` : 'N/A'}</p>`;

    const upwork = student.upwork; bodyHtml += `<p><strong>Upwork:</strong> ${isValidValue(upwork) ? `<a href="${upwork}" target="_blank">View Profile</a>` : 'N/A'}</p>`;

    // Custom Fields
    const customFields = Object.keys(student).filter(key => key.startsWith('extra_field_') && isValidValue(student[key]));
    
    customFields.forEach(key => {
        const [label, value] = (student[key] || '').split(':').map(s => s.trim());
        if (isValidValue(label) && isValidValue(value)) {
            bodyHtml += `<p><strong>${label}:</strong> ${value}</p>`;
        }
    });

    body.innerHTML = bodyHtml;
    modal.style.display = 'flex';
}

// ==========================================================
// 9. CORE CRUD FUNCTIONS (Add, Edit, Delete)
// ==========================================================

// Utility function to get form data (আপনার দেওয়া লজিক)
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found.`);
        return {};
    }
    
    const formData = new FormData(form);
    const data = {};
    
    // FormData কে একটি সরল অবজেক্টে রূপান্তর করা হচ্ছে
    formData.forEach((value, key) => {
        data[key] = typeof value === 'string' ? value.trim() : value;
    });
    
    // Custom Fields Handling (যেমন: custom-key-1, custom-value-1)
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('custom-key-')) {
            const index = key.substring(11); 
            const valueKey = `custom-value-${index}`;
            const customValue = formData.get(valueKey);
            
            if (value.trim() !== '' && customValue.trim() !== '') {
                data[`extra_field_${index}`] = `${value.trim()}: ${customValue.trim()}`;
            }
        } 
        else if (!key.startsWith('custom-value-')) {
            data[key] = value.trim();
        }
    }
    
    // Clean up temporary custom field keys
    Object.keys(data).forEach(key => {
        if (key.startsWith('custom-key-') || key.startsWith('custom-value-')) {
            delete data[key];
        }
    });

    return data;
}

// **UPDATED: ASYNC saveStudentData (Used for both Add and Edit)**
async function saveStudentData(event) {
    event.preventDefault(); // ফর্ম সাবমিট হওয়া আটকানো

    // 1. ডেটা সংগ্রহ 
    const form = document.getElementById('addStudentForm'); // Add Modal Form ID
    const studentData = getFormData('addStudentForm');

    // 2. অ্যাকশন নির্ধারণ
    let action = 'add';
    let roll = studentData.roll; 

    if (!roll) {
        alert("Roll number is required.");
        return;
    }

    try {
        // API কল করা
        const response = await updateSheetData(studentData, action, roll);

        if (response.status === 'SUCCESS') {
            alert(`Student data successfully added!`);
            closeModal('addDataModal');
            // ... (এখানে ডেটা রিফ্রেশ করার লজিক)
            refreshData(); // সম্পূর্ণ তালিকা রিফ্রেশ করুন
        } else {
            throw new Error(response.message || "Unknown server error.");
        }
    } catch (error) {
        alert(`Failed to save data: ${error.message}.`);
        console.error("Save Data Error:", error);
    }
}


// **UPDATED: ASYNC updateStudentData**
async function updateStudentData(event) {
    event.preventDefault();

    try {
        const updatedData = getFormData('editStudentForm'); // Edit Modal Form ID
        const originalRoll = parseInt(document.getElementById('edit-originalRoll').value);

        // ✅ সংশোধন: মাস্টার লিস্টে ইন্ডেক্স খুঁজে বের করা
        const index = globalStudentDataMaster.findIndex(s => s.roll == originalRoll); // == to handle string/number

        if (index !== -1) {
            const oldStudent = globalStudentDataMaster[index];
            
            // Remove old extra fields before merging new ones
            const cleanOldStudent = Object.fromEntries(
                Object.entries(oldStudent).filter(([key]) => !key.startsWith('extra_field_'))
            );
            
            // Overwrite and update local master list
            const finalStudentData = {
                ...cleanOldStudent,
                ...updatedData,
                roll: originalRoll 
            };
            globalStudentDataMaster[index] = finalStudentData; // ✅ মাস্টার কপি আপডেট
            studentList = [...globalStudentDataMaster]; // Filtered List আপডেট

            // API update for persistence
            await updateSheetData(finalStudentData, 'update', originalRoll);

            alert(`Successfully updated student data for ${finalStudentData.name} (Roll: ${originalRoll}). Data pushed to Google Sheet.`);
            closeModal('editDataModal');
            renderStudentList(globalStudentDataMaster);
        } else {
            alert("Error: Student not found for update.");
        }
    } catch (e) {
        console.error("Update Data Error:", e);
        alert(`Failed to update data: ${e.message}.`);
    }
}

// **UPDATED: ASYNC deleteStudent**
async function deleteStudent(roll) {
    if (!currentAdminMode) {
        alert("You must be in Admin Mode to delete data.");
        return;
    }
    
    // ✅ সংশোধন: মাস্টার কপি ব্যবহার
    const student = globalStudentDataMaster.find(s => s.roll == roll);
    if (!student) return;

    if (confirm(`Are you sure you want to delete the data for ${student.name} (Roll: ${roll})? This action will also remove it from the Google Sheet.`)) {
        
        const index = globalStudentDataMaster.findIndex(s => s.roll == roll);
        if (index !== -1) {
            
            try {
                // 1. API update for persistence
                await updateSheetData(null, 'delete', roll);
                
                // 2. Local update (API সফল হলে লোকাল লিস্ট থেকে ডিলিট)
                globalStudentDataMaster.splice(index, 1); // ✅ মাস্টার কপি আপডেট
                studentList = [...globalStudentDataMaster]; // Filtered List আপডেট

                alert(`Successfully deleted student: ${student.name}. Data removed from Google Sheet.`);
                renderStudentList(globalStudentDataMaster);
            } catch (e) {
                // API error হলে লোকাল ডিলিট হবে না
                console.error("Delete Data Error:", e);
                alert(`Failed to delete data: ${e.message}. Check console.`);
            }
        }
    }
}


function openEditModal(roll) {
    if (!currentAdminMode) {
        alert("You must be in Admin Mode to edit data.");
        return;
    }

    // ✅ সংশোধন: মাস্টার কপি ব্যবহার
    const student = globalStudentDataMaster.find(s => s.roll == roll); 
    if (!student) return;

    // 1. Clear existing custom fields
    clearCustomFields('edit-custom-fields-container');
    
    // 2. Populate form fields
    document.getElementById('edit-originalRoll').value = student.roll; 
    
    for (const key in student) {
        const input = document.getElementById(`edit-${key}`);
        
        if (input) {
            if (key === 'roll') {
                 input.value = student[key];
                 input.disabled = true; // Roll cannot be changed
            } else {
                 input.value = student[key] || ''; 
            }
           
        } else if (key.startsWith('extra_field_') && isValidValue(student[key])) {
            // 3. Populate custom fields
            const [label, value] = (student[key] || '').split(':').map(s => s.trim());
            if (isValidValue(label) && isValidValue(value)) {
                addCustomField('editStudentForm', label, value); 
            }
        }
    }

    document.getElementById('editDataModal').style.display = 'flex';
}



// ==========================================================
// 10. CUSTOM FIELD UTILITIES
// ==========================================================

function addCustomField(formId, keyDefault = '', valueDefault = '') {
    const containerId = formId === 'addStudentForm' ? 'add-custom-fields-container' : 'edit-custom-fields-container';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error("Custom fields container not found for form:", formId);
        return;
    }
    customFieldCounter++;
    const index = customFieldCounter;
    
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'custom-field-group';
    fieldGroup.setAttribute('data-index', index);
    
    fieldGroup.innerHTML = `
        <input type="text" name="custom-key-${index}" placeholder="Field Label (e.g. Portfolio URL)" value="${keyDefault}" required>
        <input type="text" name="custom-value-${index}" placeholder="Value" value="${valueDefault}" required>
        <button type="button" class="remove-field-btn" onclick="removeCustomField(this)"><i class="fas fa-trash-alt"></i></button>
    `;
    
    container.appendChild(fieldGroup);
}

function removeCustomField(button) {
    const fieldGroup = button.closest('.custom-field-group');
    fieldGroup.remove();
}

function clearCustomFields(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Find the title/header element to preserve it
    const title = container.querySelector('.custom-fields-title');
    const titleHtml = title ? title.outerHTML : ''; 

    // Remove all children except the title/header
    let child = container.lastElementChild;
    while (child) {
        if (!child.classList.contains('custom-fields-title')) {
            container.removeChild(child);
            child = container.lastElementChild;
        } else {
            child = child.previousElementSibling;
        }
    }
    
    if (containerId === 'add-custom-fields-container') {
        customFieldCounter = 0; 
    }
}

// ==========================================================
// 11. CLIPBOARD UTILITIES
// ==========================================================

function copyUpdatedDataToClipboard() {
    if (!currentAdminMode) {
        alert("You must be in Admin Mode to copy data.");
        return;
    }
    
    try {
        const dataString = JSON.stringify(globalStudentDataMaster, null, 4); // ✅ মাস্টার কপি ব্যবহার
        navigator.clipboard.writeText(dataString).then(() => {
            alert("Successfully copied the updated student list (JSON format) to the clipboard!");
        }, () => {
            alert("Error: Could not copy text to clipboard. Please copy manually from the console.");
            console.log(dataString);
        });
    } catch (e) {
        alert("An error occurred during copying.");
        console.error(e);
    }
}

// ==========================================================
// 12. OTHER UTILITIES
// ==========================================================

function clearFieldById(id) {
    document.getElementById(id).value = '';
}

// ==========================================================
// 13. SLIDER LOGIC
// ==========================================================

let currentSlide = 0;
// NOTE: Assuming your HTML has elements with class 'slide' inside a container with class 'slider'
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function updateSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    const offset = -currentSlide * 100;
    slider.style.transform = `translateX(${offset}%)`;
}


// ==========================================================
// 14. EVENT LISTENERS & INITIALIZATION
// ==========================================================

// Initialize the app when the window finishes loading
// NOTE: This call starts the entire process (fetching data and rendering)
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Start the slider auto-play after initialization
    if (totalSlides > 1) { // Only run if there's more than one slide
        setInterval(nextSlide, 5000);
    }

    // Attach form submit listeners (if your HTML includes these forms)
    const addForm = document.getElementById('addStudentForm');
    if (addForm) {
        addForm.addEventListener('submit', saveStudentData);
    }
    const editForm = document.getElementById('editStudentForm');
    if (editForm) {
        editForm.addEventListener('submit', updateStudentData);
    }
    // Attach search button listener (assuming button has id='searchButton')
    const searchBtn = document.getElementById('searchButton');
    if(searchBtn) {
        searchBtn.addEventListener('click', checkinput);
    }
    // Attach refresh button listener (assuming button has id='refreshButton')
    const refreshBtn = document.getElementById('refreshButton');
    if(refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    // Attach admin toggle listener (assuming button has class='admin-toggle-btn')
    const adminToggleBtn = document.querySelector('.admin-toggle-btn');
    if(adminToggleBtn) {
        adminToggleBtn.addEventListener('click', toggleAdminMode);
    }

});
