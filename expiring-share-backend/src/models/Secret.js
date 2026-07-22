const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  urlCode: { type: String, required: true, unique: true },
  encryptedData: { type: String, required: true },
  iv: { type: String, required: true },
  authTag: { type: String, required: true },
  maxViews: { type: Number, required: true, default: 1 },
  viewCount: { type: Number, required: true, default: 0 },
  isDestroyed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
   userId: { type: String, required: true } 
});

// Native MongoDB TTL Index: This automatically wipes out expired rows from your DB
secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Secret', secretSchema);
