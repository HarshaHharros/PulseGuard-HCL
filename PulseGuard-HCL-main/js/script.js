//Note - Comments are mentioned at each section to define functionality - Jonnnalagadda Sri Harsha
// navbar toggling
const navbarShowBtn = document.querySelector('.navbar-show-btn');
const navbarCollapseDiv = document.querySelector('.navbar-collapse');
const navbarHideBtn = document.querySelector('.navbar-hide-btn');

navbarShowBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.add('navbar-show');
});
navbarHideBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.remove('navbar-show');
});

// changing search icon image on window resize
window.addEventListener('resize', changeSearchIcon);
function changeSearchIcon(){
    let winSize = window.matchMedia("(min-width: 1200px)");
    if(winSize.matches){
        document.querySelector('.search-icon img').src = "images/search-icon.png";
    } else {
        document.querySelector('.search-icon img').src = "images/search-icon-dark.png";
    }
}
changeSearchIcon();

// stopping all animation and transition
let resizeTimer;
window.addEventListener('resize', () =>{
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});
// Hospital data based on location
const hospitalsByLocation = {
    Delhi: ['AIIMS Delhi', 'Fortis Hospital', 'Max Super Specialty Hospital'],
    Mumbai: ['Tata Memorial Hospital', 'Lilavati Hospital', 'Jaslok Hospital'],
    Chennai: ['Apollo Hospital', 'Fortis Malar Hospital', 'Sri Ramachandra Medical Center', 'K.M. Super Speciality Hospital'],
    Vizag: ['KGH', 'Visakha Institute of Medical Sciences', 'Fortis Hospital'],
    Bengaluru: ['Manipal Hospital', 'Narayana Health', 'Columbia Asia Hospital', 'St. John’s Medical College'],
    Hyderabad: ['Apollo Hospital', 'Yashoda Hospital', 'KIMS Hospital', 'NIMS'],
    Kolkata: ['AMRI Hospital', 'Fortis Hospital', 'Medica Superspecialty Hospital', 'Woodlands Hospital'],
    Pune: ['Jehangir Hospital', 'Ruby Hall Clinic', 'Sahyadri Hospital', 'Noble Hospital'],
    Ahmedabad: ['Sterling Hospital', 'Zydus Hospital', 'Apollo Hospital', 'Civil Hospital'],
    Jaipur: ['SMS Hospital', 'Fortis Escorts Hospital', 'Narayan Multispeciality Hospital', 'EHCC Hospital'],
    Lucknow: ['SGPGI', 'Medanta Hospital', 'Mayo Hospital', 'Apollo Medics Super Specialty Hospital']
};

// Function to update hospitals based on selected location
function updateHospitals() {
    const locationSelect = document.getElementById('location');
    const hospitalSelect = document.getElementById('hospital');
    const selectedLocation = locationSelect.value;

    // Clear previous hospital options
    hospitalSelect.innerHTML = '<option value="" disabled selected>Select hospital</option>';

    // Populate hospitals based on selected location
    if (selectedLocation && hospitalsByLocation[selectedLocation]) {
        hospitalsByLocation[selectedLocation].forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital;
            option.textContent = hospital;
            hospitalSelect.appendChild(option);
        });
    }
}

// Function to book appointment
function bookAppointment(doctorName) {
    // Collect date, time, location, hospital, and specialization from input fields
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const hospital = document.getElementById('hospital').value;
    const specialization = document.getElementById('specialization').value;

    // Check if all fields are filled
    if (date && time && location && hospital && specialization) {
        const status = document.getElementById('booking-status');
        status.textContent = `Appointment with ${doctorName} for ${specialization} at ${hospital}, ${location} is booked successfully on ${date} at ${time}.`;
        status.style.color = 'green';

        // Optional: Add notification for successful booking
        if (Notification.permission === "granted") {
            new Notification("Appointment Booked!", {
                body: `You have an appointment with ${doctorName} for ${specialization} at ${hospital}, ${location} on ${date} at ${time}.`,
                icon: 'images/appointment-icon.png' // Optional: add an icon
            });
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Request permission for notifications
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                console.log("Notifications are blocked");
            }
        });
    }
});

