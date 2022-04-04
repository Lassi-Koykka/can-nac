import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const ctx = canvas.getContext("2d")!;

const runGame = (ctx: CanvasRenderingContext2D) => {
  // ANIMATION PROPERTIES
  let lastTime = 0;
  const fps = 60;
  const nextFrame = 1000 / fps;

  // START
  let frame = requestAnimationFrame(loop);

  // LOOP
  function loop(t: number) {
    const delta = t - lastTime;
    if (delta > nextFrame) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lastTime = t;
    }
    frame = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(frame);
  };
};

canvas.addEventListener("load", runGame(ctx));
