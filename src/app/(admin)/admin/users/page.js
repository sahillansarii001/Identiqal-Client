'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Users, Search, MoreHorizontal, Edit2, ShieldBan, Trash2, Filter, Download } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import Drawer from '@/components/ui/Drawer';
import { toast } from '@/components/ui/Toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(1, 50); // Get more for demo
      if (res.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateUserStatus(selectedUser._id, {
        role: selectedUser.role,
        isVerified: selectedUser.isVerified
      });
      if (res.success) {
        toast.success('User updated successfully');
        setUsers(users.map(u => u._id === selectedUser._id ? res.data : u));
        setIsDrawerOpen(false);
      }
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user completely?')) {
      try {
        const res = await adminService.deleteUser(userId);
        if (res.success) {
          toast.success('User deleted');
          setUsers(users.filter(u => u._id !== userId));
          if (selectedUser?._id === userId) setIsDrawerOpen(false);
        }
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const exportCSV = () => {
    const headers = ['ID,Name,Email,Role,Verified,Joined'];
    const rows = users.map(u => `${u._id},"${u.name}","${u.email}",${u.role},${u.isVerified},${new Date(u.createdAt).toISOString()}`);
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    toast.success('Export downloaded');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage platform users, roles, and access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A45B]/50 bg-white dark:bg-transparent dark:text-white transition-shadow" />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg transition-colors">
            <Filter size={16} />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonLoader type="table" rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300 text-[#5A3045] focus:ring-[#5A3045]" />
                  </th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-[#5A3045] focus:ring-[#5A3045]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-1 text-[11px] font-semibold rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md flex w-fit items-center gap-1.5 ${
                        user.isVerified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEditClick(user)} className="p-1.5 text-gray-400 hover:text-[#5A3045] hover:bg-[#5A3045]/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <form onSubmit={handleSaveUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" value={selectedUser.name} disabled className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={selectedUser.email} disabled className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select 
                value={selectedUser.role} 
                onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-[#1A1116] focus:outline-none focus:ring-2 focus:ring-[#5A3045] dark:text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox" 
                id="isVerified" 
                checked={selectedUser.isVerified}
                onChange={e => setSelectedUser({...selectedUser, isVerified: e.target.checked})}
                className="rounded border-gray-300 text-[#5A3045] focus:ring-[#5A3045]"
              />
              <label htmlFor="isVerified" className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Account</label>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10 flex flex-col gap-3">
              <button type="submit" className="w-full bg-[#5A3045] hover:bg-[#7A4055] text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                Save Changes
              </button>
              <button type="button" onClick={() => handleDelete(selectedUser._id)} className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 py-2.5 rounded-lg font-medium transition-colors">
                Delete User
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}
