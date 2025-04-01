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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { backgroundColor: 'rgba(255, 235, 59, 0.1)', scale: 1.01, transition: { duration: 0.2 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Sawarabi Mincho', serif",
              color: '#ffeb3b',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            Loading Sushi Inventory...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 4,
        p: { xs: 2, sm: 3, md: 4 },
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        borderRadius: '20px',
        minHeight: '100vh',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        maxWidth: '1400px',
        mx: 'auto',
      }}
    >
      <motion.div variants={headerVariants} initial="hidden" animate="visible">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "'Sawarabi Mincho', serif",
            fontWeight: 'bold',
            color: '#ffeb3b', // Gold for top-tier
            textAlign: 'center',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            background: 'linear-gradient(45deg, #ff5722, #ffeb3b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            borderBottom: '2px solid #ffeb3b',
            pb: 1,
            mb: 4,
          }}
        >
          Sushi Inventory Management
        </Typography>
      </motion.div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '15px',
          background: 'rgba(255, 255, 255, 0.15)', // Enhanced glassmorphism
          backdropFilter: 'blur(12px)',
          mt: 3,
          border: '1px solid rgba(255, 235, 59, 0.3)', // Gold border
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(90deg, #388e3c 0%, #2e6b27 100%)', // Seaweed green gradient
                borderBottom: '2px solid #ffeb3b', // Gold accent
              }}
            >
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: "'Sawarabi Mincho', serif" }}>
                Item ID
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: "'Sawarabi Mincho', serif" }}>
                Item Name
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: "'Sawarabi Mincho', serif" }}>
                Stock
              </TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: "'Sawarabi Mincho', serif" }}>
                Price (USD)
              </TableCell>
              <TableCell
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: "'Sawarabi Mincho', serif",
                  textAlign: 'center',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <motion.tr key={item.id} variants={rowVariants} initial="hidden" animate="visible" whileHover="hover">
                <TableCell sx={{ color: '#ddd', fontFamily: "'Sawarabi Mincho', serif" }}>{item.id}</TableCell>
                <TableCell sx={{ color: '#ddd', fontFamily: "'Sawarabi Mincho', serif" }}>
                  {item.itemName}
                </TableCell>
                <TableCell sx={{ color: '#ffeb3b', fontFamily: "'Sawarabi Mincho', serif" }}>
                  {editRowId === item.id ? (
                    <TextField
                      type="number"
                      value={editStockValue}
                      onChange={(e) => setEditStockValue(e.target.value)}
                      size="small"
                      sx={{
                        width: 80,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '5px',
                        '& .MuiInputBase-input': { color: '#fff', textAlign: 'center' },
                      }}
                    />
                  ) : (
                    item.currentStock
                  )}
                </TableCell>
                <TableCell sx={{ color: '#ffeb3b', fontFamily: "'Sawarabi Mincho', serif" }}>
                  {editRowId === item.id ? (
                    <TextField
                      type="number"
                      value={editPriceValue}
                      onChange={(e) => setEditPriceValue(e.target.value)}
                      size="small"
                      sx={{
                        width: 80,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '5px',
                        '& .MuiInputBase-input': { color: '#fff', textAlign: 'center' },
                      }}
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
                          background: 'linear-gradient(45deg, #ff5722, #e64a19)',
                          borderRadius: '20px',
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                          '&:hover': { background: '#e64a19' },
                          textTransform: 'none',
                        }}
                        onClick={() => handleSaveClick(item.id)}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                    </motion.div>
                  ) : (
                    <IconButton
                      sx={{ color: '#fff', '&:hover': { color: '#ffeb3b' } }}
                      onClick={() => handleEditClick(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </motion.tr>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#b0bec5', fontFamily: "'Sawarabi Mincho', serif" }}>
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