const imageList = [
  {
    id: 1,
    positionNum: 1,
  },
  {
    id: 2,
    positionNum: 2,
  },
  {
    id: 3,
    positionNum: 3,
  },
  {
    id: 4,
    positionNum: 4,
  },
  {
    id: 5,
    positionNum: 5,
  },
  {
    id: 6,
    positionNum: 6,
  },
  {
    id: 7,
    positionNum: 7,
  },
  {
    id: 8,
    positionNum: 8,
  },
  {
    id: 9,
    positionNum: 9,
  },
];

const dragCont = document.getElementById("dragCont");
const colNum = 3;
const cardOutsideWidth = 200;
const cardOutsideHeight = 120;
let originItem = 0;
let targetItem = 0;
let switchTimer = null;
let selectDom;

// 渲染页面
function render() {
  dragCont.innerHTML = "";
  dragCont.style.width = cardOutsideWidth * colNum + 40 + "px";
  dragCont.style.height =
    computeTop(imageList.length) + cardOutsideHeight - 10 + "px";
  imageList.forEach((item, index) => {
    renderImage(item, index);
  });
}

// 更新样式
function reRender() {
  imageList.forEach((item) => {
    document.querySelector("#item-" + item.id).style.top =
      computeTop(item.positionNum) + "px";
    document.querySelector("#item-" + item.id).style.left =
      computeLeft(item.positionNum) + "px";
  });
}
// 交换卡片
function switchPosition(newItem, originItem) {
  oldPosition = originItem.positionNum;
  newPosition = newItem.positionNum;
  //位置号码从小移动到大
  if (newPosition > oldPosition) {
    let changeArray = [];
    //从小移动到大，那小的号码就会空出来，其余卡片应往前移动一位
    //找出两个号码中间对应的卡片数据
    for (let i = oldPosition + 1; i <= newPosition; i++) {
      let pushData = imageList.find((item) => {
        return item.positionNum === i;
      });
      changeArray.push(pushData);
    }

    for (let item of changeArray) {
      // item.positionNum = item.positionNum - 1;
      imageList[item.id - 1].positionNum =
        imageList[item.id - 1].positionNum - 1;
      document.querySelector("#item-" + item.id).style.top =
        computeTop(item.positionNum) + "px";
      document.querySelector("#item-" + item.id).style.left =
        computeLeft(item.positionNum) + "px";
    }
  }

  //位置号码从大移动到小
  if (newPosition < oldPosition) {
    let changeArray = [];
    //从大移动到小，那大的号码就会空出来，其余卡片应往后移动一位
    //找出两个号码中间对应的卡片数据
    for (let i = oldPosition - 1; i >= newPosition; i--) {
      let pushData = imageList.find((item) => {
        return item.positionNum === i;
      });
      changeArray.push(pushData);
    }

    for (let item of changeArray) {
      imageList[item.id - 1].positionNum =
        imageList[item.id - 1].positionNum + 1;
      document.querySelector("#item-" + item.id).style.top =
        computeTop(item.positionNum) + "px";
      document.querySelector("#item-" + item.id).style.left =
        computeLeft(item.positionNum) + "px";
    }
  }
  originItem.positionNum = newPosition;
}

function dragStart(selectItem, event) {
  // 记录交换位置的号码
  originItem = selectItem;
  selectDom = document.querySelector("#item-" + originItem.id);
  selectDom.style.opacity = 0;
}

function dragEnter(newItem, event) {
  if (switchTimer) {
    clearTimeout(switchTimer);
    switchTimer = null;
  }
  switchTimer = setTimeout(() => {
    switchPosition(newItem, originItem);
    targetItem = newItem;
  }, 100);
}

function dragEnd() {
  // 拖拽结束
  selectDom.style.transition = "none";
  selectDom.style.opacity = 100;
  setTimeout(() => {
    selectDom.style.transition = "all 0.3s";
  }, 100);
  reRender();
}

function renderImage(item, index) {
  const imgItem = document.createElement("div");
  imgItem.className = "box-item";
  imgItem.id = "item-" + item.id;
  imgItem.style.backgroundImage = `url('./images/${item.id}.png')`;
  imgItem.style.width = `${cardOutsideWidth}px`;
  imgItem.style.height = `${cardOutsideHeight}px`;
  imgItem.style.top = `${computeTop(index + 1)}px`;
  imgItem.style.left = `${computeLeft(index + 1)}px`;
  imgItem.draggable = true;
  imgItem.ondragstart = dragStart.bind(this, item);
  imgItem.ondragenter = dragEnter.bind(this, item);
  imgItem.ondragend = dragEnd;
  dragCont.appendChild(imgItem);
}

function computeLeft(num) {
  //left为（位置号码-1)%列数*卡片外围宽度
  return (
    ((num - 1) % colNum) * cardOutsideWidth + 10 + ((num - 1) % colNum) * 20
  );
}

function computeTop(num) {
  //top为（位置号码/列数）向上取整，减去1，再乘以卡片外围高度
  return (
    (Math.ceil(num / colNum) - 1) * cardOutsideHeight +
    10 +
    (Math.ceil(num / colNum) - 1) * 20
  );
}

render();
