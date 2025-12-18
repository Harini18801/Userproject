import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter + Sort users
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a[sortField].localeCompare(b[sortField]));

  // Highlight matching text in search
  const highlightText = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  if (loading) return <p className="loading">Loading users...</p>;

  if (error)
    return (
      <div className="error-box">
        <p>Error: {error}</p>
        <button onClick={fetchUsers} className="retry-btn">Retry</button>
      </div>
    );

  return (
    <div className="app-container">
      <h1>User Management Dashboard</h1>
      <p>Total Users: <strong>{users.length}</strong></p>

      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* Sort Dropdown */}
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="sort-select"
      >
        <option value="name">Sort by Name</option>
        <option value="email">Sort by Email</option>
        <option value="username">Sort by Username</option>
      </select>

      {/* Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name 🔼</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6">No users found</td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td dangerouslySetInnerHTML={{ __html: highlightText(user.name) }}></td>
                <td>{user.username}</td>
                <td dangerouslySetInnerHTML={{ __html: highlightText(user.email) }}></td>
                <td>{user.phone}</td>
                <td>
                  <a href={`http://${user.website}`} target="_blank" rel="noreferrer">
                    {user.website}
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
