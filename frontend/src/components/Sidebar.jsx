import logo from '../assets/vulkyra-logo.png';

export default function Sidebar({ current, setCurrent }) {
  return (
    <nav className="sidebar">
      <img src={logo} alt="Vulkyra logo" className="logo-img-sidebar" />
      <button className={current === 'dashboard' ? 'active' : ''} onClick={() => setCurrent('dashboard')}>Dashboard</button>
      <button className={current === 'teams' ? 'active' : ''} onClick={() => setCurrent('teams')}>Teams</button>
      <button className={current === 'assets' ? 'active' : ''} onClick={() => setCurrent('assets')}>Assets</button>
      <button className={current === 'vulnerabilities' ? 'active' : ''} onClick={() => setCurrent('vulnerabilities')}>Vulnerabilities</button>
      <button className={current === 'settings' ? 'active' : ''} onClick={() => setCurrent('settings')}>Settings</button>
    </nav>
  );
}
