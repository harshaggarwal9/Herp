import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  class: {
    type: mongoose.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    required: true
  },
  startTime: { type: String, required: true },  // e.g. '09:00'
  endTime:   { type: String, required: true }   // e.g. '09:45'
}, { timestamps: true });

// ◆ Enforce “only one lecture per class/day/time”
//    This creates a unique index across class, day, startTime.
slotSchema.index(
  { class: 1, day: 1, startTime: 1 },
  { unique: true, name: 'unique_class_day_time' }
);

export default mongoose.model('TimetableSlot', slotSchema);
