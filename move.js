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
  ['mito2.png',40,240],
  ['obs2.png',400,280],
  ['gameover.png',200,100],
  ['op.png',0,0],
  ['mitojump.png',0,0]
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
        ctx0.drawImage(images[4],0,0);
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
  //停止中、クリックでスタート
  if (stop == true){
    stop = false;
    restart();
  }
})

let x = 40;
let y = 20;
let n = 0;
let obs = [400,400,400];
let lastgo = 0;
let stop = true;
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
  if (jumpAble == false){
    ctx.drawImage(images[5],x,y);
  }else{
    ctx.drawImage(images[1],x,y);
  }
  score();
  hiscore++;
  obstacle();
  hitcheck();
}
//スコアの表示
let hiscore = 0;
function score() {
  ctx.font = "18px serif";
  let i = Math.floor(hiscore / 10);
  ctx.fillText("score:" + i , 250, 30);
}

//障害物の表示、動き
let speed = [6,7,8,9];
let randam = 0;
function obstacle(){
  for (let i in obs){
    if (obs[i] == 400){
      if (Math.floor(Math.random()*30) === 0 && lastgo >= 45){
        ctx.drawImage(images[2],obs[i],275);
        obs[i] = obs[i] -10;
        console.log('go');
        lastgo = 0;
      }
      lastgo++;
    }else if(obs[i] <= -15){
      obs[i] = 400;
    }else{
      ctx.drawImage(images[2],obs[i],275);
      if (hiscore % 300 == 0){
      randam = Math.floor(Math.random()*4);
      }
      obs[i] = obs[i] - speed[randam];//障害物のスピード
    }
  }
}
//当たり判定
function hitcheck(){
  for (let i in obs){
    if (obs[i] <= 82 && obs[i] >= 35 && y >= 205){
      gameover();
      console.log('hit');
    }
  }
}
function gameover(){
  ctx0.drawImage(images[3],100,100);
  clearInterval(moveing);
  stop = true;
  //ハイスコア記録
  if (totalscore <= hiscore){
  localStorage.score = hiscore;
  }
  tweet();
}

let moveing = 0;
function restart(){
  totalscore = Number(localStorage.getItem('score'));
  ctx0.clearRect(0, 0, 400, 400);
  ctx0.font = "18px serif";
  ctx0.fillText("high score:" + Math.floor(totalscore / 10) , 50, 30);
  y = 220;
  n = 0;
  obs = [400,400,400];
  lastgo = 0;
  jumpAble = true;
  hiscore = 0;
  function moveng(){
    moveing = setInterval(move,1000/30);
  }
  moveng();
}

//ハイスコア
let totalscore = 0;
function getup(){
  localStorage.setItem('score',0);
  totalscore = Number(localStorage.getItem('score'));
}
function setup(){
  totalscore = Number(localStorage.getItem('score'));
}
if(!localStorage.getItem('score')) {
  //ストレージなし
  getup();
} else {
  //ストレージあり
  setup();
}

//ツイートボタン
const tweetDivided = document.getElementById('tweet-area');
function tweet(){
  while( tweetDivided.firstChild ){
    tweetDivided.removeChild( tweetDivided.firstChild );
  }
  let way = Math.floor(hiscore / 10);
  let coment = 0;
  if (hiscore >= 10000){
    coment = '「やっぱりミトちゃんはさいきょうや……」'
  }else if (hiscore >= 3000){
    coment = '「ミトちゃんかぜになってたわ」';
  }else if(hiscore >= 2000){
    coment = '「ミトちゃんはすごいなぁ」';
  }else if(hiscore >= 1000){
    coment = '「ええきもちや」';
  }else if(hiscore >= 500){
    coment = '「なんやこのしかくいうんち」';
  }else{
    coment = '「ミトちゃんあっちになんかある！」';
  }
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('カエデログ') + '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('herf',hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text','ミトとカエデは'+way+'メートルを走り抜けました！'+coment+'　#ミトダッシュ');
  anchor.setAttribute('data-size',"large");
  anchor.setAttribute('data-url',"https://concourse008.github.io/mitodash/index.html");
  anchor.innerText = 'Tweet #カエデログ';
  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}

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
<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
*/
