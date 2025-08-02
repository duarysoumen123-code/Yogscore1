import React, { useState } from "react";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ]);
  const [showSignUp, setShowSignUp] = useState(false);

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

  const signUp = (username, password, role) => {
    if (users.find((u) => u.username === username)) {
      alert("⚠️ Username already exists");
      return;
    }
    setUsers([...users, { username, password, role }]);
    alert(`✅ Account created for ${role}: ${username}`);
    setShowSignUp(false);
  };

  const logout = () => setLoggedInUser(null);

  return (
    <div style={{
      background: "url('https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', Arial, sans-serif"
    }}>

      {/* 🔐 LOGIN FORM */}
      {!loggedInUser && !showSignUp && (
        <div style={{
          background: "rgba(255, 255, 255, 0.88)", // ✅ soft white overlay
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center"
        }}>
          <h1 style={{ marginBottom: "20px", color: "#1c1c1c" }}>🏆 Yogscore</h1>
          <h3 style={{ marginBottom: "20px", color: "#555" }}>Login</h3>

          <input id="username" placeholder="Username"
            style={{
              width: "90%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          /><br />

          <input id="password" type="password" placeholder="Password"
            style={{
              width: "90%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          /><br />

          <select id="role"
            style={{
              width: "95%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          >
            <option>Admin</option>
            <option>Judge</option>
            <option>Athlete</option>
          </select><br />

          <button
            style={{
              width: "100%", padding: "12px",
              background: "#1877F2", color: "white",
              fontWeight: "600", fontSize: "16px",
              border: "none", borderRadius: "8px",
              marginTop: "10px", cursor: "pointer"
            }}
            onClick={() => {
              const username = document.getElementById("username").value;
              const password = document.getElementById("password").value;
              const role = document.getElementById("role").value;
              login(username, password, role);
            }}
          >
            Login
          </button>

          <p style={{ marginTop: "12px", color: "#333" }}>
            Don’t have an account?{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#1877F2",
                fontWeight: "600",
                cursor: "pointer"
              }}
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </button>
          </p>
        </div>
      )}

      {/* 📝 SIGN-UP FORM */}
      {!loggedInUser && showSignUp && (
        <div style={{
          background: "rgba(255, 255, 255, 0.88)", // ✅ soft white overlay
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center"
        }}>
          <h1 style={{ marginBottom: "20px", color: "#1c1c1c" }}>🏆 Yogscore</h1>
          <h3 style={{ marginBottom: "20px", color: "#555" }}>Sign Up</h3>

          <input id="newUsername" placeholder="Choose Username"
            style={{
              width: "90%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          /><br />

          <input id="newPassword" type="password" placeholder="Choose Password"
            style={{
              width: "90%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          /><br />

          <select id="newRole"
            style={{
              width: "95%", padding: "12px", margin: "8px 0",
              borderRadius: "8px", border: "1px solid #ccc"
            }}
          >
            <option>Judge</option>
            <option>Athlete</option>
          </select><br />

          <button
            style={{
              width: "100%", padding: "12px",
              background: "#42b72a", color: "white",
              fontWeight: "600", fontSize: "16px",
              border: "none", borderRadius: "8px",
              marginTop: "10px", cursor: "pointer"
            }}
            onClick={() => {
              const username = document.getElementById("newUsername").value;
              const password = document.getElementById("newPassword").value;
              const role = document.getElementById("newRole").value;
              signUp(username, password, role);
            }}
          >
            Create Account
          </button>

          <p style={{ marginTop: "12px", color: "#333" }}>
            Already have an account?{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#1877F2",
                fontWeight: "600",
                cursor: "pointer"
              }}
              onClick={() => setShowSignUp(false)}
            >
              Back to Login
            </button>
          </p>
        </div>
      )}

      {/* ✅ DASHBOARD */}
      {loggedInUser && (
        <div style={{
          background: "rgba(255, 255, 255, 0.88)", // ✅ soft white overlay
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
          width: "400px",
          textAlign: "center"
        }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}!</h2>
          <button onClick={logout} style={{
            marginTop: "20px",
            background: "#f44336",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}
