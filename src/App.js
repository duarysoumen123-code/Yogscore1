import React, { useState, useEffect } from "react";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([
    { username: "admin", password: "admin", role: "Admin" },
    { username: "judge", password: "judge", role: "Judge" },
    { username: "athlete", password: "athlete", role: "Athlete" }
  ]);
  const [showSignUp, setShowSignUp] = useState(false);

  // ✅ Load from localStorage (or empty array if nothing saved)
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [athletes, setAthletes] = useState(() => JSON.parse(localStorage.getItem("athletes")) || []);
  const [judges, setJudges] = useState(() => JSON.parse(localStorage.getItem("judges")) || []);
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || {});

  // ✅ Save any changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("athletes", JSON.stringify(athletes));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [events, athletes, judges, scores]);

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

  // ✅ Judge Function: Save Score
  const saveScore = (athlete, D, A, T, Penalty) => {
    if (D === "" || A === "" || T === "" || Penalty === "") {
      alert("⚠️ Please enter all scores");
      return;
    }
    setScores({
      ...scores,
      [athlete]: { D, A, T, Penalty }
    });
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
          <h1 style={{ marginBottom: "20px", color: "#1c1c1c" }}>🏆 Yogscore</h1>
          <h3 style={{ marginBottom: "20px", color: "#555" }}>Login</h3>

          <input id="username" placeholder="Username" style={{ width: "90%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc" }} /><br />
          <input id="password" type="password" placeholder="Password" style={{ width: "90%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc" }} /><br />
          <select id="role" style={{ width: "95%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc" }}>
            <option>Admin</option>
            <option>Judge</option>
            <option>Athlete</option>
          </select><br />
          <button style={{ width: "100%", padding: "12px", background: "#1877F2", color: "white", fontWeight: "600", fontSize: "16px", border: "none", borderRadius: "8px", marginTop: "10px", cursor: "pointer" }}
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
        <div style={{ background: "rgba(255, 255, 255, 0.88)", padding: "40px", borderRadius: "12px", boxShadow: "0px 6px 20px rgba(0,0,0,0.2)", width: "450px", textAlign: "center" }}>
          <h2>✅ Welcome, {loggedInUser.role} {loggedInUser.username}!</h2>

          {/* 👑 ADMIN DASHBOARD */}
          {loggedInUser.role === "Admin" && (
            <div>
              <h3>👑 Admin Dashboard</h3>

              {/* Events */}
              <h4>📋 Events</h4>
              <input id="eventName" placeholder="Enter Event Name" style={{ width: "90%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
              <button onClick={addEvent} style={{ width: "100%", padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>➕ Add Event</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {events.map((event, index) => (
                  <li key={index}>📅 {event} <button onClick={() => removeEvent(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent", cursor: "pointer" }}>❌</button></li>
                ))}
              </ul>

              {/* Athletes */}
              <h4 style={{ marginTop: "20px" }}>🧘 Athletes</h4>
              <input id="athleteName" placeholder="Enter Athlete Name" style={{ width: "90%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
              <button onClick={addAthlete} style={{ width: "100%", padding: "10px", background: "#FF9800", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>➕ Add Athlete</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {athletes.map((athlete, index) => (
                  <li key={index}>🧍 {athlete} <button onClick={() => removeAthlete(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent", cursor: "pointer" }}>❌</button></li>
                ))}
              </ul>

              {/* Judges */}
              <h4 style={{ marginTop: "20px" }}>⚖️ Judges</h4>
              <input id="judgeName" placeholder="Enter Judge Name" style={{ width: "90%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
              <select id="judgeRole" style={{ width: "95%", padding: "10px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }}>
                <option>D Judge</option>
                <option>A Judge</option>
                <option>T Judge</option>
                <option>Evaluator</option>
              </select>
              <button onClick={addJudge} style={{ width: "100%", padding: "10px", background: "#673AB7", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>➕ Add Judge</button>
              <ul style={{ textAlign: "left", marginTop: "15px" }}>
                {judges.map((judge, index) => (
                  <li key={index}>⚖️ {judge.name} — <strong>{judge.role}</strong> <button onClick={() => removeJudge(index)} style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent", cursor: "pointer" }}>❌</button></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

