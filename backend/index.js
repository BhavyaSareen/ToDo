const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;


const app = express();
app.use(express.json());
app.use(cors());

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
  databaseURL: process.env.DATABASE_URL // Use environment variable for database URL
});

// Get a reference to the Realtime Database
const db = admin.database();

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


// Signup API route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define a new user object
    const newUser = {
      name,
      email,
      password: hashedPassword, // Store hashed password
      createdAt: Date.now(),
    };

    // Save user data in Firebase Realtime Database
    const ref = db.ref('users').push(); // Create a unique key under 'users'
    await ref.set(newUser);

    // Generate a JWT token
    const token = jwt.sign({ uid: ref.key, email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'User signed up successfully',
      userId: ref.key,
      token, // Include the JWT token in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user', error: error.message });
  }
});

// Login API route
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
    const token = jwt.sign({ uid: userKey, email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      userId: userKey,
      token, // Include the JWT token in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});

// Get tasks for authenticated user
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasksSnapshot = await db.ref(`tasks/${req.user.uid}`).once('value'); 
    const tasks = tasksSnapshot.val() || {}; 

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Create a new task for authenticated user
app.post('/tasks', authenticate, async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const newTask = {
    title,
    description,
    createdAt: Date.now(),
    dueDate: dueDate ? new Date(dueDate).toISOString() : null, // Convert dueDate to ISO format
    completed: false,
  };

  try {
    const ref = db.ref(`tasks/${req.user.uid}`).push(); // Save task under authenticated user's UID
    await ref.set(newTask);

    res.status(201).json({ message: 'Task created successfully', taskId: ref.key });
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
