const text = document.getElementById("text");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("delete");
const list = document.getElementById("content");
const itemNum = document.getElementById("itemNum");
let data = JSON.parse(localStorage.getItem("todos")) || [];
let tabState = "all";
updateList();
function renderData(data) {
  const str = data.reduce((accumulator, item, index) => {
    return (
      accumulator +
      ` <li data-id="${item.id}" data-index="${index}">
                <label  class="content__checkboxBar" for="smallbox${item.id}">
                    <input type="checkbox" class="content__checkbox" id="smallbox${
                      item.id
                    }" ${item.checked ? "checked" : ""} data-num="${index}"/>
                    <p   class="content__text">${item.text} </p>
                    <button class="content__delete"  data-num="${index}" >x</button>
                </label>
            </li>`
    );
  }, "");
  list.innerHTML = str;
}

//新增
addButton.addEventListener("click", addItem);
function addItem(e) {
  if (text.value === "") {
    e.preventDefault();
    alert("잠깐만요!!!請輸入你的待辦事項");
    return;
  }
  const obj = {
    text: text.value,
    id: Date.now(),
    checked: false,
  };
  data.push(obj);
  text.value = "";
  updateList();
  saveToLocalStorage();
}
text.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItem(e);
  }
});

// 刪除和切換狀態
list.addEventListener("click", deleteItem);
function deleteItem(e) {
  const li = e.target.closest("li");
  const id = li ? li.dataset.id : null;
  const num = e.target.dataset.num;

  if (e.target.classList.contains("content__delete")) {
    e.preventDefault();
    if (confirm("您確定要刪除代辦嗎?")) {
      data.splice(num, 1);
      updateList();
      saveToLocalStorage();
    }
  } else if (e.target.getAttribute("type") === "checkbox") {
    data.forEach((item) => {
      if (item.id == id) {
        item.checked = !item.checked;
      }
    });
    updateList();
    saveToLocalStorage();
  } else {
    return;
  }
}

const tab = document.getElementById("tab");
tab.addEventListener("click", function (e) {
  const nowTab = e.target.closest("p");
  if (!nowTab) return;
  tabState = nowTab.getAttribute("id");
  const tabs = document.querySelectorAll("#tab p");
  tabs.forEach((i) => i.classList.remove("action"));
  e.target.classList.add("action");
  updateList();
  saveToLocalStorage();
});

function updateList() {
  let newData = [];
  if (tabState === "all") {
    newData = data;
  } else if (tabState === "next") {
    newData = data.filter((item) => !item.checked);
  } else if (tabState === "done") {
    newData = data.filter((item) => item.checked);
  }

  renderData(newData);
  const num = newData.length;
  itemNum.textContent = `總共有${num}個項目`;
  if (num === 0) {
    list.innerHTML = `<p class="message">目前沒有資料</p>`;
  }
}

const allDelete = document.getElementById("allDelete");
allDelete.addEventListener("click", function (e) {
  e.preventDefault();
  data = data.filter((item) => !item.checked);
  updateList();
  saveToLocalStorage();
});
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(data));
}
