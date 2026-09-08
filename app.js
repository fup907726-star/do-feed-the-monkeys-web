const state = { minutes: 18*60+28, cam: "dock", fed: false, seenCall: false, leftGate: false, backHall: false, fogPulse: 0 };
const clock = document.getElementById("clock");
const room = document.getElementById("room");
const rctx = room.getContext("2d");
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

function hhmm(m) {
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return String(h).padStart(2,"0") + ":" + String(mm).padStart(2,"0");
}
function resizeRoom() {
  const r = room.parentElement.getBoundingClientRect();
  room.width = Math.floor(r.width * devicePixelRatio);
  room.height = Math.floor(Math.max(280, r.height) * devicePixelRatio);
}
function resizeMon() {
  const r = cv.parentElement.getBoundingClientRect();
  cv.width = Math.floor(r.width * devicePixelRatio);
  cv.height = Math.floor(r.height * devicePixelRatio);
}
window.addEventListener("resize", () => { resizeRoom(); drawRoom(); resizeMon(); });

function iso(x, z, y) {
  const w = room.width, h = room.height;
  const s = Math.min(w, h) / 22;
  const cx = w * 0.52, cy = h * 0.58;
  return {
    X: cx + (x - z) * s * 0.86,
    Y: cy + (x + z) * s * 0.48 - y * s * 0.9
  };
}
function poly(pts, fill, stroke) {
  rctx.beginPath();
  pts.forEach((p,i) => i ? rctx.lineTo(p.X,p.Y) : rctx.moveTo(p.X,p.Y));
  rctx.closePath();
  if (fill) { rctx.fillStyle = fill; rctx.fill(); }
  rctx.strokeStyle = stroke || "#1a1814";
  rctx.lineWidth = 1.2 * devicePixelRatio;
  rctx.stroke();
}
function box(x,z,y,sx,sz,sy, top, sideA, sideB) {
  const b = iso(x+sx, z, y), c = iso(x+sx, z+sz, y), d = iso(x, z+sz, y);
  const a2 = iso(x, z, y+sy), b2 = iso(x+sx, z, y+sy), c2 = iso(x+sx, z+sz, y+sy), d2 = iso(x, z+sz, y+sy);
  poly([b,c,c2,b2], sideA);
  poly([d,c,c2,d2], sideB);
  poly([a2,b2,c2,d2], top);
}

