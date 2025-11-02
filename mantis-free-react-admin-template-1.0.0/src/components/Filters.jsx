import React from 'react';
import { Box, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

const Filters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, searchPlaceholder }) => (
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
    <Box sx={{ flex: 1, position: 'relative' }}>
      <TextField
        fullWidth
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} sx={{ color: 'grey.500' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-root': { pl: 4, fontSize: '0.875rem' },
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '& fieldset': { borderColor: 'grey.300' },
            '&:hover fieldset': { borderColor: 'grey.500' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
    </Box>
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      sx={{
        minWidth: 120,
        fontSize: '0.875rem',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
      }}
    >
      <MenuItem value="All">All Status</MenuItem>
      <MenuItem value="Active">Active</MenuItem>
      <MenuItem value="Inactive">Inactive</MenuItem>
    </Select>
  </Box>
);

export default Filters;