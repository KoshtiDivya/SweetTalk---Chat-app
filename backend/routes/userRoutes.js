const express = require('express');
const { registerUser, authUser, allUsers, updateProfile } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);
router.put("/profile", protect, updateProfile);

module.exports = router;