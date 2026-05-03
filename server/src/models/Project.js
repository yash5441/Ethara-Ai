import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  members: [{
    userId: String,
    userName: String,
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', projectSchema);
