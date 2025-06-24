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

  // Map of TeamID -> TeamName for quick lookup
  const parentMap = useMemo(() => {
    const map = {};
    for (const t of teams) map[t.TeamID] = t.TeamName;
    return map;
  }, [teams]);

  // DataGrid columns using PascalCase field names
  const columns = useMemo(() => [
    { field: 'TeamName', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'TeamEmail', headerName: 'Email', flex: 1, minWidth: 200 },
    {
      field: 'ParentID',
      headerName: 'Parent Team',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        if (!params || !params.row) return null;
        const parentId = params.row.ParentID;
        if (!parentId) return <span style={{ color: '#888' }}>ROOT</span>;
        const parentName = parentMap[parentId];
        return parentName
          ? parentName
          : <span style={{ color: '#888' }}>Unknown</span>;
      }
    },
  ], [parentMap]);

  // Build RichTreeView-compatible structure using PascalCase field names
  const buildTreeData = (teamsList) => {
    const map = {};
    teamsList.forEach(team => (map[team.TeamID] = {
      id: String(team.TeamID),
      label: `${team.TeamName} (${team.TeamEmail})`,
      children: []
    }));
    const roots = [];
    teamsList.forEach(team => {
      if (team.ParentID && map[team.ParentID]) {
        map[team.ParentID].children.push(map[team.TeamID]);
      } else {
        roots.push(map[team.TeamID]);
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
            getRowId={row => row.TeamID}
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
            defaultExpandedItems={treeData}
            sx={{ minHeight: 240, background: 'transparent' }}
          />
        </Box>
      )}
    </Box>
  );
}
