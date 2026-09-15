let express = require('express');
let router = express.Router();
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const { user } = require('../db');
const { sendEmail } = require('../services/sendMail');

router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  try {
    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return res.status(404).send('User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    foundUser.resetToken = resetToken;
    foundUser.resetTokenExpiry = Date.now() + 3600000;
    await foundUser.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/forgot/${resetToken}`;
    await sendEmail(
      foundUser.email,
      'Password Reset Request',
      `Click the link below to reset your password:\n\n${resetUrl}`
    );

    res.status(200).send('Password reset email sent');

  } catch (error) {
    res.status(500).send('Error sending password reset email: ' + error.message);
  }
});

// reset pass

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const foundUser = await user.findOne({
      resetToken: token,
      resetTokenExpiry: {$gt: Date.now() },
    });

    if (!foundUser) {
      return res.status(400).send('Invalid or expired token');
    }

    //hash the pass
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.resetToken = undefined;
    foundUser.resetTokenExpiry = undefined;
    await foundUser.save();

    res.status(200).send('Password reset successfully');
  } catch (error) {
    res.status(500).send('Error resetting password: ' + error.message);
  }
});

module.exports = router;