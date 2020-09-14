(function () {
  let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    w = (canvas.width = innerWidth),
    h = (canvas.height = innerHeight),
    particles = [],
    properties = {
      bgColor: "rgba(17, 17, 19, 1)",
      particleColor: "rgba(255, 40, 40, 1)",
      particleRadius: 3,
      particleCount: 60,
      particleMaxVelocity: 0.5,
      lineLength: 150,
      particleLife: 6,
    };

  document.querySelector("body").appendChild(canvas);

  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    reDrawBackground();
  };

  function reDrawBackground() {
    ctx.fillStyle = properties.bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  reDrawBackground();
})();
