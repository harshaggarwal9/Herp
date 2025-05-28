import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRoles: [{
    type: String,
    enum: ['Admin', 'Teacher', 'Student', 'Parent'],
    required: true
  }],
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model('Notification', notificationSchema);
