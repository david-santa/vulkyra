import React, { useEffect, useState, useRef } from 'react';

function EditAssetModal({ asset, open, onClose, onSave }) {
  const [fqdn, setFqdn] = useState('');
  const [ip, setIp] = useState('');
  const [ownerId, setOwnerId] = useState('');

  useEffect(() => {
    if (asset) {
      setFqdn(asset.fqdn || '');
      setIp(asset.ip || '');
      setOwnerId(asset.owner_id || '');
    }
  }, [asset]);

  if (!open || !asset) return null;
  return (
    <div className="modal">
      <h3>Edit Asset</h3>
      <form onSubmit={e => {
        e.preventDefault();
        onSave({
          ...asset,
          fqdn,
          ip,
          owner_id: ownerId,
        });
      }}>
        <label>FQDN: <input value={fqdn} onChange={e => setFqdn(e.target.value)} /></label><br />
        <label>IP: <input value={ip} onChange={e => setIp(e.target.value)} /></label><br />
        <label>Owner ID: <input value={ownerId} onChange={e => setOwnerId(e.target.value)} /></label><br />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

function ContextMenu({ x, y, visible, onEdit, onClose }) {
  if (!visible) return null;
  return (
    <ul className="context-menu" style={{ top: y, left: x, position: 'fixed', zIndex: 2000 }}>
      <li onClick={onEdit}>Edit</li>
      {/* Add more options here if needed */}
      <li onClick={onClose} style={{ color: '#888' }}>Cancel</li>
    </ul>
  );
}

export default function AssetsPage({ token }) {
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [contextAsset, setContextAsset] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAssets);
  }, [token]);

  // Hide context menu on click outside
  useEffect(() => {
    const handleClick = () => setMenuVisible(false);
    if (menuVisible) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuVisible]);

  function handleContextMenu(e, asset) {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setContextAsset(asset);
    setMenuVisible(true);
  }

  function handleEdit() {
    setEditingAsset(contextAsset);
    setModalOpen(true);
    setMenuVisible(false);
  }

  function handleSave(updatedAsset) {
    fetch(`http://localhost:8080/api/assets/${updatedAsset.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedAsset)
    })
      .then(res => res.json())
      .then(saved => {
        setAssets(assets.map(a => a.id === saved.id ? saved : a));
        setModalOpen(false);
      });
  }

  return (
    <div>
      <h2>Assets</h2>
      <table className="assets-table" ref={tableRef}>
        <thead>
          <tr>
            <th>ID</th><th>FQDN</th><th>IP Address</th><th>Owner ID</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id} onContextMenu={e => handleContextMenu(e, asset)}>
              <td>{asset.id}</td>
              <td>{asset.fqdn}</td>
              <td>{asset.ip}</td>
              <td>{asset.owner_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ContextMenu
        x={menuPos.x}
        y={menuPos.y}
        visible={menuVisible}
        onEdit={handleEdit}
        onClose={() => setMenuVisible(false)}
      />
      <EditAssetModal
        asset={editingAsset}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
