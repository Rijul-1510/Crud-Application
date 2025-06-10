const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const filePath = path.join(__dirname, 'user_data.json');
console.log('user_data.json path is:', filePath);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });


// 🔁 Load user data from JSON file
const loadUserData = () => {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const parsedData = JSON.parse(fileData);
      return Array.isArray(parsedData) ? parsedData : [];
    }
  } catch (error) {
    console.error('Error reading user data:', error);
  }
  return [];
};

// 💾 Save user data back to JSON file
const saveUserData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('user_data.json updated!');
    return true;
  } catch (error) {
    console.error('Error writing user data:', error);
    return false;
  }
};

// 🔐 LOGIN CHECK
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUserData();

  const matchedUser = users.find(user => user.email === email && user.password === password);

  if (!matchedUser) {
    return res.status(404).json({ error: 'New user. Please sign up first.' });
  }

  res.json({ message: 'Login successful!', user: matchedUser });
});

// ✏️ SUBMIT NEW USER
app.post('/submit', upload.single('file'), (req, res) => {
  const formData = JSON.parse(req.body.data); // Expect formData in a `data` field
  formData.file = req.file ? req.file.filename : ''; // Save the uploaded filename
  formData.id = Date.now();

  let users = loadUserData();
  users.push(formData);

  const success = saveUserData(users);
  res.status(success ? 200 : 500).json({ message: success ? 'Data saved' : 'Save failed' });
});




// 🛠️ UPDATE EXISTING USER BY EMAIL
app.put('/update', upload.single('file'), (req, res) => {
  const updatedData = JSON.parse(req.body.data);
  const users = loadUserData();
  const index = users.findIndex(user => user.email === updatedData.email);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const oldFileName = users[index].file; // Get old file name

  if (req.file) {
    updatedData.file = req.file.filename;

    // 🧹 Delete old file from uploads folder
    if (oldFileName) {
      const oldFilePath = path.join(__dirname, 'uploads', oldFileName);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFileName}`);
        } catch (err) {
          console.error(` Failed to delete old file: ${oldFileName}`, err);
        }
      }
    }
  } else {
    updatedData.file = oldFileName; // Keep old file if no new one is uploaded
  }

  updatedData.id = users[index].id; // Retain ID
  users[index] = updatedData;

  const success = saveUserData(users);
  res.status(success ? 200 : 500).json({ message: success ? 'User updated' : 'Update failed' });
});



// 📥 FETCH ALL USERS
app.get('/fetchData', (req, res) => {
  const users = loadUserData();
  res.json(users);
});

// ❌ DELETE USER
app.delete('/deleteUser/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const users = loadUserData();
  const updatedUsers = users.filter((user) => user.id !== userId);

  if (saveUserData(updatedUsers)) {
    res.sendStatus(200);
  } else {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// 🔑 RESET PASSWORD
app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password required.' });
  }

  const users = loadUserData();
  const index = users.findIndex((user) => user.email === email);

  if (index === -1) {
    return res.status(404).json({ error: 'User credentials not found. Please sign up.' });
  }

  users[index].password = newPassword;

  if (saveUserData(users)) {
    res.json({ message: 'Password reset successfully!' });
  } else {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// ✔️ ROOT TEST
app.get('/', (req, res) => {
  res.send('Server running successfully');
});

// 🔈 Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});