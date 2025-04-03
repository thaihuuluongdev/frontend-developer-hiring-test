import React, { useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import './VirtualizedTable.css';
import { TUser } from '../../types/user';
import { formatBalance, formatDate, formatDateTimeDetailed } from '../../utils/format';

interface VirtualizedTableProps {
  users: TUser[];
  selectedRows: Set<string>;
  toggleRowSelection: (userId: string) => void;
  sortConfig: {
    key: keyof TUser;
    direction: 'asc' | 'desc';
  } | null;
  requestSort: (key: keyof TUser) => void;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  users,
  selectedRows,
  toggleRowSelection,
  sortConfig,
  requestSort
}) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < users.length;
    }
  }, [selectedRows, users.length]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = users[index];

    return (
      <div style={style} className="virtual-row">
        <div>
          <input
            type="checkbox"
            checked={selectedRows.has(user.id)}
            onChange={() => toggleRowSelection(user.id)}
          />
        </div>
        <div>{user.name}</div>
        <div>{formatBalance(user.balance)}</div>
        <div><a href={`mailto:${user.email}`}>{user.email}</a></div>
        <div className="registration-cell">
          <span className="registration-date">
            {formatDate(user.registerAt)}
          </span>
          <div className="registration-tooltip">
            {formatDateTimeDetailed(user.registerAt)}
          </div>
        </div>
        <div className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
          {user.active ? 'Active' : 'Inactive'}
        </div>
        <div>
          <button className="action-btn">✔️</button>
          <button className="action-btn">☆</button>
        </div>
      </div>
    );
  };

  const Header = () => (
    <div className="virtual-header">
      <div>
        <input
          type="checkbox"
          ref={selectAllCheckboxRef}
          checked={selectedRows.size === users.length && users.length > 0}
          onChange={() => {
            if (selectedRows.size === users.length) {
              users.forEach(user => toggleRowSelection(user.id));
            } else {
              users.forEach(user => {
                if (!selectedRows.has(user.id)) toggleRowSelection(user.id);
              });
            }
          }}
        />
      </div>
      <div onClick={() => requestSort('name')}>
        Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
      </div>
      <div onClick={() => requestSort('balance')}>
        Balance {sortConfig?.key === 'balance' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
      </div>
      <div onClick={() => requestSort('email')}>
        Email {sortConfig?.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
      </div>
      <div onClick={() => requestSort('registerAt')}>
        Registered {sortConfig?.key === 'registerAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
      </div>
      <div>Status</div>
      <div>Actions</div>
    </div>
  );

  return (
    <div className="virtual-container">
      <Header />
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            className="virtual-table"
            height={height - 40}
            itemCount={users.length}
            itemSize={60}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedTable;