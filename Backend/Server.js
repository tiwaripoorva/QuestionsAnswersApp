const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors'); // Added CORS middleware
const app = express();
const bodyParser = require('body-parser');
 
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
 
const PORT = 3000;
const DB_URI = 'mongodb://localhost:27017/QuestionAnswerApp';
 
// Global variables to hold the connected database and collection references
let database;
let dataCollection; // Java
let dataCollection1; // Python
let dataCollection2; // dotnet
let dataCollection3; // CPP
let signUpCollection; // SignUp collection
 
// --- 1. MongoDB Native Connection Function ---
async function connectDB() {
    try {
        const client = new MongoClient(DB_URI);
        await client.connect();
 
        // Get database instance
        database = client.db('QuestionAnswerApp');
 
        // Get specific collection instances based on your known technologies
        dataCollection = database.collection('Java');     
        dataCollection1 = database.collection('Python');  
        dataCollection2 = database.collection('dotnet');  
        dataCollection3 = database.collection('CPP');
        // --- THIS LINE IS CORRECTLY GETTING THE COLLECTION REFERENCE ---
        signUpCollection = database.collection('SignUp');
 
        console.log('✅ MongoDB native connection successful!');
 
        // Optional check to confirm the existing data is accessible
        const countJava = await dataCollection.countDocuments();
        const countPython = await dataCollection1.countDocuments();
        const countDotnet = await dataCollection2.countDocuments();
        const countCPP = await dataCollection3.countDocuments();
 
 
        console.log(`ℹ️ Collection 'java' contains ${countJava} documents.`);
        console.log(`ℹ️ Collection 'python' contains ${countPython} documents.`);
        console.log(`ℹ️ Collection 'dotnet' contains ${countDotnet} documents.`);
        console.log(`ℹ️ Collection 'cpp' contains ${countCPP} documents.`);
 
 
        
    } catch (error) {
        // This runs if the connection fails (e.g., MongoDB not running)
        console.error('❌ MongoDB native connection failed:', error.message);
        process.exit(1); // Stop the server
    }
}
 
connectDB();
 
// --- 2. API Routes ---
 
// Middleware to ensure database is ready for API calls
app.use((req, res, next) => {
    if (!database) {
        return res.status(503).json({ message: 'Service Unavailable: Database connection not ready.' });
    }
    next();
});
 
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});
 
// --- Static GET Routes for Known Technologies ---
 
