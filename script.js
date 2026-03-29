const fixturesDiv = document.getElementById("fixtures");
const liveDiv = document.getElementById("live");
const scorecardDiv = document.getElementById("scorecard");

// 🔑 Paste your CricData API key here ONCE
const API_KEY = "53138c46-05a4-4969-b79a-465cfdcea7a1";

// Upcoming fixtures
async function loadFixtures() {
  const url = `https://api.cricdata.com/matches/upcoming?apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  fixturesDiv.innerHTML = "";

  data.matches.forEach(match => {
    if (match.team1.includes("Sunrisers Hyderabad") || match.team2.includes("Sunrisers Hyderabad")) {
      const card = document.createElement("div");
      card.className = "match-card";
      card.innerHTML = `
        <h3>${match.team1} vs ${match.team2}</h3>
        <p>Date: ${new Date(match.date).toLocaleString()}</p>
        <p>Venue: ${match.venue}</p>
        <p>Status: ${match.status}</p>
      `;
      fixturesDiv.appendChild(card);
    }
  });
}

// Live matches
async function loadLive() {
  const url = `https://api.cricdata.com/matches/live?apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  liveDiv.innerHTML = "";

  data.matches.forEach(match => {
    if (match.team1.includes("Sunrisers Hyderabad") || match.team2.includes("Sunrisers Hyderabad")) {
      const card = document.createElement("div");
      card.className = "live-card";
      card.innerHTML = `
        <h3>${match.team1} vs ${match.team2}</h3>
        <p>Score: ${match.score}</p>
        <p>Status: ${match.status}</p>
      `;
      liveDiv.appendChild(card);

      // Load detailed scorecard if available
      loadScorecard(match.id);
    }
  });
}

// Scorecard
async function loadScorecard(matchId) {
  const url = `https://api.cricdata.com/matches/${matchId}/scorecard?apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  scorecardDiv.innerHTML = "";

  if (!data.innings) {
    scorecardDiv.innerHTML = "<p>No scorecard available.</p>";
    return;
  }

  data.innings.forEach(inn => {
    const card = document.createElement("div");
    card.className = "scorecard-card";
    card.innerHTML = `
      <h3>${inn.team} - ${inn.runs}/${inn.wickets} (${inn.overs} overs)</h3>
      <p>Run Rate: ${inn.runRate}</p>
      <table>
        <tr><th>Batsman</th><th>Runs</th><th>Balls</th><th>Fours</th><th>Sixes</th></tr>
        ${inn.batsmen.map(b => `
          <tr>
            <td>${b.name}</td>
            <td>${b.runs}</td>
            <td>${b.balls}</td>
            <td>${b.fours}</td>
            <td>${b.sixes}</td>
          </tr>
        `).join("")}
      </table>
    `;
    scorecardDiv.appendChild(card);
  });
}

// Initial load
loadFixtures();
loadLive();
setInterval(loadLive, 30000);
