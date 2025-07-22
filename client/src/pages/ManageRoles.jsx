import React, { useEffect, useState } from "react";
import { usersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ROLES = ["user", "admin"];

export default function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [roleEdits, setRoleEdits] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll({ limit: 100 });
      setUsers(res.data.data);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleEdits((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSave = async (userId) => {
    setSavingId(userId);
    setError(null);
    try {
      const newRole = roleEdits[userId];
      await usersAPI.update(userId, { role: newRole });
      setUsers((prev) => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setRoleEdits((prev) => { const copy = { ...prev }; delete copy[userId]; return copy; });
    } catch {
      setError("Failed to update role");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Roles</h1>
      <p>Change user roles below. Only admins can access this page.</p>
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Role</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={roleEdits[user._id] ?? user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {roleEdits[user._id] && roleEdits[user._id] !== user.role && (
                    <button
                      onClick={() => handleSave(user._id)}
                      className="btn-primary px-3 py-1 rounded"
                      disabled={savingId === user._id}
                    >
                      {savingId === user._id ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 