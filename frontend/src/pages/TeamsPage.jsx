import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
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

  // Build RichTreeView-compatible structure
  const buildTreeData = (teamsList) => {
  const map = {};
  teamsList.forEach(team => (map[team.id] = {
    id: String(team.id),
    label: `${team.name} (${team.email})`,  // <-- must be a string
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

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div style={{ color: 'red' }}> Error: {error} </div>;

  const treeData = buildTreeData(teams);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Teams</Typography>
      <Paper sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Parent Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: "center", color: "#888" }}>
                  No teams found.
                </TableCell>
              </TableRow>
            ) : (
              teams.map(team => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.email}</TableCell>
                  <TableCell>
                    {team.parent_id
                      ? (teams.find(t => t.id === team.parent_id)?.name || <span style={{ color: '#888' }}>Unknown</span>)
                      : <span style={{ color: '#888' }}>ROOT</span>
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      {teams.length > 0 && (
        <Box className="teams-tree-container">
          <Typography variant="h6" sx={{ mb: 1 }}>Team Hierarchy</Typography>
          <RichTreeView
            items={treeData}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ minHeight: 240, background: "transparent" }}
          />
        </Box>
      )}
    </Box>
  );
}
