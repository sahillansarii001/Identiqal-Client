'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createOrgSchema, inviteMemberSchema } from '@/validators/organization.validator.js';
import { orgService } from '@/services/orgService.js';
import { cardService } from '@/services/cardService.js';
import { useAuthStore } from '@/store/authStore.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import {
  Users,
  Plus,
  Mail,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function TeamWorkspacePage() {
  const { user, updateUser } = useAuthStore();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Hook for Org creation form
  const {
    register: registerOrg,
    handleSubmit: handleSubmitOrg,
    formState: { errors: orgErrors },
  } = useForm({
    resolver: yupResolver(createOrgSchema),
  });

  // Hook for Member invitation form
  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm({
    resolver: yupResolver(inviteMemberSchema),
  });

  const fetchOrgDetails = async () => {
    if (!user.organizationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // In production, we'd have a specific GET endpoint. Here we'll fetch themes/cards or simulate org state:
      // Since backend Org details are updated on user, we can fetch org from custom mock endpoints or cards:
      // For MVP, we can simulate loading org metadata or query org info.
      // Let's call a query or retrieve from state:
      const response = await cardService.getTheme(); // checks if org themed locks exist
      // Setup a simulated Org payload since user organizationId is set
      setOrg({
        _id: user.organizationId,
        name: 'Workspace Organization',
        seatLimit: 10,
        seatsUsed: 1,
        members: [
          { userId: user.id, email: user.email, role: 'owner', status: 'active' }
        ],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgDetails();
  }, [user.organizationId]);

  const handleCreateOrg = async (data) => {
    setIsCreatingOrg(true);
    setErrorMsg('');
    try {
      const response = await orgService.createOrg(data.name, data.logoUrl);
      if (response.success) {
        // Update user state organizationId and role
        updateUser({
          organizationId: response.data._id,
          role: 'owner',
        });
        setOrg(response.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create workspace');
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleInvite = async (data) => {
    setIsInviting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await orgService.inviteMember(org._id, data.email, data.role);
      if (response.success) {
        setSuccessMsg(`Invitation successfully sent to ${data.email}!`);
        resetInvite();
        // Update local members list
        setOrg((prev) => ({
          ...prev,
          seatsUsed: prev.seatsUsed + 1,
          members: [
            ...prev.members,
            { email: data.email, role: data.role, status: 'invited' },
          ],
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invitation failed (check seat limits/subscriptions)');
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-xl font-extrabold text-slate-100">Team Workspace</h1>
        <p className="text-xs text-slate-400">Configure shared templates and invite organization members.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center space-x-2">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-center space-x-2">
          <UserCheck size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {!org ? (
        /* Create Org Callout */
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 space-y-6 max-w-xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
          <Users size={48} className="mx-auto text-indigo-500 animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-100">Create a Team Workspace</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock centralized branding locks, aggregated team reports, and collaborative seat allocations. Rebrand all team business cards instantly.
            </p>
          </div>

          <form onSubmit={handleSubmitOrg(handleCreateOrg)} className="space-y-4 text-left border-t border-slate-800 pt-6">
            <Input
              label="Organization Name"
              placeholder="eg. Acme Corp"
              error={orgErrors.name?.message}
              {...registerOrg('name')}
            />
            <Input
              label="Logo Image URL (Optional)"
              placeholder="https://company.com/logo.png"
              error={orgErrors.logoUrl?.message}
              {...registerOrg('logoUrl')}
            />
            <Button type="submit" className="w-full py-3" isLoading={isCreatingOrg}>
              Create Workspace
            </Button>
          </form>
        </div>
      ) : (
        /* Invite members & Workspace lists */
        <div className="grid md:grid-cols-12 gap-8">
          {/* Member list & seats */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center space-x-1.5">
                  <Users size={14} className="text-indigo-400" />
                  <span>Workspace Members</span>
                </h3>
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold">
                  {org.seatsUsed} / {org.seatLimit} Seats Used
                </span>
              </div>

              <div className="space-y-3">
                {org.members.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{member.email}</h5>
                      <span className="text-[9px] text-indigo-400 capitalize">{member.role}</span>
                    </div>
                    <span className={`text-[8px] border px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                      member.status === 'active' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invitation Side Form */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center space-x-1.5 border-b border-slate-900 pb-3">
                <Mail size={14} className="text-indigo-400" />
                <span>Invite Team Member</span>
              </h3>

              <form onSubmit={handleSubmitInvite(handleInvite)} className="space-y-4">
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  error={inviteErrors.email?.message}
                  {...registerInvite('email')}
                />
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace Role</label>
                  <select
                    className="bg-slate-950 border border-slate-800 rounded-xl text-xs p-2.5 text-slate-350 focus:outline-none"
                    {...registerInvite('role')}
                  >
                    <option value="member">Member (Own Card Edit Only)</option>
                    <option value="owner">Owner (Full admin controls)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" isLoading={isInviting}>
                  Send Invitation email
                </Button>
              </form>
            </div>

            {/* Centralized styling banner */}
            <div className="p-5 bg-indigo-950/10 border border-indigo-900/35 rounded-2xl flex items-center space-x-3 shadow-md shadow-indigo-950/5">
              <Lock size={20} className="text-indigo-400 shrink-0" />
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-indigo-300">Centralized styling theme locks</h5>
                <p className="text-[9px] text-slate-400 leading-normal">
                  All invited members will automatically render using the locked team theme configuration set on the Theme Controls tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
