const mongoose = require('mongoose');
const crypto = require('crypto');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
}, { timestamps: true });

// Generates a random 8-character uppercase code, e.g. "K3F9XQ2P"
function generateCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Static method: keeps generating a code until it finds one that isn't already taken
companySchema.statics.generateUniqueJoinCode = async function () {
  let code;
  let exists = true;
  while (exists) {
    code = generateCode();
    exists = await this.findOne({ joinCode: code });
  }
  return code;
};

module.exports = mongoose.model('Company', companySchema);