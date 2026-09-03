document.addEventListener("DOMContentLoaded", () => {
  const envelope = document.getElementById("envelopeScreen");
  const pages = document.getElementById("pages");
  const sealButton = document.getElementById("sealButton");
  const sparkles = document.getElementById("sparkles");
  const whatsappLink = document.getElementById("whatsappLink");
  let opening = false;

  for (let i = 0; i < 18; i += 1) sparkles.appendChild(document.createElement("i"));

  whatsappLink.href = "https://wa.me/970598494977?text=" +
    encodeURIComponent("مرحبًا، أؤكد حضوري حفل زفاف سامر وسمر 🤍");

  sealButton.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    envelope.classList.add("is-opening");
    window.setTimeout(() => {
      envelope.hidden = true;
      pages.classList.add("is-visible");
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 2100);
  });

  document.querySelectorAll(".scratch-tile").forEach((tile) => {
    const canvas = tile.querySelector("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let scratching = false;
    let revealed = false;

    const paintCover = () => {
      if (revealed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#dec7b7");
      gradient.addColorStop(0.5, "#ead8ca");
      gradient.addColorStop(1, "#cfb09d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(255,255,255,.18)";
      for (let x = -rect.height; x < rect.width; x += 12) ctx.fillRect(x, 0, 2, rect.height);
    };

    const scratch = (clientX, clientY) => {
      if (revealed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / rect.width;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const finish = () => {
      scratching = false;
      if (revealed) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let sampled = 0;
      for (let i = 3; i < data.length; i += 64) {
        sampled += 1;
        if (data[i] < 80) transparent += 1;
      }
      if (transparent > sampled * 0.22) {
        revealed = true;
        canvas.style.transition = "opacity .35s ease";
        canvas.style.opacity = "0";
        window.setTimeout(() => canvas.remove(), 360);
      }
    };

    canvas.addEventListener("pointerdown", (event) => {
      scratching = true;
      canvas.setPointerCapture(event.pointerId);
      scratch(event.clientX, event.clientY);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (scratching) scratch(event.clientX, event.clientY);
    });
    canvas.addEventListener("pointerup", finish);
    canvas.addEventListener("pointercancel", finish);

    paintCover();
  });
});
