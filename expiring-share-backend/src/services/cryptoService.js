const crypto = require('crypto');
require('dotenv').config();

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');

// Ensure key length is exactly 32 bytes
if (KEY.length !== 32) {
  throw new Error('Critical: ENCRYPTION_KEY in .env must be exactly 32 bytes/characters long.');
}

function encrypt(text) {
  // IV must be unique for every encryption action
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // GCM mode outputs an authTag to verify data integrity upon decryption
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag
  };
}

function decrypt(encryptedData, ivHex, authTagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

module.exports = { encrypt, decrypt };
