
export default (text, options) => {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var canvasWidth = 4000;
  var canvasHeight = 4000;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.textAlign = text.options.textAlign;
  ctx.textBaseline = text.options.textBaseline;
  ctx.globalAlpha = text.options.globalAlpha;
  ctx.font = text.options.font;

  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate(text.options.rotateAngle);

  ctx.translate(-canvasWidth / 2 * 1.2, -canvasHeight / 2 * 1.2);
  ctx.fillStyle = text.options.fillStyle;

  var waterMarkText = [];
  var chunkWidth = text.options.chunkWidth;
  var chunkHeight = text.options.chunkHeight;
  var horizontalChunkCount = Math.ceil(canvasWidth / chunkWidth) + 1;
  var verticalChunkCount = Math.ceil(canvasHeight / chunkHeight) + 1;

  var texto = text.waterMarkText.split(",");

  for (var j = 0, initY = chunkHeight / 2, indent = 0; j <= verticalChunkCount; j += 1) {
    indent = parseInt(j % 2);

    for (var i = 0, initX = chunkWidth / 2; i <= horizontalChunkCount; i += 1) {
      waterMarkText.push({
        text1: texto[0],
        text2: texto[1],
        x: i * chunkWidth + indent * initX,
        y: j * chunkHeight + initY,
        y2: j * chunkHeight + initY + 15
      });
    }
  }

  waterMarkText.forEach(function (item) {
    ctx.fillText(item.text1, item.x, item.y);
    ctx.fillText(item.text2, item.x, item.y2);
  });

  return ctx.canvas.toDataURL();
}
