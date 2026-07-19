'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Users, Search, Edit2, Trash2, Filter, Download, Eye, Key, UserPlus, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await adminService.updateUserStatus(selectedUser._id, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        isVerified: selectedUser.isVerified
      });
      if (res.success) {
        toast.success('User updated successfully');
        setUsers(users.map(u => u._id === selectedUser._id ? res.data : u));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    try {
      const res = await adminService.createUser(newUserForm);
      if (res.success) {
        toast.success('User created successfully');
        setUsers([res.data, ...users]); // Optimistic prepend
        setIsCreateModalOpen(false);
        setNewUserForm({ name: '', email: '', password: '', role: 'user' });
      } else {
        toast.error(res.message || 'Failed to create user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    try {
      const res = await adminService.changeUserPassword(selectedUser._id, { newPassword });
      if (res.success) {
        toast.success('Password updated successfully');
        setIsPasswordModalOpen(false);
        setNewPassword('');
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user completely?')) {
      try {
        const res = await adminService.deleteUser(userId);
        if (res.success) {
          toast.success('User deleted');
          setUsers(users.filter(u => u._id !== userId));
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
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl transition-all shadow-md active:scale-95">
            <UserPlus size={16} />
            Add New User
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-[#1A1A1A] dark:text-gray-300 dark:border-[#2A2A2A] dark:hover:bg-[#252525] transition-all shadow-sm active:scale-95">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-transparent">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:border-slate-400 dark:focus:border-gray-500 bg-white dark:bg-[#1A1A1A] dark:text-white transition-all shadow-sm placeholder:text-gray-400" />
          </div>
          <button className="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl transition-all shadow-sm active:scale-95">
            <Filter size={16} />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonLoader type="table" rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-[#2A2A2A] dark:to-[#333] flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-inner">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium">
                        {user.isVerified ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-gray-700 dark:text-gray-300">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-amber-500" />
                            <span className="text-gray-700 dark:text-gray-300">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleViewClick(user)} className="p-2 text-gray-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-lg transition-all" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditClick(user)} className="p-2 text-gray-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-lg transition-all" title="Edit User">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handlePasswordClick(user)} className="p-2 text-gray-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] dark:hover:text-white rounded-lg transition-all" title="Change Password">
                          <Key size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all" title="Delete User">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                        <p>No users found in the system.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <Modal 
          isOpen={isViewModalOpen} 
          onClose={() => setIsViewModalOpen(false)} 
          title="User Profile"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-[#252525]">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1A1A1A] flex items-center justify-center text-2xl font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-white/5">
                {selectedUser.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedUser.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#2A2A2A]">
                <span className="block text-gray-500 dark:text-gray-400 text-[13px] mb-1 font-medium">System ID</span>
                <span className="font-mono text-gray-900 dark:text-white">{selectedUser._id}</span>
              </div>
              <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#2A2A2A]">
                <span className="block text-gray-500 dark:text-gray-400 text-[13px] mb-1 font-medium">Role Access</span>
                <span className="font-semibold capitalize text-gray-900 dark:text-white">{selectedUser.role}</span>
              </div>
              <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#2A2A2A]">
                <span className="block text-gray-500 dark:text-gray-400 text-[13px] mb-1 font-medium">Status</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.isVerified ? 'Fully Verified' : 'Pending Verification'}</span>
              </div>
              <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-200 dark:border-[#2A2A2A]">
                <span className="block text-gray-500 dark:text-gray-400 text-[13px] mb-1 font-medium">Join Date</span>
                <span className="font-semibold text-gray-900 dark:text-white">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title="Edit Details"
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={selectedUser.name} 
                onChange={e => setSelectedUser({...selectedUser, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={selectedUser.email} 
                onChange={e => setSelectedUser({...selectedUser, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">System Role</label>
              <select 
                value={selectedUser.role} 
                onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            
            <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Account Verification</span>
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Manually verify this user</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedUser.isVerified}
                  onChange={e => setSelectedUser({...selectedUser, isVerified: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="pt-6 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#2A2A2A] dark:hover:bg-[#333] text-gray-800 dark:text-white rounded-xl font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl font-semibold transition-colors shadow-md disabled:opacity-70 text-sm"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {selectedUser && (
        <Modal 
          isOpen={isPasswordModalOpen} 
          onClose={() => setIsPasswordModalOpen(false)} 
          title="Security Update"
        >
          <form onSubmit={handleSavePassword} className="space-y-6">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-5 rounded-xl flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-red-900 dark:text-red-300">Force Password Reset</h4>
                <p className="text-[13px] text-red-800/80 dark:text-red-300/80 leading-relaxed">
                  You are about to overwrite the password for <span className="font-semibold">{selectedUser.email}</span>. This action takes immediate effect.
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <input 
                type="text" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/40 focus:border-red-500 dark:text-white transition-all text-sm" 
                autoComplete="off"
                required
                minLength={6}
              />
            </div>

            <div className="pt-2 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#2A2A2A] dark:hover:bg-[#333] text-gray-800 dark:text-white rounded-xl font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving || newPassword.length < 6}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-md disabled:opacity-70 text-sm"
              >
                {isSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create User Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={newUserForm.name}
                onChange={e => setNewUserForm({...newUserForm, name: e.target.value})}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={newUserForm.email}
                onChange={e => setNewUserForm({...newUserForm, email: e.target.value})}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm" 
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Temporary Password</label>
            <input 
              type="text" 
              value={newUserForm.password}
              onChange={e => setNewUserForm({...newUserForm, password: e.target.value})}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm" 
              autoComplete="off"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Initial Role</label>
            <select 
              value={newUserForm.role} 
              onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/20 dark:text-white transition-all text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="pt-6 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#2A2A2A] dark:hover:bg-[#333] text-gray-800 dark:text-white rounded-xl font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || newUserForm.password.length < 6}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl font-semibold transition-colors shadow-md disabled:opacity-70 text-sm"
            >
              {isSaving ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
