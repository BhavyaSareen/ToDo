const admin = require('firebase-admin');
const express = require('express');
const bcrypt = require('bcryptjs'); // For hashing passwords
const dotenv = require('dotenv'); // For loading environment variables

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

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

// Signup API route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword, // Store hashed password
      createdAt: Date.now()
    };

    // Save user data in Firebase Realtime Database
    const ref = db.ref('users').push();  // Create a unique key under 'users'
    await ref.set(newUser);

    res.status(200).json({ message: 'User signed up successfully', userId: ref.key });
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

    res.status(200).json({ message: 'Login successful', userId: userKey });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
