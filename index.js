document.querySelector(".hit").style.display = "none";
document.querySelector(".miss").style.display = "none";
let speed;
let countStr = 0; //入力した文字数
let countWord = 0; //入力したワード数
let countMiss = 0; //ミスをした回数
let nextstr = "A"; //次に入力する文字
let r = 0; //次に入力する文字の番号
let limitTime; //1回の練習時間
let startFlg = false; //練習開始か
let order = true; //順番かランダムか
let keys; //入力する候補のキーリスト
let keysorg; //入力する候補のキーリストのオリジナル
let countdown;
let countup;
let total = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
]; //全ての練習記録を残しておく2重配列

let tmpWord = ""; //一時的に入れておくワード用の変数
let wordlist = mondailist[4];
let tmpList = [...wordlist];
let endWord = ""; //入力後の文字を残しておく変数
let buf = ""; //入力中の文字を残しておく変数
let preWord = ""; //入力前の文字を残しておく変数

//ローマ字カナ対応表を1つの1次元配列で作り、それを2つの配列に分離している。
//これはのちのにデータの管理がやりやすくするため
kana = [];
roma = [];
str = "";
for (i = 0, j = 0; i < kanaroma.length; i += 2, j++) {
  kana[j] = kanaroma[i];
  roma[j] = kanaroma[i + 1];
}

function mondaiadd(text, value) {
  // コンボボックスへの参照を取得
  const comboBox = document.getElementById("mondainoselect");

  // 新しいオプションを作成
  const option = document.createElement("option");
  option.text = text; // オプションのテキスト
  option.value = value; // オプションの値

  // オプションをコンボボックスに追加
  comboBox.add(option, null);
}
for (i = 0; i < mondailist.length; i++) {
  mondaiadd(mondailist[i][0], i);
}

//これから入力する模範解答のローマ字を算出する関数
function preInputView(word) {
  preWord = "";
  tmp = word;
  while (tmp.length > 0) {
    for (i = 0; i < kana.length; i++) {
      if ("っ" + kana[i] == tmp.slice(0, kana[i].length + 1)) {
        preWord += roma[i].slice(0, 1) + roma[i];
        tmp = tmp.slice(kana[i].length + 1);
        break;
      } else if (kana[i] == tmp.slice(0, kana[i].length)) {
        preWord += roma[i];
        tmp = tmp.slice(kana[i].length);
        break;
      }
    }
  }
  document.querySelector(".inputBefore").textContent = preWord;
}

//レッスン終了処理------------------------------------------------------------
function lessonStop() {
  buf = "";
  document.querySelector(".inputAfter").textContent = buf;
  document.querySelector(".inputBefore").textContent = buf;
  document.querySelector(".hit").style.display = "none";
  document.querySelector(".miss").style.display = "none";
  startFlg = false;

  spaceElement = document.querySelector(".space");
  spaceElement.textContent = "push Start";
  spaceElement.style.backgroundColor = "yellow";
  document.querySelector(".msg").textContent = "";

  clearInterval(countdown);
  countdown = null;

  endWord = "";
  document.querySelector(".inputAfter").textContent = endWord;
  buf = "";
  document.querySelector(".inputBuf").textContent = buf;
  preWord = "";
  document.querySelector(".inputBefore").textContent = preWord;
}
//ヒット処理。黄色いキー表示-------------------------------------------
function changeColor(key) {
  keyCode = key.charCodeAt(0);
  var element = document.querySelector(".k" + keyCode);
  myX = element.getBoundingClientRect().left;
  myY = element.getBoundingClientRect().top;

  element = document.querySelector(".hit");
  element.style.left = myX - 470 + "px";
  element.style.top = myY - 18 + "px";
  element.textContent = String.fromCharCode(keyCode);
  document.querySelector(".hit").style.display = "block";
}
//ミス処理。赤いキー表示-----------------------------------------------
function missColor(key) {
  keyCode = key.charCodeAt(0);
  var element = document.querySelector(".k" + keyCode);
  myX = element.getBoundingClientRect().left;
  myY = element.getBoundingClientRect().top;

  element = document.querySelector(".miss");
  element.style.left = myX - 470 + "px";
  element.style.top = myY - 18 + "px";
  element.textContent = String.fromCharCode(keyCode);
  document.querySelector(".miss").style.display = "block";
}
//次のワードを表示
function NextWordView() {
  //登録順に表示
  if (order) {
    tmpWord = tmpList[r];
    document.querySelector(".msg").textContent = tmpWord;
    r++;
    if (r >= tmpList.length) {
      r = 0;
    }
  }
  //ランダムで表示
  else {
    r = Math.floor(Math.random() * tmpList.length);
    tmpWord = tmpList[r];
    tmpList.splice(r, 1);

    if (tmpList.length <= 0) {
      tmpList = [...mondailist[lessonNo]];
      tmpList = tmpList.slice(1); //先頭の文字列はタイトルなので必ず削除
    }
    document.querySelector(".msg").textContent = tmpWord;
  }
  endWord = "";
  document.querySelector(".inputAfter").textContent = endWord;
  buf = "";
  document.querySelector(".inputBuf").textContent = buf;
  preWord = "";
  document.querySelector(".inputBefore").textContent = preWord;

  preInputView(tmpWord);

  if (preWord.length > 0) {
    changeColor(preWord.slice(0, 1));
  }
}

