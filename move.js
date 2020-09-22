'use strict';
//var canvas = document.getElementById('maincanvas');
const canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0")
};
let flip = 0;
canvas[1 - flip].style.visibility = 'hidden';
canvas[flip].style.visibility = 'visible';
canvas[2].style.visibility = 'visible';
flip = 1 - flip;
let ctx = canvas[flip].getContext('2d');
const ctx0 = canvas[2].getContext('2d');
const srcs = [
  ['back.png', 0, 0],
  ['mito2.png', 40, 240],
  ['obs2.png', 400, 280],
  ['gameover.png', 200, 100],
  ['op.png', 0, 0],
  ['mitojump.png', 0, 0]
];

let images = [];
for (let i in srcs) {
  images[i] = new Image();
  images[i].src = srcs[i][0];
}

let loadedCount = 1;
for (let i in images) {
  images[i].addEventListener('load', function () {
    if (loadedCount == images.length) {
      for (let j in images) {
        ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);
        ctx0.drawImage(images[4], 0, 0);
      }
    }
    loadedCount++;
  }, false);
}

//クリックでジャンプする
let point = 0;
let jumpAble = true;
canvas[2].addEventListener('click', e => {
  //マウスの座標をカンバスないの座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  //クリック判定処理
  jumpAble = false;
  //停止中、クリックでスタート
  if (stop == true) {
    stop = false;
    restart();
  }
})

let x = 40;
let y = 20;
let n = 0;
let obs = [400, 400, 400];
let lastgo = 0;
let stop = true;
const jumphight = [-5, -5, -5, -4, -3, -3, -2, -2, -1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4]
function move() {//毎1/10秒の更新
  if (jumpAble == false) {//10コマ上がって12コマ下がる
    if (n == 24) {
      n = 0;
      jumpAble = true;
    } else {
      y = y + jumphight[n]
      n++;
    }
  }
  score();
  hiscore++;
  obstacle();
  hitcheck();
}
//スコアの表示
let hiscore = 0;
function score() {
}

//障害物の表示、動き
let speed = [6, 7, 8, 9];
let randam = 0;
function obstacle() {
  for (let i in obs) {
    if (obs[i] == 400) {
      if (Math.floor(Math.random() * 30) === 0 && lastgo >= 45) {
        obs[i] = obs[i] - 10;
        lastgo = 0;
      }
      lastgo++;
    } else if (obs[i] <= -15) {
      obs[i] = 400;
    } else {
      if (hiscore % 300 == 0) {
        randam = Math.floor(Math.random() * 4);
      }
      obs[i] = obs[i] - speed[randam];//障害物のスピード
    }
  }
}


//画面の描写全部
function step(){
  window.requestAnimationFrame(step);

  ctx = canvas[flip].getContext('2d');
  ctx.clearRect(0,0,400,400);
//  ctx0.clearRect(0,0,400,400);
  ctx.drawImage(images[0], 0, 0);//背景
  if (jumpAble == false) {
    ctx.drawImage(images[5], x, y);//ジャンプミト
  } else {
    ctx.drawImage(images[1], x, y);//地面ミト
  }
  for(let i = 0; i < 3; i++){
    ctx.drawImage(images[2], obs[i], 260);//障害物
  }
  ctx.font = "18px sans-serif";
  let i = Math.floor(hiscore / 10);
  ctx.fillText("score:" + hiscore, 250, 30);//スコア

  
  canvas[1 - flip].style.visibility = 'hidden';
  canvas[flip].style.visibility = 'visible';
  flip = 1 - flip;
}



//当たり判定
function hitcheck() {
  for (let i in obs) {
    if (obs[i] <= 85 && obs[i] >= 45 && y >= 205) {
      gameover();
    }
  }
}
function gameover() {
  ctx0.font = "18px sans-serif";
  ctx0.drawImage(images[3], 100, 100);
  ctx0.fillText("今回のスコア：" + hiscore, 152, 338)
  clearInterval(moveing);
  stop = true;
  //ハイスコア記録
  if (totalscore <= hiscore) {
    localStorage.score = hiscore;
    totalscore = hiscore;
  }
  tweet();
  form();
}

