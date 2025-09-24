const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve static files (HTML, CSS, JS, images)
app.use(express.static('public'));

//Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Keep track of images (in-memory for now)
let imagePaths = {
  profile: '/images/me.jpg',
  project1: '/images/proj1.jpg',
  project2: '/images/proj2.png',
  project3: '/images/proj3.png'
};

// Home route → renders portfolio with current images
app.get('/', (req, res) => {
  res.render('index', { imagePaths });
});

// Upload profile image
app.post('/upload/profile', upload.single('profileImage'), (req, res) => {
  if (req.file) {
    imagePaths.profile = `/uploads/${req.file.filename}`;
    res.json({ success: true, imagePath: imagePaths.profile });
  } else {
    res.json({ success: false });
  }
});

// Upload project images
app.post('/upload/project/:id', upload.single('projectImage'), (req, res) => {
  const projectId = req.params.id;
  if (req.file && imagePaths[`project${projectId}`]) {
    imagePaths[`project${projectId}`] = `/uploads/${req.file.filename}`;
    res.json({ success: true, imagePath: imagePaths[`project${projectId}`] });
  } else {
    res.json({ success: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