// Event listener for the appointment form submission
document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Fetch form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const hospital = document.getElementById('hospital').value;
    const specialization = document.getElementById('specialization').value;

    // Display notification if allowed
    if (Notification.permission === "granted") {
        new Notification("Appointment booked successfully!", {
            body: `Your appointment for ${name} as ${specialization} at ${hospital}, ${location} is on ${date} at ${time}.`,
            icon: 'images/appointment-icon.png' // Optional: add an icon
        });
    } else {
        console.log("Notifications are not allowed");
    }

    // Display a success message on the page
    const status = document.getElementById('booking-status');
    status.textContent = `Appointment booked successfully for ${name} as ${specialization} at ${hospital}, ${location} on ${date} at ${time}.`;
    status.style.color = 'green';
});
//reminder application
const calendar = document.getElementById('calendar');
const sidePanel = document.getElementById('side-panel');
const selectedDateDisplay = document.getElementById('selectedDate span');
const medNameInput = document.getElementById('medName');
const medTimeInput = document.getElementById('medTime');
const remindBtn = document.getElementById('remindBtn');
const closeBtn = document.getElementById('closeBtn');

let selectedDate = '';
let medicationData = {};

// Helper function to generate calendar tiles for each month
function generateCalendar() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let year = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
        const monthTile = document.createElement('div');
        monthTile.classList.add('month-tile');

        const monthName = document.createElement('h2');
        monthName.textContent = `${months[month]} ${year}`;
        monthTile.appendChild(monthName);

        // Weekday row
        const weekdaysRow = document.createElement('div');
        weekdaysRow.classList.add('weekdays');
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.textContent = day;
            weekdaysRow.appendChild(dayEl);
        });
        monthTile.appendChild(weekdaysRow);

        // Days row
        const daysRow = document.createElement('div');
        daysRow.classList.add('days');
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDay = new Date(year, month, 1).getDay();

        // Add empty tiles for the start of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyTile = document.createElement('div');
            emptyTile.classList.add('empty');
            daysRow.appendChild(emptyTile);
        }

        // Add day tiles
        for (let day = 1; day <= daysInMonth; day++) {
            const dayTile = document.createElement('div');
            dayTile.textContent = day;

            dayTile.addEventListener('click', () => openSidePanel(day, month, year));
            daysRow.appendChild(dayTile);
        }

        monthTile.appendChild(daysRow);
        calendar.appendChild(monthTile);
    }
}

// Function to open the side panel for medication input
function openSidePanel(day, month, year) {
    selectedDate = `${day}-${month + 1}-${year}`;
    selectedDateDisplay.textContent = selectedDate;
    sidePanel.classList.add('show-panel');
}

// Function to save medication data and close the panel
function saveMedication() {
    const medName = medNameInput.value;
    const medTime = medTimeInput.value;

    if (medName && medTime) {
        medicationData[selectedDate] = { medName, medTime };
        highlightDay(selectedDate);
        closeSidePanel();
    } else {
        alert('Please enter both medicine name and time.');
    }
}

// Function to close the side panel
function closeSidePanel() {
    sidePanel.classList.remove('show-panel');
}

// Function to highlight the day with medication info
function highlightDay(date) {
    const [day, month, year] = date.split('-');
    const dayTile = [...document.querySelectorAll('.month-tile')].find(tile => tile.querySelector('h2').textContent.includes(`${year}`))
        .querySelectorAll('.days div')[day - 1];

    if (dayTile) {
        dayTile.classList.add('selected-day');
    }
}

// Event listeners
remindBtn.addEventListener('click', saveMedication);
closeBtn.addEventListener('click', closeSidePanel);

// Initialize the calendar
generateCalendar();
