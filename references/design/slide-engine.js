class SlideEngine {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.container = document.querySelector('.slide-container');
    this.progressBar = document.querySelector('.f1-progress-bar');

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.showSlide(0);
  }

  // 1920x1080 고정 비율 자동 리사이징
  handleResize() {
    if (!this.container) return;
    const targetWidth = 1920;
    const targetHeight = 1080;
    const scale = Math.min(
      window.innerWidth / targetWidth,
      window.innerHeight / targetHeight
    );
    this.container.style.transform = `scale(${scale})`;
    this.container.style.transformOrigin = 'center center';
  }

  showSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.slides.forEach((slide, idx) => {
      slide.style.display = idx === index ? 'block' : 'none';
      slide.classList.toggle('active', idx === index);
    });
    this.currentIndex = index;

    // 프로그레스 바 갱신
    if (this.progressBar) {
      const progressPercent = ((index + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progressPercent}%`;
    }
  }

  next() { this.showSlide(this.currentIndex + 1); }
  prev() { this.showSlide(this.currentIndex - 1); }

  handleKeydown(e) {
    if (['ArrowRight', 'Space', 'PageDown'].includes(e.code)) {
      e.preventDefault();
      this.next();
    } else if (['ArrowLeft', 'PageUp'].includes(e.code)) {
      e.preventDefault();
      this.prev();
    } else if (e.code === 'KeyF') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.f1SlideEngine = new SlideEngine();
});