import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || [
    { username: "admin", password: "admin", role: "Admin" }
  ]);

  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);
  const [athletes, setAthletes] = useState(() => JSON.parse(localStorage.getItem("athletes")) || []);
  const [judges, setJudges] = useState(() => JSON.parse(localStorage.getItem("judges")) || []);
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || {});

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("athletes", JSON.stringify(athletes));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [users, events, athletes, judges, scores]);

  const login = (username, password, role) => {
    const user = users.find((u) => u.username === username && u.password === password && u.role === role);
    if (user) {
      setLoggedInUser(user);
    } else {
      alert("❌ Invalid login details");
    }
  };

  const signUp = (username, password, role) => {
    if (!username || !password) return alert("⚠️ Fill all fields");
    if (role === "Admin") return alert("❌ Cannot sign up as Admin");
    if (users.find((u) => u.username === username)) return alert("⚠️ Username already exists");

    const newUsers = [...users, { username, password, role }];
    setUsers(newUsers);
    alert(`✅ Account created for ${role}: ${username}`);
    setShowSignUp(false);
  };

  const forgotPassword = (username) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      alert(`🔑 Password hint: ${user.password}`);
    } else {
      alert("❌ Username not found");
    }
  };

  const logout = () => setLoggedInUser(null);

  const addEvent = () => {
    const name = document.getElementById("eventName").value;
    if (!name) return alert("⚠️ Enter event name");
    setEvents([...events, name]);
    document.getElementById("eventName").value = "";
  };
  const removeEvent = (i) => {
    setEvents(events.filter((_, idx) => idx !== i));
  };

  const addAthlete = () => {
    const name = document.getElementById("athleteName").value;
    if (!name) return alert("⚠️ Enter athlete name");
    setAthletes([...athletes, name]);
    document.getElementById("athleteName").value = "";
  };
  const removeAthlete = (i) => {
    setAthletes(athletes.filter((_, idx) => idx !== i));
  };

  const addJudge = () => {
    const name = document.getElementById("judgeName").value;
    const role = document.getElementById("judgeRole").value;
    if (!name) return alert("⚠️ Enter judge name");
    setJudges([...judges, { name, role }]);
    document.getElementById("judgeName").value = "";
  };
  const removeJudge = (i) => {
    setJudges(judges.filter((_, idx) => idx !== i));
  };

  const saveScore = (athlete, D, A, T, Penalty) => {
    if (D === "" || A === "" || T === "" || Penalty === "") {
      return alert("⚠️ Enter all scores");
    }
    setScores({ ...scores, [athlete]: { D, A, T, Penalty } });
    alert(`✅ Scores saved for ${athlete}`);
  };

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
      {/* Same UI as before: Login, Signup, Forgot, Dashboard */}
      {/* If you need this UI code again, I’ll send full version */}
    </div>
  );
}
