import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import {
  Box, Typography, Table, TableContainer, TableHead, TableBody,
  TableRow, TableCell, Paper, IconButton, TextField, Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');
  const [editPriceValue, setEditPriceValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/api/inventory')
      .then((res) => {
        console.log('Inventory response:', res.data);
        setItems(
          res.data.map((item) => ({
            id: item.id,
            itemName: item.itemName ?? 'Unknown Item',
            currentStock: item.currentStock ?? 0,
            currentPrice: item.currentPrice ?? 0,
          }))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching inventory:', err.response?.data || err.message);
        setIsLoading(false);
      });
  }, []);

  const handleEditClick = (item) => {
    setEditRowId(item.id);
    setEditStockValue(item.currentStock);
    setEditPriceValue(item.currentPrice);
  };

  const handleSaveClick = (itemId) => {
    axiosInstance
      .put(`/api/inventory/${itemId}`, {
        currentStock: parseInt(editStockValue, 10),
        currentPrice: parseFloat(editPriceValue),
      })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, currentStock: parseInt(editStockValue, 10), currentPrice: parseFloat(editPriceValue) }
              : item
          )
        );
        setEditRowId(null);
      })
      .catch((err) => console.error('Error updating inventory:', err.response?.data || err.message));
  };

  if (isLoading) {
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', mt: 5, fontFamily: "'Sawarabi Mincho', serif", color: '#fff' }}
      >
        Loading sushi inventory...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)', // Sushi-themed gradient
        borderRadius: 2,
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontWeight: 'bold',
            color: '#ff5722', // Salmon orange
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Sushi Inventory Management
        </Typography>
      </motion.div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism
          backdropFilter: 'blur(10px)',
          mt: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#388e3c' }}> {/* Seaweed green */}
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Item ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Item Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Price (USD)</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <motion.tr key={item.id} variants={rowVariants} initial="hidden" animate="visible" whileHover="hover">
                <TableCell sx={{ color: '#fff' }}>{item.id}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{item.itemName}</TableCell>
                <TableCell sx={{ color: '#ffeb3b' }}>
                  {editRowId === item.id ? (
                    <TextField
                      type="number"
                      value={editStockValue}
                      onChange={(e) => setEditStockValue(e.target.value)}
                      size="small"
                      sx={{ width: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', '& .MuiInputBase-input': { color: '#fff' } }}
                    />
                  ) : (
                    item.currentStock
                  )}
                </TableCell>
                <TableCell sx={{ color: '#ffeb3b' }}>
                  {editRowId === item.id ? (
                    <TextField
                      type="number"
                      value={editPriceValue}
                      onChange={(e) => setEditPriceValue(e.target.value)}
                      size="small"
                      sx={{ width: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', '& .MuiInputBase-input': { color: '#fff' } }}
                    />
                  ) : (
                    `$${Number(item.currentPrice).toFixed(2)}`
                  )}
                </TableCell>
                <TableCell align="center">
                  {editRowId === item.id ? (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#ff5722', // Salmon orange
                          '&:hover': { backgroundColor: '#e64a19' },
                        }}
                        onClick={() => handleSaveClick(item.id)}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                    </motion.div>
                  ) : (
                    <IconButton sx={{ color: '#fff' }} onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </motion.tr>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#b0bec5' }}>
                  No sushi items in inventory
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;