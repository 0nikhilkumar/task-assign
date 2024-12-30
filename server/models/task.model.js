import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });

export const Task = mongoose.model('Task', taskSchema);
