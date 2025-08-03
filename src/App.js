import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
// ✅ Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyAeWCO-gjVDKJ07fZbgeD_rs4oOl9s5wxY",
  authDomain: "yogscore.firebaseapp.com",
  databaseURL: "https://yogscore-default-rtdb.firebaseio.com",
  projectId: "yogscore",
  storageBucket: "yogscore.firebasestorage.app",
  messagingSenderId: "965313907503",
  appId: "1:965313907503:web:8ff189e8c0b93737c5efda",
};

// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// 🔥 Firebase imports (optional for real-time later)
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, onValue } from "firebase/database";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Users state (Admin preset)
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || [
    { username: "admin", password: "admin", role: "Admin" }
  ]);

  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // ✅ Data States
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [athletes, setAthletes] = useState(() => JSON.parse(localStorage.getItem("athletes")) || []);
  const [judges, setJudges] = useState(() => JSON.parse(localStorage.getItem("judges")) || []);
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || {});

  // ✅ Load data from Firebase when app opens
useEffect(() => {
  // 👀 Listen for athletes list
  firebase.database().ref("athletes").on("value", (snapshot) => {
    if (snapshot.exists()) {
      setAthletes(snapshot.val());
    }
  });

  // 👀 Listen for judges list
  firebase.database().ref("judges").on("value", (snapshot) => {
    if (snapshot.exists()) {
      setJudges(snapshot.val());
    }
  });

  // 👀 Listen for events list
  firebase.database().ref("events").on("value", (snapshot) => {
    if (snapshot.exists()) {
      setEvents(snapshot.val());
    }
  });

  // 👀 Listen for scores
  firebase.database().ref("scores").on("value", (snapshot) => {
    if (snapshot.exists()) {
      setScores(snapshot.val());
    }
  });
}, []);

  // ✅ Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("athletes", JSON.stringify(athletes));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [users, events, athletes, judges, scores]);

  // ✅ Login
  const login = (username, password, role) => {
    const user = users.find((u) => u.username === username && u.password === password && u.role === role);
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("❌ Invalid login details");
    }
  };

  // ✅ Sign‑Up
  const signUp = (username, password, role) => {
    if (!username || !password) return alert("⚠️ Fill all fields");
    if (role === "Admin") return alert("❌ Cannot sign up as Admin");
    if (users.find((u) => u.username === username)) return alert("⚠️ Username already exists");

    const newUsers = [...users, { username, password, role }];
    setUsers(newUsers);
    alert(`✅ Account created for ${role}: ${username}`);
    setShowSignUp(false);
  };

  // ✅ Forgot Password (just shows hint now)
  const forgotPassword = (username) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      alert(`🔑 Password hint: ${user.password}`);
    } else {
      alert("❌ Username not found");
    }
  };

  // ✅ Logout
  const logout = () => setLoggedInUser(null);

  // ✅ Admin Management
  const addEvent = () => {
  const name = document.getElementById("eventName").value;
  if (!name) return alert("⚠️ Enter event name");
  const updated = [...(events || []), name];
  firebase.database().ref("events").set(updated);  // ✅ save to Firebase
  setEvents(updated);
  document.getElementById("eventName").value = "";
};

  const removeEvent = (i) => {
  const updated = events.filter((_, idx) => idx !== i);
  firebase.database().ref("events").set(updated);  // ✅ update Firebase
  setEvents(updated);
};


  const addAthlete = () => {
    const name = document.getElementById("athleteName").value;
    if (!name) return alert("⚠️ Enter athlete name");
    const updated = [...(athletes || []), name];
 firebase.database().ref("athletes").set(updated);
 setAthletes(updated);
 
    document.getElementById("athleteName").value = "";
  };
  const removeAthlete = (i) => {
  const updated = athletes.filter((_, idx) => idx !== i);
  firebase.database().ref("athletes").set(updated);
  setAthletes(updated);
}; 


  const addJudge = () => {
    const name = document.getElementById("judgeName").value;
    const role = document.getElementById("judgeRole").value;
    if (!name) return alert("⚠️ Enter judge name");
    const updated = [...(judges || []), { name, role }];
 firebase.database().ref("judges").set(updated);
 setJudges(updated);

    document.getElementById("judgeName").value = "";
  };
  const removeJudge = (i) => {
  const updated = judges.filter((_, idx) => idx !== i);
  firebase.database().ref("judges").set(updated);
  setJudges(updated);
};


  // ✅ Judge: Save Scores
  const saveScore = (athlete, D, A, T, Penalty) => {
    if (D === "" || A === "" || T === "" || Penalty === "") {
      return alert("⚠️ Enter all scores");
    }
    const updated = { ...scores, [athlete]: { D, A, T, Penalty } };
firebase.database().ref("scores").set(updated);
setScores(updated);

    alert(`✅ Scores saved for ${athlete}`);
  };

  // ✅ Excel Export
  const exportToExcel = () => {
    const data = Object.keys(scores).map((athlete) => ({
      Athlete: athlete,
      D: scores[athlete].D,
      A: scores[athlete].A,
      T: scores[athlete].T,
      Penalty: scores[athlete].Penalty,
    }));

    if (data.length === 0) return alert("⚠️ No scores to export");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    XLSX.writeFile(workbook, "Yogscore_Scores.xlsx");
  };

  return (
    <div style={{
      background: "url('https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover",
      minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Poppins', sans-serif"
    }}>
      {/* 🔐 LOGIN FORM */}
      {!loggedInUser && !showSignUp && !showForgot && (
        <div style={{ background: "rgba(255,255,255,0.9)", padding: 40, borderRadius: 12, width: 350, textAlign: "center" }}>
          <h1>🏆 Yogscore</h1>
          <h3>Login</h3>
          <input id="username" placeholder="Username" style={{ width: "90%", padding: 10, margin: 5 }} /><br />
          <input id="password" type="password" placeholder="Password" style={{ width: "90%", padding: 10, margin: 5 }} /><br />
          <select id="role" style={{ width: "95%", padding: 10, margin: 5 }}>
            <option>Admin</option><option>Judge</option><option>Athlete</option>
          </select><br />
          <button style={{ width: "100%", padding: 10, background: "#1877F2", color: "white" }}
            onClick={() => {
              const u = document.getElementById("username").value;
              const p = document.getElementById("password").value;
              const r = document.getElementById("role").value;
              login(u, p, r);
            }}>Login</button>
          <p style={{ marginTop: 10 }}>
            Don’t have an account?{" "}
            <button style={{ background: "none", border: "none", color: "#1877F2", cursor: "pointer" }} onClick={() => setShowSignUp(true)}>Sign Up</button>
          </p>
          <p>
            <button style={{ background: "none", border: "none", color: "gray", cursor: "pointer", fontSize: "12px" }} onClick={() => setShowForgot(true)}>Forgot Password?</button>
          </p>
        </div>
      )}

      {/* 📝 SIGN UP FORM */}
      {!loggedInUser && showSignUp && (
        <div style={{ background: "rgba(255,255,255,0.95)", padding: 40, borderRadius: 12, width: 350, textAlign: "center" }}>
          <h1>📝 Sign Up</h1>
          <input id="newUsername" placeholder="Choose Username" style={{ width: "90%", padding: 10, margin: 5 }} /><br />
          <input id="newPassword" type="password" placeholder="Choose Password" style={{ width: "90%", padding: 10, margin: 5 }} /><br />
          <select id="newRole" style={{ width: "95%", padding: 10, margin: 5 }}>
            <option>Judge</option>
            <option>Athlete</option>
          </select><br />
          <button style={{ width: "100%", padding: 10, background: "#4CAF50", color: "white" }}
            onClick={() => {
              const u = document.getElementById("newUsername").value;
              const p = document.getElementById("newPassword").value;
              const r = document.getElementById("newRole").value;
              signUp(u, p, r);
            }}>Create Account</button>
          <p style={{ marginTop: 10 }}>
            Already have an account?{" "}
            <button style={{ background: "none", border: "none", color: "#1877F2", cursor: "pointer" }} onClick={() => setShowSignUp(false)}>Back to Login</button>
          </p>
        </div>
      )}

      {/* 🔑 FORGOT PASSWORD FORM */}
      {!loggedInUser && showForgot && (
        <div style={{ background: "rgba(255,255,255,0.95)", padding: 40, borderRadius: 12, width: 350, textAlign: "center" }}>
          <h1>🔑 Forgot Password</h1>
          <input id="forgotUsername" placeholder="Enter Username" style={{ width: "90%", padding: 10, margin: 5 }} /><br />
          <button style={{ width: "100%", padding: 10, background: "#FF9800", color: "white" }}
            onClick={() => {
              const u = document.getElementById("forgotUsername").value;
              forgotPassword(u);
            }}>Get Password Hint</button>
          <p style={{ marginTop: 10 }}>
            <button style={{ background: "none", border: "none", color: "#1877F2", cursor: "pointer" }} onClick={() => setShowForgot(false)}>Back to Login</button>
          </p>
        </div>
      )}

      {/* ✅ DASHBOARD */}
      {loggedInUser && (
        <div style={{ background: "rgba(255,255,255,0.95)", padding: 30, borderRadius: 12, width: 520 }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}</h2>
          <button onClick={logout} style={{ float: "right", marginBottom: 20, background: "#f44336", color: "white", padding: "5px 10px", borderRadius: 6 }}>Logout</button>

          {/* 👑 ADMIN DASHBOARD */}
          {loggedInUser.role === "Admin" && (
            <div>
              <h3>👑 Admin Dashboard</h3>
              <h4>📋 Events</h4>
              <input id="eventName" placeholder="Event Name" />
              <button onClick={addEvent}>➕ Add Event</button>
              <ul>{events.map((e, i) => (<li key={i}>{e} <button onClick={() => removeEvent(i)}>❌</button></li>))}</ul>

              <h4>🧘 Athletes</h4>
              <input id="athleteName" placeholder="Athlete Name" />
              <button onClick={addAthlete}>➕ Add Athlete</button>
              <ul>{athletes.map((a, i) => (<li key={i}>{a} <button onClick={() => removeAthlete(i)}>❌</button></li>))}</ul>

              <h4>⚖️ Judges</h4>
              <input id="judgeName" placeholder="Judge Name" />
              <select id="judgeRole">
                <option>D Judge</option><option>A Judge</option><option>T Judge</option><option>Evaluator</option>
              </select>
              <button onClick={addJudge}>➕ Add Judge</button>
              <ul>{judges.map((j, i) => (<li key={i}>{j.name} — {j.role} <button onClick={() => removeJudge(i)}>❌</button></li>))}</ul>

              <h3>📊 Scoreboard</h3>
              {Object.keys(scores).length === 0 ? <p>❌ No scores yet.</p> : (
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr><th>Athlete</th><th>D</th><th>A</th><th>T</th><th>Penalty</th></tr></thead>
                  <tbody>
                    {Object.keys(scores).map((athlete, i) => (
                      <tr key={i}>
                        <td>{athlete}</td>
                        <td>{scores[athlete].D}</td>
                        <td>{scores[athlete].A}</td>
                        <td>{scores[athlete].T}</td>
                        <td>{scores[athlete].Penalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button onClick={exportToExcel} style={{ marginTop: 10 }}>📥 Export to Excel</button>
            </div>
          )}

          {/* ⚖️ JUDGE DASHBOARD */}
          {loggedInUser.role === "Judge" && (
            <div>
              <h3>⚖️ Judge Dashboard</h3>
              {athletes.length === 0 ? <p>❌ No athletes yet.</p> : athletes.map((athlete, idx) => (
                <div key={idx} style={{ margin: 10, padding: 10, background: "#fff", borderRadius: 8 }}>
                  <h4>{athlete}</h4>
                  <input id={`D-${idx}`} placeholder="D" style={{ width: 60, margin: 3 }} />
                  <input id={`A-${idx}`} placeholder="A" style={{ width: 60, margin: 3 }} />
                  <input id={`T-${idx}`} placeholder="T" style={{ width: 60, margin: 3 }} />
                  <input id={`P-${idx}`} placeholder="Penalty" style={{ width: 70, margin: 3 }} />
                  <button onClick={() => {
                    const D = document.getElementById(`D-${idx}`).value;
                    const A = document.getElementById(`A-${idx}`).value;
                    const T = document.getElementById(`T-${idx}`).value;
                    const P = document.getElementById(`P-${idx}`).value;
                    saveScore(athlete, D, A, T, P);
                  }}>💾 Save Score</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
