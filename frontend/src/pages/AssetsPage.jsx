import React, { useEffect, useState } from 'react';

export default function AssetsPage({token}) {
  const [teams, setTeams] = useState([])
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/assets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assets');
        return res.json();
      })
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
      fetch('http://localhost:8080/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setTeams(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }, []);

  const getOwnerTeamName = (owner_id) => {
    if (!owner_id) return <span>Unassigned</span>;
    const owner_team_name = teams.find(t => t.id === owner_id);
    return owner_team_name ? owner_team_name.name : <span>Unassigned</span>
  }

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (assets.length === 0) return <div>No assets found.</div>;

  return (
    <div>
      <h2>Assets</h2>
      <table className="assets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FQDN</th>
            <th>IP Address</th>
            <th>Owned by</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.fqdn}</td>
              <td>{asset.ip}</td>
              <td>{getOwnerTeamName(asset.owner_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
