class Noise {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;

  constructor(options: { phase?: number; offset?: number; frequency?: number; amplitude?: number } = {}) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  }
}

class Node {
  x = 0;
  y = 0;
  vy = 0;
  vx = 0;
}

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(e: { spring: number }) {
    this.spring = e.spring + 0.1 * Math.random() - 0.05;
    // @ts-ignore
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    // @ts-ignore
    for (let i = 0; i < E.size; i++) {
      const node = new Node();
      // @ts-ignore
      node.x = pos.x;
      // @ts-ignore
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update() {
    // @ts-ignore
    let spring = this.spring;
    let t = this.nodes[0];
    // @ts-ignore
    t.vx += (pos.x - t.x) * spring;
    // @ts-ignore
    t.vy += (pos.y - t.y) * spring;
    // @ts-ignore
    for (let i = 0, a = this.nodes.length; i < a; i++) {
      t = this.nodes[i];
      if (i > 0) {
        const n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * spring;
        t.vy += (n.y - t.y) * spring;
        // @ts-ignore
        t.vx += n.vx * E.dampening;
        // @ts-ignore
        t.vy += n.vy * E.dampening;
      }
      // @ts-ignore
      t.vx *= this.friction;
      // @ts-ignore
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      // @ts-ignore
      spring *= E.tension;
    }
  }

  draw() {
    let e, t;
    let n = this.nodes[0].x;
    let i = this.nodes[0].y;
    // @ts-ignore
    ctx.beginPath();
    // @ts-ignore
    ctx.moveTo(n, i);
    let a;
    for (a = 1; a < this.nodes.length - 2; a++) {
      e = this.nodes[a];
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      // @ts-ignore
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }
    e = this.nodes[a];
    t = this.nodes[a + 1];
    // @ts-ignore
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    // @ts-ignore
    ctx.stroke();
    // @ts-ignore
    ctx.closePath();
  }
}

// @ts-ignore
function onMousemove(e: any) {
  function o() {
    lines = [];
    for (let i = 0; i < E.trails; i++)
    // @ts-ignore
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
  }
  // @ts-ignore
  function c(e: any) {
    e.touches
      ? // @ts-ignore
        ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY))
      : // @ts-ignore
        ((pos.x = e.clientX), (pos.y = e.clientY)),
      e.preventDefault();
  }
  // @ts-ignore
  function l(e: any) {
    // @ts-ignore
    1 == e.touches.length &&
      ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY));
  }
  document.removeEventListener("mousemove", onMousemove),
    document.removeEventListener("touchstart", onMousemove),
    document.addEventListener("mousemove", c),
    document.addEventListener("touchmove", c),
    document.addEventListener("touchstart", l),
    c(e),
    o(),
    render();
}

function render() {
  // @ts-ignore
  if (ctx.running) {
    // @ts-ignore
    ctx.globalCompositeOperation = "source-over";
    // @ts-ignore
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // @ts-ignore
    ctx.globalCompositeOperation = "lighter";
    // @ts-ignore
    ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.025)";
    // @ts-ignore
    ctx.lineWidth = 10;
    for (var e, t = 0; t < E.trails; t++) {
      // @ts-ignore
      (e = lines[t]).update();
      e.draw();
    }
    // @ts-ignore
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  // @ts-ignore
  ctx.canvas.width = window.innerWidth - 20;
  // @ts-ignore
  ctx.canvas.height = window.innerHeight;
}

// @ts-ignore
var ctx: any,
  // @ts-ignore
  f: any,
  e = 0,
  pos = {} as any,
  // @ts-ignore
  lines: Line[] = [],
  E = {
    debug: true,
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };

export const renderCanvas = function () {
  // @ts-ignore
  ctx = document.getElementById("canvas").getContext("2d");
  ctx.running = true;
  ctx.frame = 1;
  f = new Noise({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });
  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("touchstart", onMousemove);
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", () => {
    // @ts-ignore
    if (!ctx.running) {
      // @ts-ignore
      ctx.running = true;
      render();
    }
  });
  window.addEventListener("blur", () => {
    // @ts-ignore
    ctx.running = true;
  });
  resizeCanvas();
}; 