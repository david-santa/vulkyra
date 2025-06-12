import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function TeamsPage({ token }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/teams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch teams');
        return res.json();
      })
      .then(data => {
        setTeams(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Map of id -> name for quick lookup
  const parentMap = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.id] = t.name;
    return map;
  }, [teams]);

  // DataGrid columns (ALL logic inside renderCell to avoid undefined params/row)
  const columns = useMemo(() => [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    {
      field: 'parent_id',
      headerName: 'Parent Team',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        if (!params || !params.row) return null;
        const parentId = params.row.parent_id;
        if (!parentId) return <span style={{ color: '#888' }}>ROOT</span>;
        const parentName = parentMap[parentId];
        return parentName
          ? parentName
          : <span style={{ color: '#888' }}>Unknown</span>;
      }
    },
  ], [parentMap]);

  // Build RichTreeView-compatible structure
  const buildTreeData = (teamsList) => {
    const map = {};
    teamsList.forEach(team => (map[team.id] = {
      id: String(team.id),
      label: `${team.name} (${team.email})`,
      children: []
    }));
    const roots = [];
    teamsList.forEach(team => {
      if (team.parent_id && map[team.parent_id]) {
        map[team.parent_id].children.push(map[team.id]);
      } else {
        roots.push(map[team.id]);
      }
    });
    return roots;
  };

  const treeData = useMemo(() => buildTreeData(teams), [teams]);

  if (loading) return <Box p={4} display="flex" alignItems="center"><CircularProgress /> &nbsp;Loading teams...</Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Teams</Typography>
      <Paper sx={{ mb: 4 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={teams}
            columns={columns}
            getRowId={row => row.id}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            disableRowSelectionOnClick
            autoHeight={false}
          />
        </div>
      </Paper>
      {teams.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Team Hierarchy</Typography>
          <RichTreeView
            items={treeData}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ minHeight: 240, background: 'transparent' }}
          />
        </Box>
      )}
    </Box>
  );
}