app.get('/api/questions/java', async (req, res) => {
     try {
        const items = await dataCollection.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error in GET /api/questions/java:", error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});
 
app.get('/api/questions/python', async (req, res) => {
     try {
        const items = await dataCollection1.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error in GET /api/questions/python:", error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});
 
app.get('/api/questions/dotnet', async (req, res) => {
     try {
        const items = await dataCollection2.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error in GET /api/questions/dotnet:", error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});
 
app.get('/api/questions/cpp', async (req, res) => {
     try {
        const items = await dataCollection3.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error in GET /api/questions/cpp:", error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});
 
// --- New API 1: Create Technology Collection ---
// URL Format: POST /api/technology/create/:techName
app.post('/api/technology/create/:techName', async (req, res) => {
    let techName = req.params.techName;
 
    if (!techName) {
        return res.status(400).json({ message: 'Technology name is required.' });
    }
 
    // Sanitize techName for collection naming
    const collectionName = techName.trim().toLowerCase().replace(/\s+/g, '');
    
    try {
        const collections = await database.listCollections({ name: collectionName }).toArray();
        const exists = collections.length > 0;
 
        if (exists) {
            return res.status(200).json({
                message: `Technology "${techName}" already exists.`,
                collection: collectionName
            });
        }
        
        // Explicitly create the collection
        await database.createCollection(collectionName);
        
        console.log(`✅ New technology collection created: ${collectionName}`);
        res.status(201).json({
            message: `New technology "${techName}" created successfully.`,
            collection: collectionName
        });
        
    } catch (error) {
        console.error('❌ Error creating new technology/collection:', error);
        res.status(500).json({ message: 'Error on server while processing request.', error: error.message });
    }
});
 
 
// --- New API 3: List All Technologies (Collections) ---
// GET /api/technology/list
app.get('/api/technology/list', async (req, res) => {
    try {
        const collections = await database.listCollections().toArray();
        // Extract just the name and filter out MongoDB system collections
        const techList = collections
            .map(col => col.name)
            .filter(name => !name.startsWith('system.'));
            
        res.status(200).json(techList);
    } catch (error) {
        console.error('❌ Error listing collections:', error);
        res.status(500).json({ message: 'Error fetching technology list.', error: error.message });
    }
});
 
 
// --- New API 4 (Enhanced): Add Question with Duplicate Check ---
// URL Format: POST /api/questions/:techName
app.post('/api/questions/:techName', async (req, res) => {
    const techName = req.params.techName;
    const { question, answer } = req.body;
    
    if (!question || !answer) {
        return res.status(400).json({ message: 'Missing required fields: question or answer.' });
    }
    
    const collectionName = techName.trim().toLowerCase().replace(/\s+/g, '');
 
    const newQuestionData = {
        question: question.trim(), // Trim whitespace for accurate matching
        answer: answer,
        createdAt: new Date()
    };
    
    try {
        const collection = database.collection(collectionName);
        
        // --- DUPLICATE CHECK ---
        // Check if a document with the exact question already exists
        const existingQuestion = await collection.findOne({ question: newQuestionData.question });
        
        if (existingQuestion) {
            // 409 Conflict signals that the request conflicts with the current state of the target resource.
            return res.status(409).json({
                message: `Question already exists in the '${techName}' technology.`,
                existingId: existingQuestion._id
            });
        }
        // --- END DUPLICATE CHECK ---
 
        const result = await collection.insertOne(newQuestionData);
 
        res.status(201).json({
            message: `Question successfully added to technology: ${techName}`,
            insertedId: result.insertedId
        });
        
    } catch (error) {
        console.error('❌ Error adding question:', error);
        res.status(500).json({ message: 'Error on server while processing request.', error: error.message });
    }
});
 
// ------------------------------------------------------------------
// --- NEW API 5: SIGNUP ROUTE (POST /api/signup) ---
// ------------------------------------------------------------------
app.post('/api/signup', async (req, res) => {
    // 1. Get the user data from the Angular request body
    const { username, email, password } = req.body;
    
    // Basic server-side validation
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields (username, email, password) are required.'
        });
    }
 
    // Prepare the document to be inserted
    const newUser = {
        username: username,
        email: email,
        password: password, // WARNING: Hash this password in a real app!
        createdAt: new Date()
    };
 
    try {
        // --- DUPLICATE CHECK (Optional but recommended) ---
        // Check if user already exists by email or username
        const existingUser = await signUpCollection.findOne({
            $or: [{ email: newUser.email }, { username: newUser.username }]
        });
 
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists.'
            });
        }
        // --- END DUPLICATE CHECK ---
 
 
        // 2. Insert the new user document into the 'SignUp' collection
        const result = await signUpCollection.insertOne(newUser);
 
        // 3. Send a successful response back to the client
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            userId: result.insertedId
        });
 
        console.log(`✅ New user registered: ${username} (ID: ${result.insertedId})`);
 
    } catch (error) {
        console.error('❌ Error during user signup:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred during registration.',
            error: error.message
        });
    }
});
 
// ------------------------------------------------------------------
// --- NEW API 6: LOGIN ROUTE (POST /api/login) ---
// ------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
    // We expect the Angular app to send email and password
    const { email, password } = req.body;
 
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required for login.'
        });
    }
    
    try {
        // 1. Find the user by their email in the SignUp collection
        const user = await signUpCollection.findOne({ email: email });
 
        // 2. Check if the user exists
        if (!user) {
            // User not found
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }
 
        // 3. Compare the provided password with the stored password
        // WARNING: In a real app, you MUST use a library like bcrypt.js here
        // to compare the provided password with the stored HASH.
        const isMatch = (password === user.password);
 
        if (isMatch) {
            // 4. Password matches - Login successful!
            // In a real app, you would generate and return a JWT token here.
            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                userId: user._id,
                username: user.username
            });
        } else {
            // 5. Password does not match
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }
 
    } catch (error) {
        console.error('❌ Error during user login:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred during login.',
            error: error.message
        });
    }
});
 
 
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});