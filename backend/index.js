const admin = require('firebase-admin');
const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const { getStorage } = require('firebase-admin/storage');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 
const upload = multer({ storage: multer.memoryStorage() });

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

// Middleware to authenticate user using Firebase ID token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Signup API route
app.post('/signup', upload.single('profilePhoto'), async (req, res) => {
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

    // Upload the profile photo to Firebase Storage (if a file is provided)
    let profilePhotoUrl = null;
    if (req.file) {
      const bucket = getStorage().bucket();
      const fileName = `profile_photos/${ref.key}-${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });

      // Get the file's public URL
      profilePhotoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      newUser.profilePhotoUrl = profilePhotoUrl; // Add profile photo URL to the user object
    }

    // Save user info with profile photo URL in Firebase Realtime Database
    await ref.set(newUser);

    // Custom claims to include in the token
    const customClaims = {
      name: newUser.name,
      email: newUser.email,
      profilePhotoUrl: profilePhotoUrl || '', // Include the profile photo URL in the token claims if present
    };

    // Generate a custom authentication token with custom claims
    const customToken = await admin.auth().createCustomToken(ref.key, customClaims);

    res.status(200).json({
      message: 'User signed up successfully',
      userId: ref.key,
      token: customToken, // Include the custom token in the response
      profilePhotoUrl, // Return the profile photo URL in the response
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

    // Custom claims to include in the token
    const customClaims = {
      name: storedUser.name,
      email: storedUser.email,
      profilePhotoUrl: storedUser.profilePhotoUrl || '', // Include the profile photo URL in the token claims
    };

    // Generate a custom authentication token with custom claims
    const customToken = await admin.auth().createCustomToken(userKey, customClaims);

    res.status(200).json({
      message: 'Login successful',
      userId: userKey,
      token: customToken, // Include the custom token in the response
      profilePhotoUrl: storedUser.profilePhotoUrl, // Return the profile photo URL in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});




// Task routes (GET, POST, DELETE, PATCH) with authentication

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});