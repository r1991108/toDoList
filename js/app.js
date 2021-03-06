let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click", (e) => {
  //フォームの提出を抑止する
  e.preventDefault();
  //input内容を取得する
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;
  //input内容をチェック
  {
    let isAnyInvalid = false;
    for (let i = 0; i < form.children.length - 1; i++) {
      form.children[i].style.backgroundColor = "";
      form.children[i].style.border = "";
      console.log(form.children[i].value);
      if (form.children[i].value === "") {
        console.log(`No. ${i} is invalid"`);
        form.children[i].style.backgroundColor = "rgb(255, 218, 219)";
        form.children[i].style.border = "2px solid red";
        isAnyInvalid = true;
        //月不正チェック
      } else {
        form.children[i].style.backgroundColor = "";
        form.children[i].style.border = "";
      }
    }

    // 日付不正チェック
    let limitInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 月の不正チェック
    if (form.children[1].value > 12 || form.children[1].value < 1) {
      console.log(`input month is invalid"`);
      form.children[1].style.backgroundColor = "rgb(255, 218, 219)";
      form.children[1].style.border = "2px solid red";
      isAnyInvalid = true;
      // 日の不正チェック
    } else if (
      form.children[2].value > limitInMonth[form.children[1].value - 1] ||
      form.children[2].value < 1
    ) {
      console.log(`input date is invalid"`);
      form.children[2].style.backgroundColor = "rgb(255, 218, 219)";
      form.children[2].style.border = "2px solid red";
      isAnyInvalid = true;
    }

    if (isAnyInvalid) {
      return;
    }
  }

  //todo elementを新しく作る
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("div");
  text.classList.add("todo-text");
  text.innerText = todoText;

  // text展開用
  text.addEventListener("click", (e) => {
    // console.log("onclick");
    if (text.style.width === "90vw") {
      todo.style.flexWrap = "";
      text.style.width = "";
      text.style.maxWidth = "";
      text.style.overflow = "";
      text.style.overflowWrap = "";
      text.style.whiteSpace = "";
    } else {
      todo.style.flexWrap = "wrap";
      text.style.width = "90vw";
      text.style.maxWidth = "90vw";
      text.style.overflow = "visible";
      text.style.overflowWrap = "break-word";
      text.style.whiteSpace = "break-spaces";
    }
  });

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;

  todo.appendChild(text);
  todo.appendChild(time);
  section.appendChild(todo);

  //チェックボタン、ゴミ箱ボタンを追加
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.addEventListener("click", (e) => {
    console.log("completeButon is been clicked");
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  trashButton.addEventListener("click", (e) => {
    console.log("trashButon is been clicked");
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      // localstorageからデータを削除
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText === text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove(); // todoItemを削除するイベントをanimationが終わった後にするよう設定
      let myList = localStorage.getItem("list");
      if (myList === "[]") {
        console.log("listがなくなった");
        let sortButton = document.querySelector(".sort button");
        sortButton.innerText = "Todoリストがない";
      }
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  section.appendChild(todo);

  //表示するまで見た目の変化を設定
  todo.style.animation = "scaleUp 0.3s forwards";

  //myTodo objectを作成
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // データを配列に保存する
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(localStorage.getItem("list")));

  // inputを初期化
  for (let i = 0; i < form.children.length - 1; i++) {
    form.children[i].value = "";
  }

  let sortButton = document.querySelector(".sort button");
  sortButton.innerText = "日付でソート";

  //   console.log(todoText + " " + todoMonth + " " + todoDate);
});

// localStorageからデータをロードする
loadData();
// localStorageからデータをロードする関数
function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== "[]") {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      //todoを作成
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("div");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      // text展開用
      text.addEventListener("click", (e) => {
        // console.log("onclick");
        if (text.style.width === "90vw") {
          todo.style.flexWrap = "";
          text.style.width = "";
          text.style.maxWidth = "";
          text.style.overflow = "";
          text.style.overflowWrap = "";
          text.style.whiteSpace = "";
        } else {
          todo.style.flexWrap = "wrap";
          text.style.width = "90vw";
          text.style.maxWidth = "90vw";
          text.style.overflow = "visible";
          text.style.overflowWrap = "break-word";
          text.style.whiteSpace = "break-spaces";
        }
      });
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      //チェックボタン、ゴミ箱ボタンを追加
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fas fa-check"></i>';
      completeButton.addEventListener("click", (e) => {
        console.log("completeButon is been clicked");
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
      trashButton.addEventListener("click", (e) => {
        console.log("trashButon is been clicked");
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          // localstorageからデータを削除
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText === text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove(); // todoItemを削除するイベントをanimationが終わった後にするよう設定
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  } else {
    let sortButton = document.querySelector(".sort button");
    console.log("listが存在しない");
    sortButton.innerText = "まだ何もない";
  }
}

// merge sortでリストをソートする
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // データをソートする
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // リストからtodoリストを削除する
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // localStorageからデータをロードする
  loadData();
});
