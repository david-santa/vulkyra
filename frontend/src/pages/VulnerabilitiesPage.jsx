import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
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
        setVulns(Array.isArray(data) ? data : []);
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
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset ID</TableCell>
              <TableCell>Plugin ID</TableCell>
              <TableCell>Plugin Name</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>CVE(s)</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : vulns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#888' }}>
                  No vulnerabilities found.
                </TableCell>
              </TableRow>
            ) : (
              vulns.map(vuln => (
                <TableRow key={vuln.id || `${vuln.asset_id}-${vuln.plugin_id}`}>
                  <TableCell>{vuln.asset_id}</TableCell>
                  <TableCell>{vuln.plugin_id}</TableCell>
                  <TableCell>{vuln.plugin_name}</TableCell>
                  <TableCell>{vuln.severity}</TableCell>
                  <TableCell>{Array.isArray(vuln.cves) ? vuln.cves.join(', ') : vuln.cves}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250 }} noWrap title={vuln.description}>
                      {vuln.description}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

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
