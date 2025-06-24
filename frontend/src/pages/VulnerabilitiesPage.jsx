import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function VulnerabilitiesPage({ token }) {
  const [vulns, setVulns] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fetching, setFetching] = useState(true);

  // Fetch vulnerabilities
  const fetchVulns = () => {
    setFetching(true);
    fetch('http://localhost:8080/api/vulnerabilities', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Use VulnID or fallback for unique row id
        const gridData = Array.isArray(data)
          ? data.map((v, i) => ({
              id: v.VulnID || `${v.AssetID}-${v.PluginID}-${i}`,
              ...v,
            }))
          : [];
        setVulns(gridData);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  };

  useEffect(fetchVulns, [token]);

  // Handle Nessus file upload
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('nessusFile', file);

      const res = await fetch('http://localhost:8080/api/nessus/upload', {
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        setUploadError(data?.error || 'Failed to import file.');
      } else {
        setImportOpen(false);
        setFile(null);
        fetchVulns(); // Refresh table
      }
    } catch (err) {
      setUploadError('Network error');
    } finally {
      setUploading(false);
    }
  };

  // DataGrid columns (PascalCase for backend consistency)
  const columns = [
    { field: 'AssetName', headerName: 'Asset Name', minWidth: 140, flex: 1 },
    { field: 'OwnerName', headerName: 'Owner Name', minWidth: 140, flex: 1 },
    { field: 'PluginID', headerName: 'Plugin ID', width: 100 },
    { field: 'PluginName', headerName: 'Plugin Name', minWidth: 180, flex: 1 },
    { field: 'Severity', headerName: 'Severity', width: 90 },
    {
      field: 'CVEs',
      headerName: 'CVE(s)',
      minWidth: 160,
      flex: 1,
      valueGetter: params =>
        Array.isArray(params.value) ? params.value.join(', ') : params.value || '',
      renderCell: params => (
        <Typography variant="body2" noWrap title={Array.isArray(params.value) ? params.value.join(', ') : params.value}>
          {Array.isArray(params.value) ? params.value.join(', ') : params.value}
        </Typography>
      ),
    },
    {
      field: 'Description',
      headerName: 'Description',
      minWidth: 200,
      flex: 2,
      renderCell: params => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Vulnerabilities</Typography>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => setImportOpen(true)}
        >
          Import
        </Button>
      </Box>
      <Box component={Paper} sx={{ height: 520, width: '100%', mb: 3 }}>
        <DataGrid
          rows={vulns}
          columns={columns}
          loading={fetching}
          disableRowSelectionOnClick
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row.id}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      {/* Import Nessus Modal */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Import Vulnerabilities (.nessus)</DialogTitle>
        <DialogContent>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{ my: 2 }}
            disabled={uploading}
          >
            Select .nessus file
            <input
              type="file"
              accept=".nessus,.xml"
              hidden
              onChange={e => setFile(e.target.files[0])}
            />
          </Button>
          <Typography variant="body2" color={file ? "primary" : "text.secondary"}>
            {file ? file.name : 'No file selected.'}
          </Typography>
          {uploadError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {uploadError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportOpen(false)} disabled={uploading}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
