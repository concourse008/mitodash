'use strict';
//var canvas = document.getElementById('maincanvas');
const canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0")
  };
let flip = 0;
canvas[1-flip].style.visibility='hidden';
canvas[flip].style.visibility='visible';
canvas[2].style.visibility='visible';
flip = 1 - flip;
let ctx = canvas[flip].getContext('2d');
const ctx0 = canvas[2].getContext('2d');
const srcs = [
  ['back.png',0,0],
  ['mito.png',40,240],
  ['obs.png',400,280],
  ['gameover.png',200,100]
];

let images = [];
for (let i in srcs){
  images[i] = new Image();
  images[i].src = srcs[i][0];
}

let loadedCount = 1;
for (let i in images){
  images[i].addEventListener('load',function(){
    if (loadedCount == images.length){
      for(let j in images){
        ctx.drawImage(images[j],srcs[j][1],srcs[j][2]);
        console.log('a');
      }
    }
    console.log('b');
    loadedCount++;
  },false);
}

//クリックでジャンプする
let point = 0;
let jumpAble = true;
canvas[2].addEventListener('click',e =>{
  //マウスの座標をカンバスないの座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  //クリック判定処理
  jumpAble = false;
  console.log('c');
})

let x = 40;
let y = 240;
let n = 0;
let obs = [400,400,400];
let lastgo = 0;
const jumphight = [-5,-5,-5,-4,-3,-3,-2,-2,-1,0,0,0,1,1,1,2,2,2,3,3,3,4,4,4]
function move(){//毎1/10秒の更新
  canvas[1-flip].style.visibility='hidden';
  canvas[flip].style.visibility='visible';
  flip = 1 - flip;
  ctx = canvas[flip].getContext('2d');

  if (jumpAble == false){//10コマ上がって12コマ下がる
    if ( n == 24 ){
      n = 0;
      jumpAble = true;
    }else{
    y = y + jumphight[n]
    n++;
    }
  }
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(images[0],0,0);
  ctx.drawImage(images[1],x,y);
  obstacle();
  hitcheck();
}

//障害物の表示、動き
function obstacle(){
  for (let i in obs){
    if (obs[i] == 400){
      if (Math.floor(Math.random()*10) === 0 && lastgo >= 40){
        ctx.drawImage(images[2],obs[i],280);
        obs[i] = obs[i] -10;
        console.log('go');
        lastgo = 0;
      }
      lastgo++;
    }else if(obs[i] <= -15){
      obs[i] = 400;
    }else{
      ctx.drawImage(images[2],obs[i],280);
      obs[i] = obs[i] - 7;//障害物のスピード
      console.log('move');
    }
  }
}
//当たり判定
function hitcheck(){
  for (let i in obs){
    if (obs[i] <= 82 && obs[i] >= 20 && y >= 225){
      gameover();
      console.log('hit');
    }
  }
}
function gameover(){
  ctx0.drawImage(images[3],100,100);
  clearInterval(moveing);
}

const moveing = setInterval(move,1000/30);

/*ジャンプし続ける
var x = 40;
var y = 240;
var n = 5;
var upswitch = 1;
function jump(){
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(images[0],0,0);
  ctx.drawImage(images[1],x,y);

  if (y <= 225){
    upswitch = 0;
    n = n ;
    console.log('down');
  }else if (y >= 240) {
    upswitch = 1;
    n = n - 11;
  } else { 
  }

  if (upswitch == 0){
    n = n + 1;
    y = y + n;
  }else{
    n = n + 1;
    y = y + n;
  }

  console.log(n);
  console.log(y);
}
setInterval(jump,100);
*/