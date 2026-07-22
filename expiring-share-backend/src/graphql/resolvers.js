const { nanoid } = require('nanoid');
const Secret = require('../models/Secret');
const { encrypt, decrypt } = require('../services/cryptoService');

const resolvers = {
  Query: {
    revealSecret: async (_, { urlCode }) => {
      if (!urlCode || urlCode.trim() === '') {
        throw new Error('Invalid URL code provided.');
      }

      const secret = await Secret.findOne({ urlCode });

      // 1. Check existence
      if (!secret) {
        throw new Error('This secure payload has expired or already been deleted.');
      }

      // 2. Extra verification check for expiration time
      if (new Date() > secret.expiresAt) {
        await Secret.deleteOne({ urlCode });
        throw new Error('This secure payload has expired or already been deleted.');
      }

      // 3. Decrypt in memory
      let decryptedContent;
      try {
        decryptedContent = decrypt(secret.encryptedData, secret.iv, secret.authTag);
      } catch (err) {
        console.error('Decryption error for code:', urlCode, err);
        await Secret.deleteOne({ urlCode }); // Clean up corrupted records
        throw new Error('Failed to decrypt data. The record might be corrupted.');
      }

      // 4. Update metrics or destroy atomically using a transaction
      const newViewCount = secret.viewCount + 1;
      
      if (newViewCount >= secret.maxViews) {
        await Secret.deleteOne({ urlCode }); // Self-destruct block
        return { 
          decryptedContent,
          // Optionally add metadata to indicate this was the last view
        };
      } else {
        // Atomic update to prevent race conditions
        const updated = await Secret.findOneAndUpdate(
          { urlCode, viewCount: secret.viewCount }, // Optimistic locking
          { $inc: { viewCount: 1 } },
          { new: true }
        );
        
        // If update failed (race condition), return error
        if (!updated) {
          throw new Error('Could not update view count. Please try again.');
        }
      }

      return { decryptedContent };
    },

   getUserLogs: async (_, { userId }) => {
      // Fetch latest 10 items for the authenticated user
      return await Secret.find({ userId }).sort({ createdAt: -1 }).limit(10);
    }
  },

  Mutation: {
     generateSecretLink: async (_, { plainTextContent, expirationMinutes, allowedViews, userId }) => {
    // Input validation
    if (!plainTextContent || plainTextContent.trim() === '') {
      throw new Error('Content cannot be blank.');
    }

    if (expirationMinutes <= 0 || expirationMinutes > 43200) { // Max 30 days
      throw new Error('Expiration must be between 1 minute and 30 days.');
    }

    if (allowedViews <= 0 || allowedViews > 1000) {
      throw new Error('Allowed views must be between 1 and 1000.');
    }

    // Add userId validation
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required.');
    }

    // 1. Generate code and encrypt text
    const urlCode = nanoid(8);
    const { encryptedData, iv, authTag } = encrypt(plainTextContent);

    // 2. Calculate expiration timeline
    const expiresAt = new Date(Date.now() + expirationMinutes * 60000);

    // 3. Persist to MongoDB database
    try {
      await Secret.create({
        urlCode,
        encryptedData,
        iv,
        authTag,
        maxViews: allowedViews,
        expiresAt,
        userId // Now properly validated
      });
    } catch (dbError) {
      console.error("❌ RAW MONGOOSE SAVE ERROR:", dbError); 
      throw new Error('Failed to save secret. Please try again.');
    }

    return { urlCode };
  },

   revokeSecret: async (_, { urlCode }) => {
  if (!urlCode || urlCode.trim() === '') {
    throw new Error('URL code is required');
  }
  
  const secret = await Secret.findOne({ urlCode });
  if (!secret) {
    throw new Error('Secret not found or already destroyed');
  }

  // Instead of setting fields to null (which fails validation),
  // either delete the document entirely or use findOneAndDelete
  const result = await Secret.findOneAndDelete({ urlCode });
  
  // Return true if a document was deleted, false otherwise
  return !!result;
}
  }
};

module.exports = resolvers;