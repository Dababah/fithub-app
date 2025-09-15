const express = require('express');
const router = express.Router();
const { checkin, listAttendance, getMemberAttendance } = require('../controllers/attendanceController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

router.post('/checkin', checkin); // public for QR token via query or POST
router.use(authMiddleware);
router.get('/', adminOnly, listAttendance);
router.get('/:memberId', getMemberAttendance);

module.exports = router;
