const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Model/User');
const bcrypt = require('bcrypt');
const Book = require('./Model/Book');
const Dua = require('./Model/Dua');
const Area = require('./Model/Aera');
const Mosque = require('./Model/Mosque');
const Post = require('./Model/Post');
const Prayer = require('./Model/Prayer');
const QandA = require('./Model/QandA');
const Nikkah = require('./Model/Nikkah');





const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mossq', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log('Decoded Token:', decoded);
    req.userid = decoded.userId;
    next();
  });
};

// signup
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: 'Signup successful', user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.comparePassword(password)) {
      const token = jwt.sign({ userId: user._id, email }, 'your_secret_key', { expiresIn: '1h' });

      res.json({ message: 'Login successful', role: user.role, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const book = new Book({
    name: req.body.name,
    description: req.body.description,
    bookurl: req.body.bookurl,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all duas
app.get('/duas', async (req, res) => {
  try {
    const duas = await Dua.find();
    res.json(duas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new dua
app.post('/duas', async (req, res) => {
  const dua = new Dua({
    dua: req.body.dua,
  });

  try {
    const newDua = await dua.save();
    res.status(201).json(newDua);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all areas
app.get('/areas', async (req, res) => {
  try {
    const areas = await Area.find().populate('mosques');
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new area
app.post('/areas', async (req, res) => {
  const { areaName, mosques } = req.body;

  try {
    const newArea = new Area({
      areaName,
      mosques, // assuming mosques is an array of ObjectId references
    });

    const savedArea = await newArea.save();

    res.status(201).json(savedArea);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all post of that mosques
app.get('/Post_of_mosques', async (req, res) => {
  try {
    const mosques = await Mosque.find().populate('posts');
    res.json(mosques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get all mosques
app.get('/mosques', async (req, res) => {
  try {
    const mosques = await Mosque.find();
    res.json(mosques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new mosque
app.post('/mosques', verifyToken, async (req, res) => {
  const { userid } = req;
  const mosque = new Mosque({
    name: req.body.name,
    userid: userid, // Assuming you have a user ID to associate with the mosque
  });

  try {
    const newMosque = await mosque.save();
    res.status(201).json(newMosque);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all mosques with empty userid
// app.get('/mosques/emptyuserid', verifyToken, async (req, res) => {
//   try {
//     const mosques = await Mosque.find({ userid: null }).populate('posts');
//     res.json(mosques);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Endpoint for an admin user to select a mosque
// app.put('/users/select-mosque/:mosqueId', verifyToken, async (req, res) => {
//   const { userid } = req;
//   const { mosqueId } = req.params;

//   try {
//     // Check if the user exists and has the 'admin' role
//     const adminUser = await Users.findOne({ _id: userid, role: 'admin' });

//     if (!adminUser) {
//       return res.status(403).json({ message: 'Access denied. Only admin users can perform this action.' });
//     }

//     // Check if the mosque exists
//     const selectedMosque = await Mosque.findById(mosqueId);

//     if (!selectedMosque) {
//       return res.status(404).json({ message: 'Mosque not found.' });
//     }

//     // Assign the selected mosque to the admin user
//     adminUser.mosqueid = mosqueId;
//     await adminUser.save();

//     res.json({ message: 'Mosque selected successfully.' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Endpoint to get all areas with mosques
app.get('/areas-with-mosques', async (req, res) => {
  try {
    const areasWithMosques = await Area.find().populate('mosques');

    res.json(areasWithMosques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add mosque ID to user
app.post('/users/add-mosque', verifyToken, async (req, res) => {
  const { userid } = req;
  const { mosqueId } = req.body;

  try {
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Add the mosqueId to the user's mosqueids array
    user.mosqueid.push(mosqueId);

    await user.save();

    res.json({ message: 'Mosque added to user successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
app.post('/posts', verifyToken, async (req, res) => {
  const { userid } = req;
  const { mosqueid, title, description } = req.body;

  try {
    // Check if the authenticated user exists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the provided mosqueid exists
    const mosque = await Mosque.findById(mosqueid);
    if (!mosque) {
      return res.status(404).json({ message: 'Mosque not found.' });
    }

    const newPost = new Post({
      mosqueid,
      title,
      description,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get posts associated with the user's mosques
app.get('/user-posts', verifyToken, async (req, res) => {
  const { userid } = req;

  try {
    // Get the user's data, including mosqueids
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract mosque IDs from the user's data
    const mosqueIds = user.mosqueid;

    // Get all posts associated with the user's mosques
    const posts = await Post.find({ mosqueid: { $in: mosqueIds } });

    res.json(posts.map(post => ({ title: post.title, description: post.description })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new prayer time
app.post('/prayers/add', async (req, res) => {
  try {
    const { name, time } = req.body;
    const newPrayer = new Prayer({ name, time });
    const savedPrayer = await newPrayer.save();
    res.json(savedPrayer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all prayer times
app.get('/prayers/get', async (req, res) => {
  try {
    const prayers = await Prayer.find();
    res.json(prayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a prayer time
app.put('/prayers/update/:id', async (req, res) => {
  try {
    const { name, time } = req.body;
    const updatedPrayer = await Prayer.findByIdAndUpdate(
      req.params.id,
      { name, time },
      { new: true }
    );
    res.json(updatedPrayer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add a question
app.post('/qanda/add-question', async (req, res) => {
  try {
    const { question } = req.body;
    const newQuestion = new QandA({ question });
    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add an answer to a question
app.put('/qanda/add-answer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const updatedQuestion = await QandA.findByIdAndUpdate(
      id,
      { answer },
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get all Q&A
app.get('/qanda/get-all', async (req, res) => {
  try {
    const allQandA = await QandA.find();
    res.json(allQandA);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for adding Nikkah
app.post('/nikkah/add', async (req, res) => {
  try {
    const { name, cnic, phoneNo, address, date } = req.body;

    const nikkah = new Nikkah({
      name,
      cnic,
      phoneNo,
      address,
      date,
    });

    await nikkah.save();
    res.status(200).json({ message: 'Nikkah added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for getting all Nikkah records
app.get('/nikkah/get-all', async (req, res) => {
  try {
    const nikkahs = await Nikkah.find();
    res.json(nikkahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
