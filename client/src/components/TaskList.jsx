import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Checkbox, Typography, TextField, Select, 
  MenuItem, FormControl, InputLabel, Box, Pagination
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchTasks, updateTask, deleteTask, setSearch, setFilterStatus, setSort, setCurrentPage } from '../store/tasksSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  const {
    tasks, status, error, totalPages, currentPage,
    filterStatus, sort
  } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks({ search: searchTerm, status: filterStatus, sort, page: currentPage, limit: 10 }));
  }, [dispatch, searchTerm, filterStatus, sort, currentPage]);

  useEffect(() => {
    if (status === 'loading' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [status]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    dispatch(setSearch(value));
    dispatch(setCurrentPage(1));
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

  const handleStatusChange = (task) => {
    dispatch(updateTask({ ...task, status: !task.status }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
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
          inputRef={searchInputRef}
          fullWidth
        />
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
          <ListItem key={task._id} dense button>
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
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
    </Box>
  );
};

export default TaskList;
