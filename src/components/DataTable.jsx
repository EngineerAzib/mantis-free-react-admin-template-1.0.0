import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Download, Eye, Edit, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { debounce } from 'lodash';
import Loader from './Loader';

const DataTable = ({
  data = [],
  columns = [],
  tableTitle = 'Table',
  TableIcon = null,
  handleOpenModal = () => {},
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onSearch = () => {},
  totalCount = 0,
  currentPage = 1,
  itemsPerPage = 10,
  isLoading = false,
  actions = [
    { icon: Eye, onClick: () => {}, label: 'View', hoverColor: 'primary.main' },
    { icon: Edit, onClick: () => {}, label: 'Edit', hoverColor: 'success.main' },
    { icon: Trash2, onClick: () => {}, label: 'Delete', hoverColor: 'error.main' },
  ],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(tableTitle.toLowerCase(), value);
        onPageChange(tableTitle.toLowerCase(), 1);
      }, 500),
    [onSearch, onPageChange, tableTitle]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? '';
      const bValue = b[sortConfig.key] ?? '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.header).join(','),
      ...sortedData.map((item) => columns.map((col) => (item[col.accessor] ?? '').toString()).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableTitle.toLowerCase()}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {TableIcon && (
            <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
              <TableIcon size={24} sx={{ color: 'primary.main' }} />
            </Box>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {tableTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalCount} total records
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleExport}
            startIcon={<Download size={16} />}
            variant="outlined"
            sx={{ px: 2, py: 1, fontSize: '0.875rem', textTransform: 'none' }}
          >
            Export
          </Button>
          <Button
            onClick={() => handleOpenModal(tableTitle.toLowerCase().slice(0, -1))}
            startIcon={<Plus size={16} />}
            variant="contained"
            sx={{ px: 2, py: 1, fontSize: '0.875rem', textTransform: 'none' }}
          >
            Add New
          </Button>
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label={`Search ${tableTitle.toLowerCase()}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          sx={{ maxWidth: 300 }}
        />
      </Box>
      <Paper sx={{ overflowX: 'auto', border: 1, borderColor: 'grey.200', borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.accessor}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    cursor: column.sortable !== false ? 'pointer' : 'default',
                    '&:hover': column.sortable !== false ? { bgcolor: 'grey.100' } : {},
                  }}
                  onClick={() => column.sortable !== false && handleSort(column.accessor)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption">{column.header}</Typography>
                    {column.sortable !== false && (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <ChevronUp
                          size={12}
                          sx={{ color: sortConfig.key === column.accessor && sortConfig.direction === 'asc' ? 'primary.main' : 'grey.300' }}
                        />
                        <ChevronDown
                          size={12}
                          sx={{
                            mt: -0.5,
                            color: sortConfig.key === column.accessor && sortConfig.direction === 'desc' ? 'primary.main' : 'grey.300',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
              <TableCell
                sx={{ fontSize: '0.75rem', fontWeight: 'medium', textTransform: 'uppercase', color: 'text.secondary', textAlign: 'right' }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                {columns.map((column) => (
                  <TableCell key={column.accessor} sx={{ fontSize: '0.875rem', py: 2 }}>
                    {column.render ? column.render(item[column.accessor], item) : item[column.accessor] ?? 'N/A'}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: 'right', py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {actions.map((action, index) => (
                      <IconButton
                        key={index}
                        size="small"
                        onClick={() => action.onClick(item)}
                        sx={{ color: 'grey.500', '&:hover': { color: action.hoverColor || 'primary.main' } }}
                        title={action.label}
                      >
                        <action.icon size={16} />
                      </IconButton>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2, py: 1, bgcolor: 'grey.50', borderTop: 1, borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Show
          </Typography>
          <Select
            value={itemsPerPage}
            onChange={(e) => {
              onPageSizeChange(tableTitle.toLowerCase(), Number(e.target.value));
              onPageChange(tableTitle.toLowerCase(), 1);
            }}
            sx={{ fontSize: '0.875rem', height: 32 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            entries
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => onPageChange(tableTitle.toLowerCase(), Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              variant="outlined"
              sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: '0.875rem' }}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => onPageChange(tableTitle.toLowerCase(), index + 1)}
                variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                sx={{ minWidth: 0, px: 2, py: 0.5, fontSize: '0.875rem' }}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => onPageChange(tableTitle.toLowerCase(), Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outlined"
              sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: '0.875rem' }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DataTable;