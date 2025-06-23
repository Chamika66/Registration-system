const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/dbConfig');
require('dotenv').config();

const auth = require('./Routes/authRoutes');
const student = require('./Routes/studentRoutes');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));



app.use("/api/students", student);
app.use("/api/auth", auth);
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
