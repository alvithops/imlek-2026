// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ---------- AUTOPLAY AUDIO (dengan berbagai usaha) ----------
  const audio = document.getElementById('imlekAudio');
  
  function playAudio() {
    audio.play().catch(e => {
      // kebanyakan browser block autoplay tanpa interaksi, tapi kita paksa dengan beberapa cara
      console.log('autoplay ditangguhkan, coba lagi dengan interaksi diam-diam');
    });
  }

  // usaha  pertama langsung sekara 
  playAudio();

  // usaha tambahan: setelah interaksi ringan (sentuhan/klik dimana saja, tapi tanpa mengganggu UI)
  document.body.addEventListener('touchstart', function onceTouch() {
    audio.play();
    document.body.removeEventListener('touchstart', onceTouch);
  }, { passive: true });

  document.body.addEventListener('mouseenter', function onceMouse() {
    audio.play();
    document.body.removeEventListener('mouseenter', onceMouse);
  }, { once: true });

  // bahkan jika sebelumnya gagal, coba lagi tiap 3 detik (sampai berhasil)
  const audioInterval = setInterval(() => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      clearInterval(audioInterval); // sudah playing
    }
  }, 2000);

  // ---------- KEMBANG API / PARTIKEL SEDERHANA (canvas) ----------
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  initCanvas();

  // particle class
  class FireParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 1) * 4 - 1; // naik
      this.size = Math.random() * 6 + 3;
      this.color = `hsl(${Math.random() * 60 + 20}, 100%, 65%)`; // merah/emas
      this.life = 1.0;
      this.decay = 0.008 + Math.random() * 0.01;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // gravitasi
      this.life -= this.decay;
    }
    draw() {
      ctx.globalAlpha = this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ffaa33';
      ctx.shadowBlur = 18;
      ctx.fill();
    }
  }

  function spawnFirework() {
    // buat beberapa partikel dari titik acak di sepertiga bawah layar
    const count = 14 + Math.floor(Math.random() * 18);
    const baseX = Math.random() * width;
    const baseY = height * 0.6 + Math.random() * height * 0.3;
    for (let i = 0; i < count; i++) {
      particles.push(new FireParticle(baseX, baseY));
    }
  }

  // animasi loop
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowColor = '#ffaa33';
    ctx.shadowBlur = 12;

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0.02 || particles[i].y > height + 50) {
        particles.splice(i, 1);
      }
    }

    // sesekali spawn kembang api baru (tiap 20 frame ~ random)
    if (Math.random() < 0.02 && particles.length < 180) {
      spawnFirework();
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // tambahan spawn periodik dengan interval
  setInterval(() => {
    if (particles.length < 150) spawnFirework();
  }, 800);

  // resize handler
  window.addEventListener('resize', () => {
    initCanvas();
  });

  // ----- pastikan video play (kalau ada masalah autoplay di mobile, tambahan) -----
  const videos = document.querySelectorAll('video');
  videos.forEach(v => {
    v.play().catch(() => {});
    // coba pastikan play setelah interaksi
    document.body.addEventListener('click', function playVids() {
      v.play();
    }, { once: true, passive: true });
  });

  // tambahan efek partikel pada hover (tidak merusak)
  // agar terasa meriah, tambahkan spawn dengan gerakan mouse (opsional)
  let lastSpawn = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn > 160 && particles.length < 200) {
      for (let i=0; i<4; i++) {
        let p = new FireParticle(e.clientX, e.clientY);
        p.vx += (Math.random()-0.5)*5;
        p.vy = -Math.random()*5 - 1;
        particles.push(p);
      }
      lastSpawn = now;
    }
  });

  // sembunyikan elemen dummy audio control? tidak diperlukan

  console.log('Imlek 2026 — website meriah siap');
});