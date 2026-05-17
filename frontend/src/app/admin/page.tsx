"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, BarChart3, Activity, Trash2, ChevronRight } from "lucide-react";
import { adminAPI } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Users", value: "0", icon: Users, color: "from-blue-500 to-cyan-400" },
    { label: "Total Detections", value: "0", icon: BarChart3, color: "from-purple-500 to-pink-400" },
    { label: "Active Today", value: "0", icon: Activity, color: "from-green-500 to-emerald-400" },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getUserStats()
      ]);
      
      setUsers(usersRes.data.users);
      setStats([
        { label: "Total Users", value: statsRes.data.total_users.toString(), icon: Users, color: "from-blue-500 to-cyan-400" },
        { label: "Total Detections", value: statsRes.data.total_detections.toString(), icon: BarChart3, color: "from-purple-500 to-pink-400" },
        { label: "Active Today", value: "N/A", icon: Activity, color: "from-green-500 to-emerald-400" }, // Mock active today for now
      ]);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        fetchAdminData();
      } catch (error) {
        console.error("Failed to delete user", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">System management and user analytics</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-mono uppercase">User</th>
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-mono uppercase">Role</th>
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-mono uppercase">Detections</th>
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-mono uppercase">Joined</th>
                <th className="text-right py-3 px-3 text-xs text-muted-foreground font-mono uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">
                    <div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-neon-purple/10 text-neon-purple" : "bg-white/5 text-muted-foreground"}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">{u.detections || 0}</td>
                  <td className="py-3 px-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
