import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

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
    setEvents([...events, name]);
    document.getElementById("eventName").value = "";
  };
  const removeEvent = (i) => setEvents(events.filter((_, idx) => idx !== i));

  const addAthlete = () => {
    const name = document.getElementById("athleteName").value;
    if (!name) return alert("⚠️ Enter athlete name");
    setAthletes([...athletes, name]);
    document.getElementById("athleteName").value = "";
  };
  const removeAthlete = (i) => setAthletes(athletes.filter((_, idx) => idx !== i));

  const addJudge = () => {
    const name = document.getElementById("judgeName").value;
    const role = document.getElementById("judgeRole").value;
    if (!name) return alert("⚠️ Enter judge name");
    setJudges([...judges, { name, role }]);
    document.getElementById("judgeName").value = "";
  };
  const removeJudge = (i) => setJudges(judges.filter((_, idx) => idx !== i));

  // ✅ Judge: Save Scores
  const saveScore = (athlete, D, A, T, Penalty) => {
    if (D === "" || A === "" || T === "" || Penalty === "") {
      return alert("⚠️ Enter all scores");
    }
    setScores({ ...scores, [athlete]: { D, A, T, Penalty } });
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
  <div>
    {/* Shared dashboard content */}
    
    {/* 👑 ADMIN DASHBOARD */}
    {loggedInUser.role === "Admin" && (
      <AdminDashboard />
    )}

    {/* 🧠 CHIEF JUDGE VIEW */}
    {loggedInUser.role === "Chief Judge" && (
      <ChiefJudgeDashboard scores={scores} />
    )}

    {/* ⚖️ JUDGE DASHBOARD */}
    {loggedInUser.role === "Judge" && (
      <JudgeDashboard athletes={athletes} saveScore={saveScore} />
    )}
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
