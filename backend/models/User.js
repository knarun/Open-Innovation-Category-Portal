const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rollNo: { type: String, unique: true },
  department: String,
  labName: String,
  labCode: String,
  phoneNo: String,
  isAdmin: { type: Boolean, default: false },
  projects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project'
  }]
});

module.exports = mongoose.model('User', UserSchema);
