import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const EditTaskForm = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ ...task, title, description });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 4 }}>
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        margin="normal"
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          Update Task
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditTaskForm;

