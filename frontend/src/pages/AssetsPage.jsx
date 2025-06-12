import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';



function EditAssetModal({ asset, open, onClose, onSave }) {
  const [fqdn, setFqdn] = useState('');
  const [ip, setIp] = useState('');
  const [ownerId, setOwnerId] = useState('');
  

  useEffect(() => {
    if (asset) {
      setFqdn(asset.fqdn || '');
      setIp(asset.ip || '');
      setOwnerId(asset.owner_id || '');
    }
  }, [asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...asset,
      fqdn,
      ip,
      owner_id: ownerId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Asset</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="FQDN"
            value={fqdn}
            onChange={e => setFqdn(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="IP"
            value={ip}
            onChange={e => setIp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Owner ID"
            value={ownerId}
            onChange={e => setOwnerId(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function AssetsPage({ token }) {
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Context Menu state
  const [contextAsset, setContextAsset] = useState(null);
   const [menuPosition, setMenuPosition] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAssets);
  }, [token]);

  const handleContextMenu = (event, asset) => {
  event.preventDefault();
  setContextAsset(asset);
  setMenuPosition({
    mouseX: event.clientX + 2,
    mouseY: event.clientY - 6,
  });
};

  const handleSave = (updatedAsset) => {
    fetch(`http://localhost:8080/api/assets/${updatedAsset.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedAsset)
    })
      .then(res => res.json())
      .then(saved => {
        setAssets(assets.map(a => a.id === saved.id ? saved : a));
        setModalOpen(false);
      });
  };

  const handleMenuClose = () => {
  setMenuPosition(null);
};

const handleEdit = () => {
  setEditingAsset(contextAsset);
  setModalOpen(true);
  setMenuPosition(null);
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Assets</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>FQDN</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Owner ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map(asset => (
              <TableRow
                key={asset.id}
                onContextMenu={e => handleContextMenu(e, asset)}
                hover
                sx={{ cursor: 'context-menu' }}
              >
                <TableCell>{asset.id}</TableCell>
                <TableCell>{asset.fqdn}</TableCell>
                <TableCell>{asset.ip}</TableCell>
                <TableCell>{asset.owner_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Menu
        open={Boolean(menuPosition)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: '#888' }}>Cancel</MenuItem>
      </Menu>
      <EditAssetModal
        asset={editingAsset}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}