const { Attendance, Member, Membership } = require('../models');

async function checkin(req, res) {
  try {
    // Accept token via query or body
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ message: 'Token missing' });
    const member = await Member.findOne({ where: { qrToken: token }, include: Membership });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // check membership
    const membership = member.membership;
    if (membership && membership.status !== 'active') {
      return res.status(403).json({ message: 'Membership not active' });
    }
    const record = await Attendance.create({ memberId: member.id, method: 'QR' });
    return res.json({ message: 'Checked in', data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function listAttendance(req, res) {
  try {
    // admin only route expected
    const records = await Attendance.findAll({ include: Member, order: [['checkInAt', 'DESC']] });
    return res.json(records);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getMemberAttendance(req, res) {
  try {
    const memberId = req.params.memberId;
    if (req.user.role === 'member' && parseInt(req.user.id) !== parseInt(memberId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const records = await Attendance.findAll({ where: { memberId }, order: [['checkInAt','DESC']] });
    return res.json(records);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { checkin, listAttendance, getMemberAttendance };
