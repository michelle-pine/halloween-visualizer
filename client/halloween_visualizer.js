import Visualizer from './classes/visualizer'
import { interpolateBasis } from 'd3-interpolate'
import { sin, circle } from './util/canvas'

function drawImageScaled(img, ctx) {
  var canvas = ctx.canvas ;
  // get the scale
  var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  // get the top left position of the image
  var x = (canvas.width / 2) - (img.width / 2) * scale;
  var y = (canvas.height / 2) - (img.height / 2) * scale;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

export default class HalloweenVisualizer extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 20 })
    this.heights = {}
    for (let i = 0; i < 200; i++) { 
      this.heights[i] = Math.floor(Math.random() * Math.floor(20));
    }
    this.deg = 0;
    this.spinDeg = 0;
    this.direction = 1;
  }

  hooks () {
    this.sync.on('bar', bar => {
      this.direction = this.direction * -1;
    })
  }

  paint ({ ctx, height, width, now }) {
    const beat = interpolateBasis([0, this.sync.volume * 100, 0])(this.sync.beat.progress)
    var circleX = width / 2;
    var circleY = height / 2;
    ctx.save();
    this.deg = (this.deg + 1 % 360);
    ctx.fillStyle = 'white'
    //   var gradient = ctx.createLinearGradient(0,0, width,height);
    // gradient.addColorStop(0, '#ff7921');
    // gradient.addColorStop(.5, '#ff7921');
    // gradient.addColorStop(1, '#ff7921');
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0, 0, width, height)
    var background = new Image();
    background.src = "https://64.media.tumblr.com/86454f10168785c28510e3c6e2dcfed4/f4b567c548b6bcd6-b4/s2048x3072/67f3839e98e8b4966938ec391a9facac8bec921d.png";

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
      drawImageScaled(background, ctx)  
    }

    ctx.lineWidth = beat
    ctx.strokeStyle = 'white';
    ctx.setTransform(1,0,0,.5, 0, circleY);
    sin(ctx, now / 100, 0, this.sync.volume * 50, 100)
    ctx.stroke()
    var bars = 50;
    var barWidth = height / 100;
    var barHeight = beat + height / 10;
    var radius = height / 5;
    ctx.setTransform(1,0,0,1, circleX, circleY);
    circle(ctx, 0, 0, radius)
    ctx.lineWidth = this.sync.volume * height / 4;
    ctx.strokeStyle = "white"
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fill()
    ctx.stroke();
    circle(ctx, 0, 0, radius - height / 50)
    ctx.fillStyle = "#ed5000"
    ctx.lineWidth = 0;
    ctx.stroke();
    ctx.fill()
    ctx.fillStyle = "black";
    var counter = 0;
    for(var i = 0; i < Math.PI*2; i+= (Math.PI*2 / bars)){
      var rad = i;
      ctx.setTransform(1,0,0,1, circleX, circleY);
      ctx.rotate(rad);
      ctx.rotate((this.deg * this.direction) * Math.PI / 180);
      ctx.translate(0, radius);

      // draw the bar
      ctx.fillRect(
        -barWidth/2, 
        0, 
        barWidth,
        barHeight + this.heights[counter] * 4, 
      );
      counter++;
    }
    ctx.restore();
    ctx.setTransform(1,0,0,1, 0, 0);
    ctx.font = "15px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText("Now Playing ♬", 20, height - 78);
    ctx.font = "30px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(this.sync.state.currentlyPlaying.name, 20, height - 45);
    ctx.font = "20px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(this.sync.state.currentlyPlaying.artists[0].name, 20, height - 20);
  }
}