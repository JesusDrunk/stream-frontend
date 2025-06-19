
const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe.user?.id;

function setRole(role) {
  localStorage.setItem("role", role);
  document.getElementById("role-selector").style.display = "none";

  if (role === "streamer") {
    document.getElementById("streamer-panel").style.display = "block";
    fetch(`/api/streamer/${userId}`).then(res => res.json()).then(data => {
      document.getElementById("streamer-balance").innerText = data.balance;
      document.getElementById("twitch-url").value = data.twitch || "";
    });
  } else {
    document.getElementById("viewer-panel").style.display = "block";
    fetch(`/api/viewer/${userId}`).then(res => res.json()).then(data => {
      document.getElementById("viewer-coins").innerText = data.coins;
    });
  }
}

function saveTwitchUrl() {
  const url = document.getElementById("twitch-url").value;
  fetch(`/api/streamer/${userId}/twitch`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
}

function topUpBalance() {
  fetch(`/api/streamer/${userId}/topup`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("streamer-balance").innerText = data.balance;
    });
}

function startWatching() {
  fetch(`/api/viewer/random-stream`)
    .then(res => res.json())
    .then(data => {
      if (!data.url) {
        alert("Нет активных стримов.");
        return;
      }
      const channel = data.url.split("twitch.tv/")[1];
      document.getElementById("twitch-player").src =
        `https://player.twitch.tv/?channel=${channel}&parent=yourdomain.com`;
      setTimeout(() => {
        fetch(`/api/viewer/${userId}/watch`, { method: "POST" })
          .then(res => res.json())
          .then(data => {
            document.getElementById("viewer-coins").innerText = data.coins;
            alert("Вам начислены монеты за просмотр!");
          });
      }, 10000);
    });
}
