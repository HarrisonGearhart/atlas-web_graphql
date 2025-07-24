const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  weight: { type: Number, required: true },
  description: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }  // Reference to Project
});

module.exports = mongoose.model('Task', taskSchema);
