const video = document.getElementById("hostedVideo");
const videoStatus = document.getElementById("videoStatus");
const videoQuality = document.getElementById("videoQuality");

video.addEventListener("loadedmetadata", () => {
    const duration = Number.isFinite(video.duration)
        ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, "0")}`
        : "duration unavailable";
    const resolution = `${video.videoWidth} × ${video.videoHeight}`;
    videoStatus.textContent = `Replay ready · ${resolution} · ${duration}`;
    videoQuality.textContent = resolution;
});

video.addEventListener("error", () => {
    videoStatus.textContent = "The match replay could not be loaded. Check that video.mp4 is beside this page.";
    videoQuality.textContent = "Unavailable";
});
