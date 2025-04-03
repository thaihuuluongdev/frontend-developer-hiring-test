import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TUser } from '../../types/user';
import { fetchUsers } from '../../utils/api';
import { formatBalance, formatDate } from '../../utils/format';
import Pagination from '../Pagination/Pagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useSortableData } from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import VirtualizedTable from '../VirtualizedTable/VirtualizedTable';
import './UsersTable.css';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState<'pagination' | 'virtual'>('pagination');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const { sortedItems, requestSort, sortConfig } = useSortableData(users);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return sortedItems.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [sortedItems, filter]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleRowSelection = (userId: string) => {
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === currentUsers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentUsers.map(user => user.id)));
    }
  };

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < currentUsers.length;
    }
  }, [selectedRows, currentUsers]);


  const getSortIndicator = (key: keyof TUser) => {
    if (!sortConfig) return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return null;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`users-management ${darkMode ? 'dark' : 'light'}`}>
      <div className="controls">
        <button onClick={toggleDarkMode}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <button onClick={() => setViewMode(prev =>
          prev === 'pagination' ? 'virtual' : 'pagination'
        )}>
          Switch to {viewMode === 'pagination' ? 'Virtual Scroll' : 'Pagination'}
        </button>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
        />

        {viewMode === 'pagination' && (
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                Show {size} per page
              </option>
            ))}
          </select>
        )}
      </div>

      {viewMode === 'pagination' ? (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      ref={selectAllCheckboxRef}
                      checked={selectedRows.size === currentUsers.length && currentUsers.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th onClick={() => requestSort('name')}>
                    Name {getSortIndicator('name')}
                  </th>
                  <th onClick={() => requestSort('balance')}>
                    Balance {getSortIndicator('balance')}
                  </th>
                  <th onClick={() => requestSort('email')}>
                    Email {getSortIndicator('email')}
                  </th>
                  <th onClick={() => requestSort('registerAt')}>
                    Registration {getSortIndicator('registerAt')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{formatBalance(user.balance)}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td title={user.registerAt.toLocaleString()}>
                      {formatDate(user.registerAt)}
                    </td>
                    <td>
                      <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">✔️</button>
                      <button className="action-btn">☆</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <div className="summary">
            Showing {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(
              currentPage * rowsPerPage,
              filteredUsers.length
            )} of {filteredUsers.length} users
          </div>
        </>
      ) : (
        <VirtualizedTable 
          users={filteredUsers}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
      )}
    </div>
  );
};

export default UsersTable;