function drawRoom() {
  const w = room.width, h = room.height;
  const g = rctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, "#6a6e72");
  g.addColorStop(0.45, "#4a4e52");
  g.addColorStop(1, "#2a2c2e");
  rctx.fillStyle = g; rctx.fillRect(0,0,w,h);
  for (let i=0;i<40;i++) {
    rctx.fillStyle = "rgba(220,224,228," + (0.04+Math.random()*0.06) + ")";
    rctx.fillRect(Math.random()*w, Math.random()*h*0.45, 8, 2);
  }
  const H = 3;
  poly([iso(-6,-4.5,0), iso(6,-4.5,0), iso(6,4.5,0), iso(-6,4.5,0)], "#6a6660", "#2a2824");
  poly([iso(3.0, 1.4, 0.02), iso(5.8, 1.4, 0.02), iso(5.8, 4.3, 0.02), iso(3.0, 4.3, 0.02)], "#1c1a16", "#0a0908");
  for (let i=0;i<8;i++) {
    const t = i/8;
    const p1 = iso(3.1 + t*0.1, 1.5 + t*2.6, -t*1.4);
    const p2 = iso(5.7 - t*0.1, 1.5 + t*2.6, -t*1.4);
    rctx.strokeStyle = "#3a342c";
    rctx.beginPath(); rctx.moveTo(p1.X,p1.Y); rctx.lineTo(p2.X,p2.Y); rctx.stroke();
  }
  poly([iso(-6,-4.5,0), iso(6,-4.5,0), iso(6,-4.5,H), iso(-6,-4.5,H)], "#8a8680");
  poly([iso(-6,-4.5,0), iso(-6,4.5,0), iso(-6,4.5,H), iso(-6,-4.5,H)], "#7a7670");
  function win(z0) {
    poly([iso(-5.98, z0, 0.9), iso(-5.98, z0+1.4, 0.9), iso(-5.98, z0+1.4, 2.4), iso(-5.98, z0, 2.4)], "#c8d0d4", "#2a2418");
    poly([iso(-5.97, z0+0.1, 1.1), iso(-5.97, z0+1.3, 1.1), iso(-5.97, z0+1.3, 2.2), iso(-5.97, z0+0.1, 2.2)], "rgba(186,194,198,0.55)", "#4a585c");
  }
  win(-2.6); win(0.4);
  poly([iso(-6,-4.5,H), iso(6,-4.5,H), iso(6,4.5,H), iso(-6,4.5,H)], "rgba(90,88,84,0.55)");
  const lamp = iso(0, 0.2, H - 0.15);
  rctx.fillStyle = "#e8c878";
  rctx.beginPath(); rctx.arc(lamp.X, lamp.Y, 10*devicePixelRatio, 0, Math.PI*2); rctx.fill();
  const glow = rctx.createRadialGradient(lamp.X, lamp.Y+20, 4, lamp.X, lamp.Y+80, 180*devicePixelRatio);
  glow.addColorStop(0, "rgba(232,200,120,0.22)");
  glow.addColorStop(1, "rgba(232,200,120,0)");
  rctx.fillStyle = glow;
  rctx.fillRect(0,0,w,h);
  box(-1.1, -4.2, 0, 2.2, 1.5, 0.42, "#6a4a38", "#4a3228", "#3a281e");
  box(-0.9, -4.05, 0.42, 1.8, 1.2, 0.12, "#8a6a52", "#5a4032", "#4a3228");
  box(-5.6, -1.2, 0, 0.8, 2.0, 0.78, "#8a6a42", "#5a4630", "#4a3826");
  box(-5.55, -0.55, 0.78, 0.12, 0.7, 0.55, "#2a2a28", "#1a1a18", "#121210");
  poly([iso(-5.54, -0.48, 0.86), iso(-5.54, 0.08, 0.86), iso(-5.54, 0.08, 1.26), iso(-5.54, -0.48, 1.26)], "#3a5a48", "#0a0c0a");
  box(-4.7, -0.35, 0, 0.5, 0.5, 0.46, "#7a5a3a", "#4a3828", "#3a2a1e");
  rctx.fillStyle = "#d8d0c0";
  rctx.font = (11 * devicePixelRatio) + "px sans-serif";
  const tw = iso(-5.2, -1.1, 1.6);
  rctx.fillText("西窗 · 木桌", tw.X, tw.Y);
  const sw = iso(4.2, 2.4, 0.3);
  rctx.fillText("楼梯井", sw.X, sw.Y);
  const bw = iso(-0.2, -3.6, 0.8);
  rctx.fillText("床", bw.X, bw.Y);
}

