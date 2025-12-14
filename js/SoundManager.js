export class SoundManager {
  constructor() {
    this.bgMusic = document.getElementById("bg-music");
    this.moveSound = document.getElementById("move-sound");
    this.btn = document.getElementById("sound-btn");
    this.icon = document.getElementById("sound-icon");

    this.isMuted = false;

    if (this.bgMusic) this.bgMusic.volume = 0.2;
    if (this.moveSound) this.moveSound.volume = 0.5;

    this.initListeners();
  }

  initListeners() {
    if (this.btn) {
      this.btn.addEventListener("click", () => this.toggleMute());
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.bgMusic.muted = true;
      this.moveSound.muted = true;
      this.icon.src = "img/mute.png";
    } else {
      this.bgMusic.muted = false;
      this.moveSound.muted = false;
      this.icon.src = "img/volume.png";

      if (this.bgMusic.paused) {
        this.bgMusic.play().catch((e) => console.log("Autoplay prevented"));
      }
    }
  }

  playTheme() {
    if (!this.isMuted && this.bgMusic.paused) {
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log(
            "Audio autoplay prevented by browser. Waiting for interaction."
          );
        });
      }
    }
  }

  playMove() {
    if (!this.isMuted) {
      this.moveSound.currentTime = 0;
      this.moveSound.play().catch((e) => {});
    }
  }
}
