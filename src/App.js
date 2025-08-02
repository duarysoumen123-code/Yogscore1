import React, { useState } from "react";

export default function App() {
  // ✅ Logged in user
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Users list (we can add new users here)
  const [users, setUsers] = useState([
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ]);

  // ✅ Show sign‑up form toggle
  const [showSignUp, setShowSignUp] = useState(false);

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

  // ✅ Sign‑up function
  const signUp = (username, password, role) => {
    // prevent duplicate usernames
    if (users.find((u) => u.username === username)) {
      alert("⚠️ Username already exists");
      return;
    }
    // add new user
    const newUser = { username, password, role };
    setUsers([...users, newUser]);
    alert(✅ Account created for ${role}: ${username});
    setShowSignUp(false); // close sign‑up form
  };

  // ✅ Logout function
  const logout = () => setLoggedInUser(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏆 Yogscore – Judging App</h1>

      {/* 🔐 LOGIN FORM (if not logged in) */}
      {!loggedInUser && !showSignUp && (
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

          <p style={{ marginTop: "10px" }}>
            Don’t have an account?{" "}
            <button onClick={() => setShowSignUp(true)}>Sign Up</button>
          </p>
        </div>
      )}

      {/* 📝 SIGN‑UP FORM */}
      {!loggedInUser && showSignUp && (
        <div style={{ marginTop: "20px" }}>
          <h2>Sign Up</h2>
          <input id="newUsername" placeholder="Choose Username" /> <br /><br />
          <input id="newPassword" type="password" placeholder="Choose Password" /> <br /><br />
          <select id="newRole">
            <option>Judge</option>
            <option>Athlete</option>
          </select>
          <br /><br />
          <button
            onClick={() => {
              const username = document.getElementById("newUsername").value;
              const password = document.getElementById("newPassword").value;
              const role = document.getElementById("newRole").value;
              signUp(username, password, role);
            }}
          >
            Create Account
          </button>
          <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <button onClick={() => setShowSignUp(false)}>Back to Login</button>
          </p>
        </div>
      )}

      {/* ✅ DASHBOARD (if logged in) */}
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