function drawCam() {
  const w = cv.width, h = cv.height;
  ctx.fillStyle = "#0d120e"; ctx.fillRect(0,0,w,h);
  const t = state.minutes;
  for (let i=0;i<80;i++) {
    ctx.fillStyle = "rgba(180,200,160,0.08)";
    ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
  }
  ctx.fillStyle = "#1a2318";
  if (state.cam === "dock") {
    ctx.fillRect(0, h*0.62, w, h*0.38);
    ctx.fillStyle = "#2a2a22";
    ctx.fillRect(w*0.08, h*0.28, w*0.55, h*0.34);
    ctx.fillStyle = "#c9b27a";
    const here = t >= 18*60+30 && t <= 21*60+20 && !(state.leftGate && t > 20*60+40);
    if (here) {
      ctx.fillRect(w*0.62, h*0.46, w*0.08, h*0.22);
      if (t >= 18*60+50 && t <= 19*60+10) {
        ctx.fillStyle = "#8ad0a0";
        ctx.fillRect(w*0.70, h*0.48, 8, 8);
        state.seenCall = true;
      }
    }
  } else if (state.cam === "gate") {
    ctx.fillRect(0, h*0.7, w, h*0.3);
    ctx.fillStyle = "#3a4030";
    ctx.fillRect(w*0.2, h*0.2, w*0.12, h*0.5);
    ctx.fillRect(w*0.68, h*0.2, w*0.12, h*0.5);
    const passing = (t >= 21*60 && t <= 21*60+8) || (state.fed && t >= 20*60+10 && t <= 20*60+18);
    if (passing) {
      ctx.fillStyle = "#c9b27a";
      ctx.fillRect(w*0.46, h*0.48, w*0.07, h*0.2);
      state.leftGate = true;
    }
  } else {
    ctx.fillStyle = "#141816"; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "#2c2a24";
    ctx.fillRect(w*0.15, h*0.25, w*0.22, h*0.5);
    ctx.fillRect(w*0.62, h*0.25, w*0.22, h*0.5);
    const back = (!state.fed && t >= 21*60+5 && t <= 21*60+20);
    if (back) {
      ctx.fillStyle = "#c9b27a";
      ctx.fillRect(w*0.64, h*0.48, w*0.07, h*0.22);
      state.backHall = true;
    }
  }
  ctx.fillStyle = "#8a9a7a";
  ctx.font = (12 * devicePixelRatio) + "px monospace";
  ctx.fillText("GW · " + hhmm(t) + " · " + state.cam, 16, h - 16);
}
function tickClock() {
  clock.textContent = hhmm(state.minutes);
  if (state.minutes >= 23*60) clock.textContent = "23:00 截止";
}
function show(id) {
  ["home","intro","desk","report","end"].forEach(k => {
    document.getElementById(k).classList.toggle("hidden", k !== id);
  });
  document.getElementById("hdr").innerHTML =
    id === "home" ? "3F home · 雾城混凝土 · <b>住处</b>" :
    "3F home · 靠窗木桌 · <b>单屏</b>";
}
function sit() { show("intro"); }
function stand() { show("home"); resizeRoom(); drawRoom(); }

document.getElementById("sitBtn").onclick = sit;
document.getElementById("lookBtn").onclick = () => {
  document.getElementById("hint").textContent = "窄窗外是雾城。楼板右下开口是下楼楼梯，本页不走。";
};
room.addEventListener("click", sit);
document.getElementById("standBtn").onclick = stand;
document.getElementById("standBtn2").onclick = stand;
document.getElementById("startBtn").onclick = () => { show("desk"); resizeMon(); drawCam(); };
document.querySelectorAll(".cams button").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".cams button").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    state.cam = b.dataset.cam;
    document.getElementById("camName").textContent =
      state.cam === "gate" ? "CAM-01 东门闸机" :
      state.cam === "dock" ? "CAM-02 卸货区" : "CAM-03 宿舍走廊";
    drawCam();
  };
});
document.getElementById("skipBtn").onclick = () => {
  if (state.minutes >= 23*60) return;
  state.minutes = Math.min(23*60, state.minutes + 30);
  tickClock(); drawCam();
};
document.getElementById("smsBtn").onclick = () => {
  state.fed = true; state.backHall = false;
  alert("短信已出去。他可能更早离开，也可能不敢回宿舍。本单不要求喂。");
};
document.getElementById("reportBtn").onclick = () => show("report");
document.getElementById("backBtn").onclick = () => { show("desk"); resizeMon(); drawCam(); };
document.getElementById("submitBtn").onclick = () => {
  const a = [q1.value,q2.value,q3.value];
  if (a.some(x => !x)) { alert("三条都要有答案。"); return; }
  const end = document.getElementById("end");
  show("end");
  const truth = [
    state.backHall ? "镜头里：回过宿舍" : "镜头里：没看到回宿舍",
    state.seenCall ? "镜头里：卸货区有长通话" : "镜头里：没抓住长通话",
    (state.leftGate && !state.backHall) ? "镜头里：离场且未回" : "镜头里：未同时满足离场+未回"
  ];
  end.innerHTML = "<h2>已交 · 低报酬 · 暴露" + (state.fed ? "略升" : "极低") + "</h2><p>你的填写：" + a.join(" ／ ") + "</p><p class='muted'>" + truth.join(" ／ ") + "</p><p>灰窗社不跟你对答案。事实在档案里，下一单另说。</p><p class='muted'><button id='homeAgain' style='margin-top:8px;padding:8px 12px'>回 3F 房间</button></p>";
  document.getElementById("homeAgain").onclick = stand;
};
tickClock();
resizeRoom();
drawRoom();
