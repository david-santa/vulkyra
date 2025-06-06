import TeamsPage from '../pages/TeamsPage';
import AssetsPage from '../pages/AssetsPage';
import SettingsPage from '../pages/SettingsPage';

export default function MainContent({ current, message, theme, toggleTheme, token }) {
  return (
    <main className="main-content">
      {current === 'dashboard' && <p>Welcome to Vulkyra. Status: <b>{message}</b></p>}
      {current === 'teams' && <TeamsPage token={token} />}
      {current === 'assets' && <AssetsPage token={token}/>}
      {current === 'vulnerabilities' && <p>Vulnerabilities page (coming soon!)</p>}
      {current === 'settings' && <SettingsPage theme={theme} toggleTheme={toggleTheme} />}
    </main>
  );
}
