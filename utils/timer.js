export class Timer {
  constructor(time) {
    this.minutes = Math.floor((time % 3600000) / 60000);
    this.seconds = Math.floor((time % 60000) / 1000);
    this.time = time;
  }

  formatted = () => {
    const minutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes;
    const seconds = this.seconds < 10 ? `0${this.seconds}` : this.seconds;
    return `${minutes}:${seconds}`;
  }
};