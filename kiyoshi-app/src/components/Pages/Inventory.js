import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField, Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Inventory = () => {
  const [fishes, setFishes] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');
  const [editPriceValue, setEditPriceValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/inventory')
      .then((res) => {
        setFishes(
          res.data.map((item) => ({
            id: item.id,
            fishName: item.fishName ?? 'Unknown Fish', // Default value
            currentStock: item.currentStock ?? 0, // Default value
            currentPrice: item.currentPrice ?? 0, // Default value
            supplier: item.supplier ?? 'Unknown Supplier', // Default value
          }))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleEditClick = (fish) => {
    setEditRowId(fish.id);
    setEditStockValue(fish.currentStock);
    setEditPriceValue(fish.currentPrice);
  };

  const handleSaveClick = (fishId) => {
    axiosInstance
      .put(`/inventory/${fishId}`, {
        currentStock: editStockValue,
        currentPrice: editPriceValue,
      })
      .then(() => {
        setFishes((prevFishes) =>
          prevFishes.map((fish) =>
            fish.id === fishId
              ? { ...fish, currentStock: editStockValue, currentPrice: editPriceValue }
              : fish
          )
        );
        setEditRowId(null);
      })
      .catch((err) => console.error(err));
  };

  if (isLoading) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
        Loading inventory data...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#ef5350',
          textAlign: 'center',
        }}
      >
        Inventory Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ef5350' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fish ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fish Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Price (USD)</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Supplier</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fishes.map((fish) => (
              <TableRow key={fish.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{fish.id}</TableCell>
                <TableCell>{fish.fishName}</TableCell>
                <TableCell>
                  {editRowId === fish.id ? (
                    <TextField
                      type="number"
                      value={editStockValue}
                      onChange={(e) => setEditStockValue(e.target.value)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  ) : (
                    fish.currentStock
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === fish.id ? (
                    <TextField
                      type="number"
                      value={editPriceValue}
                      onChange={(e) => setEditPriceValue(e.target.value)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  ) : (
                    `$${fish.currentPrice.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>{fish.supplier}</TableCell>
                <TableCell align="center">
                  {editRowId === fish.id ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#26a69a',
                        '&:hover': { backgroundColor: '#1f8b7b' },
                        textTransform: 'none',
                      }}
                      onClick={() => handleSaveClick(fish.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton
                      sx={{ color: '#ef5350' }}
                      onClick={() => handleEditClick(fish)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {fishes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
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
