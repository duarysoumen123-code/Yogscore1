import React, { useState } from "react";

export default function App() {
  // ✅ Store the logged in user
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
  const logout = () => {
    setLoggedInUser(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏆 Yogscore – Judging App</h1>

      {/* 🔐 If NOT logged in → show login form */}
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

      {/* ✅ If logged in → show welcome message */}
      {loggedInUser && (
        <div style={{ marginTop: "20px" }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}!</h2>
          <p>You are now logged in as: <strong>{loggedInUser.role}</strong></p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
