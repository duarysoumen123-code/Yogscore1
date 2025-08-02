
import React, { useState } from "react";

export default function App() {
  // ✅ Store who is logged in
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Preloaded test users
  const users = [
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ];

  // ✅ Login function
  const login = (username, password, role) => {
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("❌ Invalid login details");
    }
  };

  // ✅ Logout function
  const logout = () => setLoggedInUser(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏆 Yogscore – Judging App</h1>

      {/* 🔐 Login Form if NOT logged in */}
      {!loggedInUser && (
        <div style={{ marginTop: "20px" }}>
          <h2>Login</h2>
          <input id="username" placeholder="Username" /> <br /><br />
          <input id="password" type="password" placeholder="Password" /> <br /><br />
          <select id="role">
            <option>Admin</option>
            <option>Judge</option>
            <option>Athlete</option>
          </select>
          <br /><br />
          <button
            onClick={() => {
              const username = document.getElementById("username").value;
              const password = document.getElementById("password").value;
              const role = document.getElementById("role").value;
              login(username, password, role);
            }}
          >
            Login
          </button>
        </div>
      )}

      {/* ✅ If logged in → show dashboard based on role */}
      {loggedInUser && (
        <div style={{ marginTop: "20px" }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}!</h2>
          <button onClick={logout} style={{ marginBottom: "20px" }}>Logout</button>

          {/* 👑 ADMIN DASHBOARD */}
          {loggedInUser.role === "Admin" && (
            <div>
              <h3>👑 Admin Dashboard</h3>
              <ul>
                <li>📋 Manage Events</li>
                <li>🧘 Manage Athletes</li>
                <li>⚖️ Manage Judges</li>
                <li>📥 Export Scores</li>
              </ul>
            </div>
          )}

          {/* ⚖️ JUDGE DASHBOARD */}
          {loggedInUser.role === "Judge" && (
            <div>
              <h3>⚖️ Judge Dashboard</h3>
              <p>Here you will enter scores for athletes.</p>
            </div>
          )}

          {/* 🧘 ATHLETE DASHBOARD */}
          {loggedInUser.role === "Athlete" && (
            <div>
              <h3>🧘 Athlete Dashboard</h3>
              <p>Here you will submit your Asana sequence.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
