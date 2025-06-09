import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' },
    dueDate: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Add compound unique index on title and owner
taskSchema.index({ title: 1, owner: 1 }, { unique: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;