"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AdminPanel() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session?.user) fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/user`);
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`/api/user/update`, {
        email: editingUser,
        role: formData.role,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query)),
    );
  };

  return (
    <div className="dashboard min-h-screen w-full pt-20 ">
      <div className="  mx-auto   max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Manage Users</h1>
      <input
        type="text"
        className="input input-bordered w-full mb-6 focus:outline-none"
        placeholder="Search by email"
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="p-4">
        {filteredUsers.map((user) => (
        <div
          key={user._id}
          className=" shadow rounded p-4 mb-4 border "
        >
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Current Role:</strong> {user.role}
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {user.skills && user.skills.length > 0
              ? user.skills.join(", ")
              : "N/A"}
          </p>

          {editingUser === user.email ? (
            <div className="mt-4 space-y-2">
              <select
                className="select select-bordered w-full focus:outline-none "
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option className="focus:bg-red-400" value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="text"
                placeholder="Comma-separated skills"
                className="input input-bordered w-full focus:outline-none"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />

              <div className="flex gap-2">
                <button
                  className="bttn py-2 px-4 rounded-full cursor-pointer btn-success btn-sm"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="bttn py-2 px-4 rounded-full cursor-pointer btn-ghost btn-sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="bttn py-2 px-4 rounded-full cursor-pointer btn-primary btn-sm mt-2"
              onClick={() => handleEditClick(user)}
            >
              Edit
            </button>
          )}
        </div>
      ))}
      </div>
    </div>
    </div>
  );
}
