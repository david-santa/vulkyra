import React, { useEffect, useState } from 'react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // Find parent name helper
  const getParentName = (parentId) => {
    if (!parentId) return <span style={{ color: '#888' }}>ROOT</span>;
    const parent = teams.find(t => t.id === parentId);
    return parent ? parent.name : <span style={{ color: '#888' }}>Unknown</span>;
  };

  // Build tree structure from flat array
  const buildTeamTree = (teamsList) => {
    const map = {};
    teamsList.forEach(team => (map[team.id] = { ...team, children: [] }));
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

  // Recursive rendering of tree
  const renderTree = (nodes) => (
    <ul className="teams-tree">
      {nodes.map(node => (
        <li key={node.id}>
          <span className="team-node" style={{ fontWeight: node.parent_id == null ? 'bold' : 'normal' }}>
            {node.name}
            <span className="team-email">({node.email})</span>
          </span>
          {node.children && node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  if (loading) return <div>Loading teams...</div>;

  const treeRoots = buildTeamTree(teams);

  return (
    <div>
      <h2>Teams</h2>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Parent Team</th>
          </tr>
        </thead>
        <tbody>
          {teams.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                No teams found.
              </td>
            </tr>
          ) : (
            teams.map(team => (
              <tr key={team.id}>
                <td data-label="Name">{team.name}</td>
                <td data-label="Email">{team.email}</td>
                <td data-label="Parent Team">{getParentName(team.parent_id)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {teams.length > 0 && (
        <div className="teams-tree-container">
          <h3 style={{ marginBottom: '0.5em' }}>Team Hierarchy</h3>
            {renderTree(treeRoots)}
        </div>
      )}
    </div>
  );
}
