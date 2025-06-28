// noinspection JSUnresolvedReference

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
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
  const [fetchError, setFetchError] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  // Fetch vulnerabilities (async/await, error handling, env var)
  const fetchVulns = async () => {
    setFetching(true);
    setFetchError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/vulnerabilities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch vulnerabilities');
      const data = await res.json();
      const gridData = Array.isArray(data)
        ? data.map((v, i) => ({
            id: v.VulnID || `${v.AssetID}-${v.PluginID}-${i}`,
            ...v,
          }))
        : [];
      setVulns(gridData);
    } catch (err) {
      setFetchError(err.message);
      setVulns([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchVulns(); }, [token]);

  // Handle Nessus file upload
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('nessusFile', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/nessus/upload`, {
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

  // Memoize columns
  const columns = useMemo(() => [
    { field: 'asset_name', headerName: 'Asset Name', minWidth: 140, flex: 1 },
    { field: 'owner_name', headerName: 'Owner Name', minWidth: 140, flex: 1 },
    { field: 'plugin_id', headerName: 'Plugin ID', width: 100 },
    { field: 'plugin_name', headerName: 'Plugin Name', minWidth: 180, flex: 1 },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 110,
      renderCell: (params) => {
        const sev = Number(params.value);
        let label = 'Info';
        if (sev === 1) label = 'Low';
        else if (sev === 2) label = 'Medium';
        else if (sev === 3) label = 'High';
        else if (sev === 4) label = 'Critical';
        return (
          <Typography variant="body2" color={
            sev === 1 ? 'primary' :
            sev === 2 ? 'warning.main' :
            sev === 3 ? 'error' :
            sev === 4 ? 'error' : 'text.secondary'
          }>
            {label}
          </Typography>
        );
      },
    },
    {
      field: 'cves',
      headerName: 'CVE(s)',
      minWidth: 160,
      flex: 1,
      valueGetter: (params) => {
        const cves = params?.row?.cves;
        if (Array.isArray(cves)) return cves.join(', ');
        if (typeof cves === "string") return cves;
        return '';
      },
      renderCell: (params) => {
        const cves = params?.row?.cves;
        const display = Array.isArray(cves) ? cves.join(', ') : (typeof cves === "string" ? cves : '');
        return (
          <Typography variant="body2" noWrap title={display} aria-label="CVE list">
            {display}
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 200,
      flex: 2,
      renderCell: params => (
        <Typography variant="body2" noWrap title={params.value} aria-label="Description">
          {params.value}
        </Typography>
      ),
    },
  ], []);

  // Filter vulnerabilities based on showInfo switch
  const filteredVulns = useMemo(() =>
    showInfo ? vulns : vulns.filter(v => Number(v.severity) > 0),
    [vulns, showInfo]
  );

  // Reset file input after upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    e.target.value = null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Vulnerabilities</Typography>
        <FormControlLabel
          control={<Switch checked={showInfo} onChange={e => setShowInfo(e.target.checked)} color="primary" />}
          label="Show Info Level"
        />
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => setImportOpen(true)}
          aria-label="Open import dialog"
        >
          Import
        </Button>
      </Box>
      {fetchError && (
        <Typography color="error" sx={{ mb: 2 }}>{fetchError}</Typography>
      )}
      <Box component={Paper} sx={{ height: 520, width: '100%', mb: 3 }}>
        <DataGrid
          rows={filteredVulns}
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
            aria-label="Select .nessus file"
          >
            Select .nessus file
            <input
              type="file"
              accept=".nessus,.xml"
              hidden
              onChange={handleFileChange}
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
            aria-label="Import selected file"
          >
            {uploading ? "Uploading..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
