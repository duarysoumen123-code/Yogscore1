import React, { useState, useEffect } from "react";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ]);
  const [showSignUp, setShowSignUp] = useState(false);

  // ✅ Data States (with LocalStorage)
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [athletes, setAthletes] = useState(() => JSON.parse(localStorage.getItem("athletes")) || []);
  const [judges, setJudges] = useState(() => JSON.parse(localStorage.getItem("judges")) || []);
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || {});

  // ✅ Save all data to localStorage on any change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("athletes", JSON.stringify(athletes));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [events, athletes, judges, scores]);

  // ✅ Login System
  const login = (username, password, role) => {
    const user = users.find((u) => u.username === username && u.password === password && u.role === role);
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

  // ✅ Event Functions
  const addEvent = () => {
    const eventName = document.getElementById("eventName").value;
    if (eventName.trim() === "") {
      alert("⚠️ Please enter an event name");
      return;
    }
    setEvents([...events, eventName]);
    document.getElementById("eventName").value = "";
  };

  const removeEvent = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
  };

  // ✅ Athlete Functions
  const addAthlete = () => {
    const athleteName = document.getElementById("athleteName").value;
    if (athleteName.trim() === "") {
      alert("⚠️ Please enter an athlete name");
      return;
    }
    setAthletes([...athletes, athleteName]);
    document.getElementById("athleteName").value = "";
  };

  const removeAthlete = (index) => {
    const updated = [...athletes];
    updated.splice(index, 1);
    setAthletes(updated);
  };

  // ✅ Judge Functions
  const addJudge = () => {
    const judgeName = document.getElementById("judgeName").value;
    const judgeRole = document.getElementById("judgeRole").value;
    if (judgeName.trim() === "") {
      alert("⚠️ Please enter a judge name");
      return;
    }
    setJudges([...judges, { name: judgeName, role: judgeRole }]);
    document.getElementById("judgeName").value = "";
    document.getElementById("judgeRole").value = "D Judge";
  };

  const removeJudge = (index) => {
    const updated = [...judges];
    updated.splice(index, 1);
    setJudges(updated);
  };

  // ✅ Judge Scoring Function
  const saveScore = (athlete, D, A, T, Penalty) => {
    if (D === "" || A === "" || T === "" || Penalty === "") {
      alert("⚠️ Please fill all scores");
      return;
    }

    const updatedScores = { ...scores };
    updatedScores[athlete] = { D, A, T, Penalty };

    setScores(updatedScores);
    alert(`✅ Scores saved for ${athlete}`);
  };

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
        <div style={{ background: "rgba(255, 255, 255, 0.88)", padding: "40px", borderRadius: "12px", boxShadow: "0px 6px 20px rgba(0,0,0,0.2)", width: "350px", textAlign: "center" }}>
          <h1>🏆 Yogscore</h1>
          <h3>Login</h3>

          <input id="username" placeholder="Username" style={{ width: "90%", padding: "12px", margin: "8px 0" }} /><br />
          <input id="password" type="password" placeholder="Password" style={{ width: "90%", padding: "12px", margin: "8px 0" }} /><br />
          <select id="role" style={{ width: "95%", padding: "12px", margin: "8px 0" }}>
            <option>Admin</option>
            <option>Judge</option>
            <option>Athlete</option>
          </select><br />
          <button style={{ width: "100%", padding: "12px", background: "#1877F2", color: "white", marginTop: "10px" }}
            onClick={() => {
              const username = document.getElementById("username").value;
              const password = document.getElementById("password").value;
              const role = document.getElementById("role").value;
              login(username, password, role);
            }}>Login</button>
        </div>
      )}

      {/* ✅ DASHBOARD */}
      {loggedInUser && (
        <div style={{ background: "rgba(255, 255, 255, 0.88)", padding: "40px", borderRadius: "12px", boxShadow: "0px 6px 20px rgba(0,0,0,0.2)", width: "500px", textAlign: "center" }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}!</h2>

          {/* 👑 ADMIN DASHBOARD */}
          {loggedInUser.role === "Admin" && (
            <div>
              <h3>👑 Admin Dashboard</h3>

              {/* Events */}
              <h4>📋 Events</h4>
              <input id="eventName" placeholder="Enter Event Name" style={{ width: "90%", padding: "10px", margin: "10px 0" }} />
              <button onClick={addEvent} style={{ width: "100%", padding: "10px", background: "#4CAF50", color: "white" }}>➕ Add Event</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {events.map((event, index) => (
                  <li key={index}>📅 {event} <button onClick={() => removeEvent(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent" }}>❌</button></li>
                ))}
              </ul>

              {/* Athletes */}
              <h4>🧘 Athletes</h4>
              <input id="athleteName" placeholder="Enter Athlete Name" style={{ width: "90%", padding: "10px", margin: "10px 0" }} />
              <button onClick={addAthlete} style={{ width: "100%", padding: "10px", background: "#FF9800", color: "white" }}>➕ Add Athlete</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {athletes.map((athlete, index) => (
                  <li key={index}>🧍 {athlete} <button onClick={() => removeAthlete(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent" }}>❌</button></li>
                ))}
              </ul>

              {/* Judges */}
              <h4>⚖️ Judges</h4>
              <input id="judgeName" placeholder="Enter Judge Name" style={{ width: "90%", padding: "10px", margin: "10px 0" }} />
              <select id="judgeRole" style={{ width: "95%", padding: "10px", margin: "10px 0" }}>
                <option>D Judge</option>
                <option>A Judge</option>
                <option>T Judge</option>
                <option>Evaluator</option>
              </select>
              <button onClick={addJudge} style={{ width: "100%", padding: "10px", background: "#673AB7", color: "white" }}>➕ Add Judge</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {judges.map((judge, index) => (
                  <li key={index}>⚖️ {judge.name} — <strong>{judge.role}</strong> <button onClick={() => removeJudge(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent" }}>❌</button></li>
                ))}
              </ul>
            </div>
          )}

          {/* ⚖️ JUDGE DASHBOARD */}
          {loggedInUser.role === "Judge" && (
            <div>
              <h3>⚖️ Judge Dashboard</h3>
              {athletes.length === 0 ? (
                <p>❌ No athletes added yet.</p>
              ) : (
                athletes.map((athlete, index) => (
                  <div key={index} style={{ marginBottom: "20px", padding: "15px", background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                    <h4>{athlete}</h4>
                    <input id={`D-${index}`} placeholder="D" style={{ width: "60px", margin: "5px" }} />
                    <input id={`A-${index}`} placeholder="A" style={{ width: "60px", margin: "5px" }} />
                    <input id={`T-${index}`} placeholder="T" style={{ width: "60px", margin: "5px" }} />
                    <input id={`P-${index}`} placeholder="Penalty" style={{ width: "60px", margin: "5px" }} />
                    <br />
                    <button onClick={() => {
                      const D = document.getElementById(`D-${index}`).value;
                      const A = document.getElementById(`A-${index}`).value;
                      const T = document.getElementById(`T-${index}`).value;
                      const Penalty = document.getElementById(`P-${index}`).value;
                      saveScore(athlete, D, A, T, Penalty);
                    }}
                      style={{ marginTop: "8px", background: "#2196F3", color: "white", padding: "5px 10px", border: "none", borderRadius: "6px" }}>
                      💾 Save Score
                    </button>

                    {scores[athlete] && (
                      <p style={{ marginTop: "10px", fontSize: "14px", color: "green" }}>
                        ✅ Saved: D={scores[athlete].D}, A={scores[athlete].A}, T={scores[athlete].T}, Penalty={scores[athlete].Penalty}
                      </p>
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
