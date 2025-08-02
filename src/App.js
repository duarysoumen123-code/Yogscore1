import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ]);
  const [showSignUp, setShowSignUp] = useState(false);

  // ✅ Data States (LocalStorage)
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [athletes, setAthletes] = useState(() => JSON.parse(localStorage.getItem("athletes")) || []);
  const [judges, setJudges] = useState(() => JSON.parse(localStorage.getItem("judges")) || []);
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || {});

  // ✅ Auto-save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("athletes", JSON.stringify(athletes));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [events, athletes, judges, scores]);

  // ✅ Login / Logout
  const login = (username, password, role) => {
    const user = users.find((u) => u.username === username && u.password === password && u.role === role);
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("❌ Invalid login details");
    }
  };
  const logout = () => setLoggedInUser(null);

  // ✅ Admin: Add & Remove
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

  // ✅ Export to Excel
  const exportToExcel = () => {
    const data = Object.keys(scores).map((athlete) => ({
      Athlete: athlete,
      D: scores[athlete].D,
      A: scores[athlete].A,
      T: scores[athlete].T,
      Penalty: scores[athlete].Penalty,
    }));

    if (data.length === 0) {
      alert("⚠️ No scores to export");
      return;
    }

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
      {!loggedInUser && !showSignUp && (
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

              {/* EVENTS */}
              <h4>📋 Events</h4>
              <input id="eventName" placeholder="Event Name" style={{ width: "90%", padding: 8, margin: 5 }} />
              <button onClick={addEvent} style={{ width: "100%", padding: 8, background: "#4CAF50", color: "white" }}>➕ Add Event</button>
              <ul>
                {events.map((e, i) => (
                  <li key={i}>{e} <button onClick={() => removeEvent(i)} style={{ color: "red", border: "none" }}>❌</button></li>
                ))}
              </ul>

              {/* ATHLETES */}
              <h4>🧘 Athletes</h4>
              <input id="athleteName" placeholder="Athlete Name" style={{ width: "90%", padding: 8, margin: 5 }} />
              <button onClick={addAthlete} style={{ width: "100%", padding: 8, background: "#FF9800", color: "white" }}>➕ Add Athlete</button>
              <ul>
                {athletes.map((a, i) => (
                  <li key={i}>{a} <button onClick={() => removeAthlete(i)} style={{ color: "red", border: "none" }}>❌</button></li>
                ))}
              </ul>

              {/* JUDGES */}
              <h4>⚖️ Judges</h4>
              <input id="judgeName" placeholder="Judge Name" style={{ width: "90%", padding: 8, margin: 5 }} />
              <select id="judgeRole" style={{ width: "95%", padding: 8, margin: 5 }}>
                <option>D Judge</option><option>A Judge</option><option>T Judge</option><option>Evaluator</option>
              </select>
              <button onClick={addJudge} style={{ width: "100%", padding: 8, background: "#673AB7", color: "white" }}>➕ Add Judge</button>
              <ul>
                {judges.map((j, i) => (
                  <li key={i}>{j.name} — <b>{j.role}</b> <button onClick={() => removeJudge(i)} style={{ color: "red", border: "none" }}>❌</button></li>
                ))}
              </ul>

              {/* 📊 SCOREBOARD */}
              <h3 style={{ marginTop: 20 }}>📊 Scoreboard</h3>
              {Object.keys(scores).length === 0 ? (
                <p>❌ No scores yet.</p>
              ) : (
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#ddd" }}>
                      <th>Athlete</th><th>D</th><th>A</th><th>T</th><th>Penalty</th>
                    </tr>
                  </thead>
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

              {/* 📥 EXPORT BUTTON */}
              <button onClick={exportToExcel} style={{ marginTop: 15, width: "100%", padding: 10, background: "#009688", color: "white", fontWeight: "bold" }}>📥 Export to Excel</button>
            </div>
          )}

          {/* ⚖️ JUDGE DASHBOARD */}
          {loggedInUser.role === "Judge" && (
            <div>
              <h3>⚖️ Judge Dashboard</h3>
              {athletes.length === 0 ? <p>❌ No athletes yet.</p> : (
                athletes.map((athlete, idx) => (
                  <div key={idx} style={{ margin: 10, padding: 10, background: "#fff", borderRadius: 8 }}>
                    <h4>{athlete}</h4>
                    <input id={`D-${idx}`} placeholder="D" style={{ width: 60, margin: 3 }} />
                    <input id={`A-${idx}`} placeholder="A" style={{ width: 60, margin: 3 }} />
                    <input id={`T-${idx}`} placeholder="T" style={{ width: 60, margin: 3 }} />
                    <input id={`P-${idx}`} placeholder="Penalty" style={{ width: 70, margin: 3 }} />
                    <br />
                    <button onClick={() => {
                      const D = document.getElementById(`D-${idx}`).value;
                      const A = document.getElementById(`A-${idx}`).value;
                      const T = document.getElementById(`T-${idx}`).value;
                      const P = document.getElementById(`P-${idx}`).value;
                      saveScore(athlete, D, A, T, P);
                    }} style={{ marginTop: 5, background: "#2196F3", color: "white", padding: "5px 10px", border: "none", borderRadius: 6 }}>💾 Save Score</button>
                    {scores[athlete] && (
                      <p style={{ color: "green", fontSize: 14 }}>✅ Saved: D={scores[athlete].D}, A={scores[athlete].A}, T={scores[athlete].T}, P={scores[athlete].Penalty}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
