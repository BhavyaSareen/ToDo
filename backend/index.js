const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const otpStore = {};
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Firebase Admin SDK with Service Account Key from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // List of recipients
    subject, // Subject line
    text // Plain text body
  };

  return transporter.sendMail(mailOptions);
};

const db = admin.database();
const bucket = admin.storage().bucket();

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken; // Attach the decoded token to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

const uploadImageToFirebase = async (file, userId) => {
  const fileName = `${userId}/${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject(error));
    blobStream.on('finish', () => {
      fileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2099'
      }).then((url) => resolve(url[0]));
    });
    blobStream.end(file.buffer);
  });
};

app.post('/signup', upload.single('profileImage'), async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      profileImageUrl: null // Default value for profile image
    };

    // Save user data in Firebase Realtime Database
    const ref = db.ref('users').push();

    // Upload profile image if provided
    if (req.file) {
      const imageUrl = await uploadImageToFirebase(req.file, ref.key);
      newUser.profileImageUrl = imageUrl;
    }

    await ref.set(newUser);

    const token = jwt.sign({ uid: ref.key, email }, SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({
      message: 'User signed up successfully',
      userId: ref.key,
      name, // Include the user's name
      profileImageUrl: newUser.profileImageUrl, // Include profile image URL
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user', error: error.message });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required.' });
  }

  try {
    // Find user by email
    const userSnapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');

    if (!userSnapshot.exists()) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = userSnapshot.val();
    const userKey = Object.keys(user)[0]; // Get the user's unique key
    const storedUser = user[userKey];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ uid: userKey, email }, SECRET_KEY);

    // Return login response with image URL
    res.status(200).json({
      message: 'Login successful',
      userId: userKey,
      token, // Include the JWT token in the response
      profileImageUrl: storedUser.profileImageUrl || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});



// Get tasks for authenticated user
// Get tasks for authenticated user with pagination and latest-first sorting
app.get('/tasks', authenticate, async (req, res) => {
  try {
    // Pagination logic
    const { page = 1 } = req.query; // Get 'page' query param, default is 1
    const tasksPerPage = 10; // Number of tasks to display per page
    const startIndex = (page - 1) * tasksPerPage;

    // Fetch tasks for the authenticated user
    const tasksSnapshot = await db.ref(`tasks/${req.user.uid}`).once('value');
    const tasks = tasksSnapshot.val() || {};

    // Convert tasks object to an array and sort by `createdAt` (latest first)
    const sortedTasks = Object.keys(tasks)
      .map(key => ({ id: key, ...tasks[key] }))
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by 'createdAt' descending

    // Paginate tasks
    const paginatedTasks = sortedTasks.slice(startIndex, startIndex + tasksPerPage);

    res.status(200).json({
      tasks: paginatedTasks,
      totalTasks: sortedTasks.length, // Total number of tasks for pagination logic
      currentPage: page, // Current page
      totalPages: Math.ceil(sortedTasks.length / tasksPerPage) // Total pages available
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Get a specific task by ID for authenticated user
app.get('/tasks/:taskId', authenticate, async (req, res) => {
  const { taskId } = req.params;

  try {
    // Fetch the specific task for the authenticated user
    const tasksSnapshot = await db.ref(`tasks/${req.user.uid}`).once('value');

    const taskSnapshot = await db.ref(`tasks/${req.user.uid}/${taskId}`).once('value');

    if (!taskSnapshot.exists()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = taskSnapshot.val();
    res.status(200).json({ id: taskId, ...task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});


// Create a new task for authenticated user
app.post('/tasks', authenticate, async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  // Function to generate a unique task ID
  const generateUniqueTaskId = async (baseTitle) => {
    let taskId = baseTitle.replace(/\s+/g, '-'); // Replace spaces with hyphens
    const snapshot = await db.ref(`tasks/${req.user.uid}`).once('value');

    const existingTasks = snapshot.val() || [];
    const taskExists = existingTasks.some(task => task.id === taskId);

    // If task with the same ID exists, append a random 4-character string to ensure uniqueness
    if (taskExists) {
      const randomSuffix = Math.random().toString(36).substring(2, 6); // Generates a random 4-character string
      taskId = `${taskId}-${randomSuffix}`;
    }

    return taskId;
  };

  try {
    const taskId = await generateUniqueTaskId(title); // Generate unique task ID based on title

    const newTask = {
      id: taskId,
      title,
      description,
      createdAt: Date.now(),
      dueDate: dueDate || null, // Optionally handle due date
      completed: false,
    };

    // Fetch existing tasks or initialize an empty array
    const userTasksRef = db.ref(`tasks/${req.user.uid}`);
    const snapshot = await userTasksRef.once('value');
    const existingTasks = snapshot.val() || [];

    // Add the new task to the array
    const updatedTasks = [...existingTasks, newTask];

    // Save the updated task array back to the database
    await userTasksRef.set(updatedTasks);

    res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});



// Update a task for authenticated user
app.patch('/tasks/:taskId', authenticate, async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate).toISOString(); // Convert dueDate to ISO format
  }

  try {
    await db.ref(`tasks/${req.user.uid}/${taskId}`).update(updates);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete a task for authenticated user
app.delete('/tasks/:taskId', authenticate, async (req, res) => {
  const { taskId } = req.params;

  try {
    await db.ref(`tasks/${req.user.uid}/${taskId}`).remove();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Example protected route
app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

// Get user profile
app.get('/myprofile', authenticate, async (req, res) => {
  try {
    const userSnapshot = await db.ref(`users/${req.user.uid}`).once('value');
    const userProfile = userSnapshot.val();

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile (change name or password)
app.patch('/myprofile', authenticate, async (req, res) => {
  const { name, password } = req.body;

  try {
    const updates = {};
    if (name) updates.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    await db.ref(`users/${req.user.uid}`).update(updates);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});


// Forgot password API
// Example in your /forgotpass route
app.post('/forgotpass', async (req, res) => {
  const { email } = req.body;

  try {
    const userSnapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStore[email] = otp; // Store the OTP temporarily

    // Send OTP via email
    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Confirm OTP API
app.post('/confirmotp', (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] === parseInt(otp)) {
    return res.status(200).json({ message: 'OTP confirmed, proceed to change password' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Change password API
app.post('/changepassword', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userKey = Object.keys(userSnapshot.val())[0];

    await db.ref(`users/${userKey}`).update({ password: hashedPassword });
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

