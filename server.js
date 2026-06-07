const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // JSON data read karne ke liye

// 1. SQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Aapka MySQL username
    password: 'password',  // ⚠️ Yahan apna real MySQL password daalein
    database: 'findroom_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to SQL Database.');
});

// 2. API: New User Register karne ke liye
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const query = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
    
    db.query(query, [name, email, password, role], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Registration Successful!", userId: result.insertId });
    });
});

// 3. NAYA API: Room Post karne ke liye (Ab isme owner_id bhi jayega)
app.post('/api/add-room', (req, res) => {
    const { owner_id, title, location, rent, type, description, contact } = req.body;
    const query = "INSERT INTO Rooms (owner_id, title, location, rent, type, description, contact) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    // Agar login setup nahi hai toh testing ke liye owner_id ko default 1 ya NULL bhej sakte hain
    const finalOwnerId = owner_id || 1; 

    db.query(query, [finalOwnerId, title, location, rent, type, description, contact], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Room Posted Successfully!" });
    });
});

// 4. NAYA API: Saare Rooms Owner Name ke sath Fetch karne ke liye (JOIN Query)
app.get('/api/rooms', (req, res) => {
    const query = `
        SELECT Rooms.*, Users.name AS owner_name 
        FROM Rooms 
        LEFT JOIN Users ON Rooms.owner_id = Users.user_id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. EKDOM NAYA API: Room Listing Delete karne ke liye
app.delete('/api/delete-room/:id', (req, res) => {
    const roomId = req.params.id;
    const query = "DELETE FROM Rooms WHERE room_id = ?";
    
    db.query(query, [roomId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Room listing deleted successfully!" });
    });
});

// Server Start
app.listen(3000, () => {
    console.log('Backend Server running on http://localhost:3000');
});