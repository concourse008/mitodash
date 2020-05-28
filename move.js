//var canvas = document.getElementById('maincanvas');
var canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0")
  };
var flip = 0;
canvas[1-flip].style.visibility='hidden';
canvas[flip].style.visibility='visible';
canvas[2].style.visibility='visible';
flip = 1 - flip;
ctx = canvas[flip].getContext('2d');
var srcs = [
  ['back.png',0,0],
  ['mito.png',40,240],
  ['obs.png',400,280]
];

var images = [];
for (var i in srcs){
  images[i] = new Image();
  images[i].src = srcs[i][0];
}

var loadedCount = 1;
for (var i in images){
  images[i].addEventListener('load',function(){
    if (loadedCount == images.length){
      for(var j in images){
        ctx.drawImage(images[j],srcs[j][1],srcs[j][2]);
        console.log('a');
      }
    }
    console.log('b');
    loadedCount++;
  },false);
}

//クリックでジャンプする
var point = 0;
var jumpAble = true;
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

var x = 40;
var y = 240;
var n = 0;
var obs = 400;
var jumphight = [-5,-5,-5,-4,-3,-3,-2,-2,-1,0,0,0,1,1,1,2,2,2,3,3,3,4,4,4]
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
  else{
  console.log('b');
  }
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(images[0],0,0);
  ctx.drawImage(images[1],x,y);
  if (1 == 1){
    obstacle();
  }
}

//障害物の表示、動き
function obstacle(){
  if (obs == 400){
    ctx.drawImage(images[2],obs,280);
    obs = obs -10;
  }else if(obs == -20){
    obs = 400;
  }else{
    ctx.drawImage(images[2],obs,280);
    obs = obs - 10;
  }

}
setInterval(move,1000/30);

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