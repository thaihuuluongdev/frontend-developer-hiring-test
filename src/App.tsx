import React from 'react';
import UsersTable from './components/UsersTable/UsersTable';
import './theme.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Users Management</h1>
      <UsersTable />
    </div>
  );
};

export default App;