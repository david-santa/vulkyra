import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function EditAssetModal({ asset, open, onClose, onSave }) {
  const [fqdn, setFqdn] = useState('');
  const [ip, setIp] = useState('');
  const [ownerId, setOwnerId] = useState('');

  useEffect(() => {
    if (asset) {
      setFqdn(asset.FQDN || '');
      setIp(asset.IPAddress || '');
      setOwnerId(asset.OwnerID || '');
    }
  }, [asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...asset,
      FQDN: fqdn,
      IPAddress: ip,
      OwnerID: ownerId,
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
            label="IP Address"
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

  useEffect(() => {
    fetch('http://localhost:8080/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAssets);
  }, [token]);

  const handleEditClick = (asset) => {
    setEditingAsset(asset);
    setModalOpen(true);
  };

  const handleSave = (updatedAsset) => {
    fetch(`http://localhost:8080/api/assets/${updatedAsset.AssetID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedAsset)
    })
      .then(res => res.json())
      .then(saved => {
        setAssets(assets.map(a => a.AssetID === saved.AssetID ? saved : a));
        setModalOpen(false);
      });
  };

  const columns = useMemo(() => [
    { field: 'AssetID', headerName: 'ID', minWidth: 120, flex: 1 },
    { field: 'FQDN', headerName: 'FQDN', minWidth: 180, flex: 2 },
    { field: 'IPAddress', headerName: 'IP Address', minWidth: 150, flex: 2 },
    { field: 'OwnerID', headerName: 'Owner ID', minWidth: 220, flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
        </Stack>
      ),
    },
  ], [assets]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Assets</Typography>
      <Paper>
        <div style={{ height: 450, width: '100%' }}>
          <DataGrid
            rows={assets}
            columns={columns}
            getRowId={row => row.AssetID}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </div>
      </Paper>
      <EditAssetModal
        asset={editingAsset}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
