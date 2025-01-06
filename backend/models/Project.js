const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true
  },
  components: [{
    name: String,
    quantity: String,
    productLink: String,
    price: String
  }],
  teamMembers: [String],
  flowChart: String,
  status: {
    type: String,
    enum: ['Initiated', 'Approved', 'Rejected'],
    default: 'Initiated'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Add a pre-save middleware to log project creation
ProjectSchema.pre('save', function(next) {
  console.log('Saving project:', this);
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