//レッスンスタート-----------------------------------------------------------
function lessonStart() {
  spaceElement = document.querySelector(".space");
  spaceElement.textContent = "";
  spaceElement.style.backgroundColor = "white";

  lessonNo = document.getElementById("mondainoselect").selectedIndex;

  //1回の練習時間を決定
  limitTime = document.getElementById("selectTime").value;

  //登録順かランダムか（value値が文字列なので
  order = document.getElementById("selectOrder").value === "true";

  countStr = 0;
  countWord = 0;
  document.querySelector(".score2").textContent = `${countStr} 文字`;
  document.querySelector(".score3").textContent = `${countWord} ワード`;

  r = 0;
  startFlg = true;

  tmpList = [...mondailist[lessonNo]];
  tmpList = tmpList.slice(1); //先頭の文字列はタイトルなので必ず削除

  NextWordView();
  nextstr = tmpWord.slice(0, 1);
  // changeColor(nextstr);

  //nullだったら実行されて、（つまり、あったらの反対なら実行）
  if (!countdown) {
    let seconds = limitTime;
    let count = 0;
    document.querySelector(".score5").textContent = `${seconds} 秒`;

    countdown = setInterval(function () {
      seconds--;
      count++;
      document.querySelector(".score1").textContent = `${
        Math.floor((600 * countStr) / count) / 10
      } 文字/分`;
      document.querySelector(".score5").textContent = `${seconds} 秒`;

      //練習時間が終了したら------------------------------
      if (seconds <= 0) {
        lessonStop();

        no = lessonNo;

        total[no][total[no].length] = Math.floor((600 * countStr) / count) / 10;

        for (j = 0; j < 10; j++) {
          for (i = 0; i < total[no].length; i++) {
            if (total[no][i] < total[no][j]) {
              [total[no][i], total[no][j]] = [total[no][j], total[no][i]];
            }
          }
        }
        if (no <= 9) {
          str = "";
          for (i = 0; i < Math.min(total[no].length, 5); i++) {
            str += `${i + 1}: ${total[no][i]} <span>文字/分</span><br>`;
          }
          document.querySelector(".total" + no).innerHTML = str;
          titleStr = [
            "FGJH",
            "順番",
            "1段目",
            "2段目",
            "3段目",
            "数字",
            "記号",
            "記号のみ",
            "A-Z",
            "単語",
          ];
          document.querySelector(
            ".title" + no
          ).innerHTML = `${titleStr[no]}(${total[no].length})`;
        }
      }
    }, 1000);
  }
}
spaceElement = document.querySelector(".space");
spaceElement.textContent = "push start";
spaceElement.style.backgroundColor = "yellow";

