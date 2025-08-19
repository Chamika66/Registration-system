// createUploads.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
