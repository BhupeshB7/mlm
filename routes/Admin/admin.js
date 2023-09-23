const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const User = require('../../models/Admin/Admin');
const User = require('../../models/User');
const router = express.Router();
// const { hashPassword } = require('../../utils/passwordUtils');
// const adminAuth = require('../../controllers/Admin/adminAuth')
const JWT_SECRET = process.env.JWT_SECRET;
//For Admin login...
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(400).json({ message: 'Invalid email or password' });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid email or password' });
//   }

//   if (user.role !== 'admin') {
//     return res.status(403).json({ message: 'You are not authorized to access this resource' });
//   }

//   const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

//   res.json({ token });
// });
// Middleware to check if the user is an admin or already authenticated
// Middleware to check if the user is an admin or already authenticated
const isAdminOrAuthenticatedMiddleware = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the request contains a valid admin token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const aToken = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(aToken, JWT_SECRET);

      // If the token is valid and the user is already authenticated, proceed with the login
      if (decodedToken) {
        return next();
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }

    // If the user is an admin, store the user object in the request for further use
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Error while checking admin status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// For Admin login
router.post('/login', isAdminOrAuthenticatedMiddleware, async (req, res) => {
  const { password } = req.body;
  const user = req.adminUser;

  try {
    // Check if the request contains a valid admin token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const aToken = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(aToken, JWT_SECRET);

      // If the token is valid and the user is already authenticated, use it for authentication
      if (decodedToken) {
        const aToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });
        return res.json({ aToken });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });

    res.json({ token });
  } catch (error) {
    console.error('Error while logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// router.get('/api/users', async (req, res) => {
//   const users = await User.find();

//   res.json(users);
// });

router.get('/api/users', async (req, res) => {
  const searchQuery = req.query.search; // Get the search query parameter from the request

  // Use a regular expression to perform a case-insensitive search for the given query
  const searchRegex = new RegExp(searchQuery, 'i');

  // Find all users whose name or email matches the search query
  const users = await User.find({
    $or: [
      { name: searchRegex },
      { sponsorId: searchRegex },
      { userId: searchRegex }
    ]
  });

  res.json(users);
});
// Update user
router.put('/active/:id', async (req, res) => {
  try {
    const { is_active, activationTime } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { is_active, activationTime }, { new: true });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  await User.findByIdAndDelete(id);

  res.json({ message: 'User deleted successfully' });
});
router.delete('/api/deposit/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  await User.findByIdAndDelete(id);

  res.json({ message: 'User deleted successfully' });
});

const isActive = (item) => item.is_active;

const countActiveItems = async (items) => {
  const activeItems = await items.filter(isActive);
  return activeItems.length;
};

router.get("/count-active-items", async (req, res) => {
  const items = await User.find();
  const numberOfActiveUser = await countActiveItems(items);
  res.json({ numberOfActiveUser });
});
const countInActiveItems = async (items) => {
  const inActiveItems = await items.filter(item=> !item.isActive);
  return inActiveItems.length;
};

router.get("/count-inactive-items", async (req, res) => {
  const items = await User.find();
  const numberOfInActiveUser = await countInActiveItems(items);
  res.json({ numberOfInActiveUser });
});

// Get all users (admin only)
// router.get('/users', adminAuth, async (req, res) => {
//     try {
//       const users = await User.find();
//       res.send(users);
//     } catch (error) {
//       res.status(500).send({ error: 'Internal server error.' });
//     }
//   });
  
module.exports = router;