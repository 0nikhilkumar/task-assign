import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Checkbox, Typography, TextField, Select, 
  MenuItem, FormControl, InputLabel, Box, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchTasks, updateTask, deleteTask, setSearch, setFilterStatus, setSort, setCurrentPage } from '../store/tasksSlice';
import { logout } from '../store/authSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  const { 
    tasks, status, error, totalPages, currentPage, 
    filterStatus, sort 
  } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        await dispatch(fetchTasks({ search: '', status: filterStatus, sort, page: currentPage, limit: 10 })).unwrap();
      } catch (err) {
        if (err.response && err.response.status === 401) {
          dispatch(logout());
        }
      }
    };
    fetchTasksData();
  }, [dispatch, filterStatus, sort, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    dispatch(setSearch(searchTerm));
    dispatch(setCurrentPage(1));
    try {
      await dispatch(fetchTasks({ search: searchTerm, status: filterStatus, sort, page: 1, limit: 10 })).unwrap();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (event) => {
    dispatch(setFilterStatus(event.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleSortChange = (event) => {
    dispatch(setSort(event.target.value));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (event, value) => {
    dispatch(setCurrentPage(value));
  };

  const handleStatusChange = async (task) => {
    try {
      await dispatch(updateTask({ ...task, status: !task.status })).unwrap();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleEditSubmit = async () => {
    try {
      await dispatch(updateTask({ ...editingTask, title: editTitle, description: editDescription })).unwrap();
      setEditingTask(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
      }
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Tasks
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search tasks"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          style={{width: '30%'}}
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filterStatus} onChange={handleFilterChange} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} onChange={handleSortChange} label="Sort">
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="createdAt">Created At</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id} dense>
            <Checkbox
              edge="start"
              checked={task.status}
              onChange={() => handleStatusChange(task)}
            />
            <ListItemText
              primary={task.title}
              secondary={task.description}
              style={{ textDecoration: task.status ? 'line-through' : 'none' }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={Number(currentPage)} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
      <Dialog open={!!editingTask} onClose={handleEditCancel}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList;

