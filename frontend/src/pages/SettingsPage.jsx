export default function SettingsPage({ theme, toggleTheme }) {
  return (
    <div>
      <h2>Settings</h2>
      <div style={{ marginTop: '2rem' }}>
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />{' '}
          Dark Mode
        </label>
      </div>
    </div>
  );
}
