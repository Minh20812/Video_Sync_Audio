const video = document.getElementById("video");
const audio = document.getElementById("audio");
const videoUrlInput = document.getElementById("videoUrl");
const audioUrlInput = document.getElementById("audioUrl");
const audioFileInput = document.getElementById("audioFile");
const timeDisplay = document.getElementById("time");

let hls;

function loadExample() {
  videoUrlInput.value =
    "https://s6.kkphimplayer6.com/20250924/sOEdgdJ3/index.m3u8";
  // "https://s6.kkphimplayer6.com/20250922/0xTRGES0/index.m3u8";
  // "https://s6.kkphimplayer6.com/20250920/SL75UDhS/index.m3u8";
  audioUrlInput.value =
    "https://archive.org/download/s1_e1_tv_tmdb_298698/s1_e1_tv_tmdb_298698.ogg";
  // "https://archive.org/download/s1_e1144_tv_imdb_tt0388629/s1_e1144_tv_imdb_tt0388629.ogg";
  // "https://archive.org/download/movie_imdb_tt35222590/movie_imdb_tt35222590.ogg";
  loadMedia();
}

function loadMedia() {
  const videoUrl = videoUrlInput.value.trim();
  const audioUrl = audioUrlInput.value.trim();
  const audioFile = audioFileInput.files[0];

  // Load video
  if (hls) {
    hls.destroy();
  }
  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoUrl;
  } else {
    alert("HLS not supported in this browser");
  }

  // Load audio
  if (audioFile) {
    audio.src = URL.createObjectURL(audioFile);
  } else if (audioUrl) {
    audio.src = audioUrl;
  } else {
    audio.src = "";
  }
}

// Đồng bộ play/pause/seek/speed
video.addEventListener("play", () => audio.play().catch(() => {}));
video.addEventListener("pause", () => audio.pause());
video.addEventListener("seeked", () => {
  audio.currentTime = video.currentTime;
});
video.addEventListener("ratechange", () => {
  audio.playbackRate = video.playbackRate;
});

// Cập nhật time display
video.addEventListener("timeupdate", () => {
  timeDisplay.textContent =
    formatTime(video.currentTime) + " / " + formatTime(video.duration);
});

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function syncNow() {
  audio.currentTime = video.currentTime;
}

function setSpeed(rate) {
  video.playbackRate = parseFloat(rate);
  audio.playbackRate = parseFloat(rate);
}

function formatTime(sec) {
  if (!sec) return "00:00";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