//リスタート処理
let moveing = 0;
function restart() {
  totalscore = Number(localStorage.getItem('score'));
  ctx0.clearRect(0, 0, 400, 400);
  ctx0.font = "18px sans-serif";
  ctx0.fillText("high score:" + totalscore, 50, 30);
  y = 220;
  n = 0;
  obs = [400, 400, 400];
  lastgo = 0;
  jumpAble = true;
  hiscore = 0;
  tweetDivided.innerHTML = '';
  PostDivided.innerHTML = '';
  function moveng() {
    moveing = setInterval(move, 1000 / 30);
  }
  moveng();
  step();
}

//ハイスコア
let totalscore = 0;
function getup() {
  localStorage.setItem('score', 0);
  totalscore = Number(localStorage.getItem('score'));
}
function setup() {
  totalscore = Number(localStorage.getItem('score'));
}
if (!localStorage.getItem('score')) {
  //ストレージなし
  getup();
} else {
  //ストレージあり
  setup();
}

//ツイートボタン
const tweetDivided = document.getElementById('tweet-area');
function tweet() {
  while (tweetDivided.firstChild) {
    tweetDivided.removeChild(tweetDivided.firstChild);
  }
  let way = hiscore / 10;
  let coment = 0;
  if (hiscore >= 5000) {
    coment = '「ミトちゃんしっぷうになってたわ」';
  } else if (hiscore >= 4000) {
    coment = '「ミトちゃんはほんまにすごいなぁ」';
  } else if (hiscore >= 3000) {
    coment = '「ミトちゃんかぜになってたわ」';
  } else if (hiscore >= 2000) {
    coment = '「ミトちゃんはすごいなぁ」';
  } else if (hiscore >= 1000) {
    coment = '「ええきもちや」';
  } else if (hiscore >= 500) {
    coment = '「なんやこのじゃまなん」';
  } else {
    coment = '「ミトちゃんあっちになんかある！」';
  }
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('カエデログ') + '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('herf', hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text', 'ミトとカエデは' + way + 'メートルを走り抜けました！　' + coment + '　#ミトダッシュ');
  anchor.setAttribute('data-size', "large");
  anchor.setAttribute('data-url', "https://concourse008.github.io/mitodash/index.html");
  anchor.innerText = 'Tweet #カエデログ';
  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}

//スコア送信フォーム
const PostDivided = document.getElementById('post-area');
function form() {
  let form = document.createElement('input');
  form.type = 'text';
  form.name = 'name';
  form.id = 'name';
  form.placeholder = '名前を入力';
  let score = document.createElement('input');
  score.type = 'hidden';
  score.name = 'score';
  score.placeholder = 'score';
  score.value = hiscore;
  let button = document.createElement('input');
  button.type = 'button';
  button.value = '送信';
  button.onclick = postbutton;  //onclickには関数を設定する
  PostDivided.appendChild(form);
  PostDivided.appendChild(score);
  PostDivided.appendChild(button);
}
const xhr = new XMLHttpRequest();
const postbutton = function () {
  let name = document.getElementById('name');
  let allDatas = "name=" + name.value + "&score=" + hiscore;
//  var data=new FormData();
//  data.append("value", allDatas);
  xhr.open("POST", 'https://young-hollows-52834.herokuapp.com/', true);//ここの二つ目が送信先
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  console.log(xhr);
  xhr.send(allDatas);
  PostDivided.innerHTML = '<p> 送信完了！</p>';
}
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    let hoge = name.value || '名無し';
    console.log("ok");
    //エラーを出さなかった時の処理
  } else {
    let hoge = name.value || '名無し';
    console.log("err");
  }
}
function EncodeHTMLForm( data )
{
    var params = [];

    for( var name in data )
    {
        var value = data[ name ];
        var param = encodeURIComponent( name ) + '=' + encodeURIComponent( value );

        params.push( param );
    }

    return params.join( '&' ).replace( /%20/g, '+' );
}