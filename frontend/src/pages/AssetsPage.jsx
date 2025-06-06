import React, { useEffect, useState } from 'react';

export default function AssetsPage({token}) {
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
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.fqdn}</td>
              <td>{asset.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
