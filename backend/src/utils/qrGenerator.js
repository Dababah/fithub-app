const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQrForMember(token, memberId, baseUrl) {
  const dir = path.join(__dirname, '..', 'uploads', 'qr_codes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `qr_member_${memberId}_${Date.now()}.png`;
  const outPath = path.join(dir, filename);

  // QR payload could be a simple token or url to checkin endpoint
  const payload = `${baseUrl || ''}/api/attendance/checkin?token=${encodeURIComponent(token)}`;

  await QRCode.toFile(outPath, payload, { width: 300 });
  return { path: `/uploads/qr_codes/${filename}`, fullPath: outPath };
}

module.exports = { generateQrForMember };
