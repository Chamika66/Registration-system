const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/dbConfig');
const path = require('path');
require('dotenv').config();

const auth = require('./Routes/authRoutes');
const student = require('./Routes/studentRoutes');


const app = express();
connectDB();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "frontend", "build")));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", 'index.html'));
    });
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

const path = require('path');
app.use('/uploads', express.static('uploads'));


app.use("/api/students", student);
app.use("/api/auth", auth);
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
