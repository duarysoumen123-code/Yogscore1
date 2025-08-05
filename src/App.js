import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

// 🔥 Firebase imports (optional for real-time later)
// import { initializeApp } from "firebase/app";
function ChiefJudgeDashboard({ scores }) {
  return (
    <div>
      <h3>🧠 Chief Judge Panel</h3>
      {Object.keys(scores).length === 0 ? (
        <p>❌ No scores yet.</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th>Athlete</th><th>D</th><th>A</th><th>T</th><th>Penalty</th></tr>
          </thead>
          <tbody>
            {Object.entries(scores).map(([athlete, score], i) => (
              <tr key={i}>
                <td>{athlete}</td>
                <td>{score.D}</td>
                <td>{score.A}</td>
                <td>{score.T}</td>
                <td>{score.Penalty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
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
  const ageGroup = document.getElementById("eventAgeGroup").value;
  const gender = document.getElementById("eventGender").value;
  const scoringType = document.getElementById("eventScoringType").value;

  if (!name || !ageGroup || !gender || !scoringType) {
    return alert("⚠️ Fill all event fields");
  }

  const newEvent = { name, ageGroup, gender, scoringType };
  setEvents([...events, newEvent]);

  // Clear input fields
  document.getElementById("eventName").value = "";
  document.getElementById("eventAgeGroup").value = "";
  document.getElementById("eventGender").value = "";
  document.getElementById("eventScoringType").value = "";
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
 function calculateFinalScore(type, D, A, T, Penalty) {
  let final = 0;

  switch (type) {
    case "standard":
      final = D + A + T - Penalty;
      break;
    case "pair":
      final = (D + A) * 0.9 + T - Penalty;
      break;
    case "group":
      final = D + (A * 2) + (T * 0.5) - Penalty;
      break;
    case "artistic":
      final = (D * 0.8) + (A * 1.2) + T - Penalty;
      break;
    default:
      final = D + A + T - Penalty;
  }

  return final.toFixed(2); // Round to 2 decimal
}
 
  
  const saveScore = (athlete, D, A, T, Penalty) => {
  if (D === "" || A === "" || T === "" || Penalty === "") {
    return alert("⚠️ Enter all scores");
  }

  const selectedEventIndex = document.getElementById("selectedEvent")?.value;
  if (selectedEventIndex === "" || selectedEventIndex === undefined) {
    return alert("⚠️ Select an event");
  }

  const event = events[selectedEventIndex];
  const finalScore = calculateFinalScore(event.scoringType, parseFloat(D), parseFloat(A), parseFloat(T), parseFloat(Penalty));

  setScores({
    ...scores,
    [athlete]: { D, A, T, Penalty, finalScore }
  });

  alert(`✅ Scores saved for ${athlete} | Final Score: ${finalScore}`);
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
            <option>Admin</option>
            <option>Chief Judge</option>
            <option>Judge</option>
            <option>Athlete</option>
          </select>
            
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
            <option>Chief Judge</option>
            <option>Athlete</option>
          </select>

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
<select id="eventAgeGroup">
  <option>Under 11</option>
  <option>Under 14</option>
  <option>Under 17</option>
  <option>Under 21</option>
  <option>21 & Above</option>
</select>
<select id="eventGender">
  <option>Male</option>
  <option>Female</option>
</select>
<select id="eventScoringType">
  <option value="standard">Standard</option>
  <option value="pair">Pair</option>
  <option value="group">Group</option>
  <option value="artistic">Artistic</option>
</select>
<button onClick={addEvent}>➕ Add Event</button>

              <ul>
  {events.map((e, i) => (
    <li key={i}>
      <strong>{e.name}</strong> — {e.ageGroup} — {e.gender} — {e.scoringType}
      <button onClick={() => removeEvent(i)}>❌</button>
    </li>
  ))}
</ul>


              <h4>📋 Events</h4>
<input id="eventName" placeholder="Event Name" />
<input id="eventAgeGroup" placeholder="Age Group (e.g., Under 17)" />
<select id="eventGender">
  <option value="">Select Gender</option>
  <option>Male</option>
  <option>Female</option>
</select>
<select id="eventScoringType">
  <option value="">Select Scoring Type</option>
  <option value="standard">Standard</option>
  <option value="pair">Pair</option>
  <option value="rhythmic">Rhythmic</option>
  <option value="artistic">Artistic</option>
</select>
<button onClick={addEvent}>➕ Add Event</button>

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
                  <thead><tr><th>Athlete</th><th>D</th><th>A</th><th>T</th><th>Penalty</th><th>Final</th></tr>
                  <tbody>
                    {Object.keys(scores).map((athlete, i) => (
                      <tr key={i}>
                        <td>{athlete}</td>
                        <td>{scores[athlete].D}</td>
                        <td>{scores[athlete].A}</td>
                        <td>{scores[athlete].T}</td>
                        <td>{scores[athlete].Penalty}</td>
<td><strong>{scores[athlete].finalScore}</strong></td>

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
            <select id="selectedEvent" style={{ marginBottom: "1rem", padding: 10 }}>
  <option value="">Select Event</option>
  {events.map((event, i) => (
    <option key={i} value={i}>
      {event.name} ({event.ageGroup} / {event.gender} / {event.scoringType})
    </option>
  ))}
</select>

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
          )}{loggedInUser.role === "Chief Judge" && (
  <ChiefJudgeDashboard scores={scores} />
)}

        </div>
      )}
    </div>
  );
}
