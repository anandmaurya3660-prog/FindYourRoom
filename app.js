const BACKEND_URL = 'http://localhost:3000/api';

// Section change karne ka function
function showSection(sectionId) {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('ownerSection').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');

    if(sectionId === 'homeSection') {
        loadRooms(); // Home page par aate hi saare rooms load ho jayein
    }
}

// 1. REGISTER FORM SUBMIT (Frontend to Backend)
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    const role = document.getElementById('userRole').value;

    const res = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    alert(data.message);
    
    if(role === 'Owner') {
        document.getElementById('navOwnerDash').classList.remove('hidden');
        showSection('ownerSection');
    } else {
        showSection('homeSection');
    }
});

// 2. ADD ROOM FORM SUBMIT (Owner Dashboard)
document.getElementById('addRoomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    const roomData = {
        title: elements[0].value,
        location: elements[1].value,
        rent: elements[2].value,
        type: elements[3].value,
        description: elements[4].value,
        contact: elements[5].value
    };

    const res = await fetch(`${BACKEND_URL}/add-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
    });
    const data = await res.json();
    alert(data.message);
    e.target.reset(); // Form clear kar do
    showSection('homeSection');
});

// DATABASE SE ROOMS FETCH KARKE DISPLAY KARNA AUR DELETE LOGIC
async function loadRooms() {
    const res = await fetch(`${BACKEND_URL}/rooms`);
    const rooms = await res.json();
    const container = document.getElementById('roomsContainer');
    container.innerHTML = ''; // Purana data saaf karo

    if(rooms.length === 0) {
        container.innerHTML = '<p>No rooms available right now.</p>';
        return;
    }

    rooms.forEach(room => {
        // Naya Card Structure: Isme Owner ka Name aur Delete Button add kiya hai
        const card = `
            <div class="room-card" id="room-${room.room_id}">
                <div class="card-img-placeholder">🏠</div>
                <div class="card-content">
                    <div class="room-rent">₹${room.rent}<span>/month</span></div>
                    <h4>${room.title}</h4>
                    <div class="room-meta">📍 ${room.location}</div>
                    <div class="room-meta">🏢 Type: ${room.type}</div>
                    <div class="room-meta" style="color: #4a5568; font-weight: 500;">👤 Listed By: ${room.owner_name || 'Unknown Owner'}</div>
                    <p class="room-desc">${room.description || 'No description provided.'}</p>
                    <div class="room-contact">📞 Call Owner: ${room.contact}</div>
                    
                    <button class="btn-delete" onclick="deleteRoom(${room.room_id})" style="margin-top: 15px; padding: 8px 15px; background: #ff4d4d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%;">
                        🗑️ Delete Listing
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// NEW FUNCTION: FRONTEND SE DELETE REQUEST BHEJNA
async function deleteRoom(roomId) {
    if(confirm("Are you sure you want to delete this room?")) {
        const res = await fetch(`${BACKEND_URL}/delete-room/${roomId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        alert(data.message);
        loadRooms(); // List ko dubara refresh kar do taaki deleted room screen se hat jaye
    }
}

// Pehli baar page khulne par rooms load ho jayein
loadRooms(); 

// Function to switch between Login and Register Tabs
function switchAuthTab(tabName) {
    const loginForm = document.getElementById('loginTabForm');
    const registerForm = document.getElementById('registerTabForm');
    const loginBtn = document.getElementById('tabLoginBtn');
    const registerBtn = document.getElementById('tabRegisterBtn');

    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
}