//---------------------------------------------------------------------
// キー入力を監視するためのイベントリスナーを追加
document.addEventListener("keydown", function (event) {
  let asciiCode = event.key.charCodeAt(0);
  // document.querySelector(".msg1").innerHTML = `【nextstr】${nextstr}<br>【asciiCode】${asciiCode}<br>【event.key】${event.key}<br>【event.code】${event.code}`;
  if (event.key === "Tab") {
    event.preventDefault(); // Tabキーのデフォルト動作を無効にする
  } else if (startFlg) {
    //エスケイプキーを押した時の処理----------------------------------------
    if (event.key == "Escape" && event.code == "Escape") {
      lessonStop();
    }
    // 全角半角キーを押した場合の処理---------------------------------------
    else if (event.code === "Backquote") {
    }
    //CapsLockキーを押した場合の処理----------------------------------------
    else if (event.key == "Alphanumeric" && event.code == "CapsLock") {
    }
    //シフトキーを押した時の処理
    else if (event.shiftKey && asciiCode == 83) {
    }
    //コントロールキーを押した場合の処理------------------------------------
    else if (event.ctrlKey) {
    }
    //バックスペースキーを押した時の処理------------------------------------
    else if (event.key == "Backspace" && event.code == "Backspace") {
      buf = buf.slice(0, -1);
      document.querySelector(".inputBuf").textContent = buf;
    }
    //エンターキーを押した場合の処理-----------------------------------------
    else if (event.code === "Enter") {
    }
    //それ以外のキーを押した場合の処理----------------------------------------
    else {
      inputStr = String.fromCharCode(asciiCode).toUpperCase();
      questStr = tmpWord.slice(0, 1);

      buf += inputStr;
      document.querySelector(".inputBuf").textContent = buf;

      if (buf.slice(-1) == preWord.slice(0, 1)) {
        preWord = preWord.slice(1);
        document.querySelector(".inputBefore").textContent = preWord;
        if (preWord.length > 0) {
          changeColor(preWord.slice(0, 1));
        }
      }

      flag = false;
      for (i = 0; i < kana.length; i++) {
        //通常のローマ字判定
        if (kana[i] == tmpWord.slice(0, kana[i].length) && roma[i] == buf) {
          tmpWord = tmpWord.slice(kana[i].length);
          document.querySelector(".msg").textContent = tmpWord;
          countStr += kana[i].length;

          flag = true;
          break;
        }
        //促音「っ」がある時のローマ字判定
        else if (
          "っ" + kana[i] == tmpWord.slice(0, kana[i].length + 1) &&
          roma[i][0] + roma[i] == buf
        ) {
          tmpWord = tmpWord.slice(kana[i].length + 1);
          document.querySelector(".msg").textContent = tmpWord;
          countStr += kana[i].length + 1;

          flag = true;
          break;
        }
      }

      if (flag == true) {
        endWord += buf;
        document.querySelector(".inputAfter").textContent = endWord;

        buf = "";
        document.querySelector(".inputBuf").textContent = buf;
        document.querySelector(".score2").textContent = `${countStr} 文字`;

        if (tmpWord.length == 0) {
          countWord++;
          document.querySelector(".score3").textContent = `${countWord} ワード`;
          NextWordView();
        }
        preInputView(tmpWord);
      }
    }
  } else {
    //スペースキーを押して練習開始
    if (asciiCode == 32) {
      lessonStart();
    }
  }
});

// コンボボックスからフォーカスを外す--------------------------------------------------------------------
document.getElementById("selectTime").addEventListener("change", function () {
  document.getElementById("selectTime").blur();
});
document.getElementById("selectOrder").addEventListener("change", function () {
  document.getElementById("selectOrder").blur();
});
document
  .getElementById("mondainoselect")
  .addEventListener("change", function () {
    document.getElementById("mondainoselect").blur();
  });
