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
const cardWidth = 200;
const cardHeight = 120;

function render() {
  dragCont.innerHTML = "";
  dragCont.style.width = cardWidth * colNum + 40 + "px";
  dragCont.style.height =
    computeTop(imageList.length) + cardHeight - 10 + "px";
  imageList.forEach((item, index) => {
    renderImage(item, index);
  });
}

let mousedownTimer = null;
let selectDom = null;

// 开始拖动
function touchStart(selectId, event) {
  if (mousedownTimer) {
    return false;
  }
  let DectetTimer = null;

  //记录鼠标移动的距离
  let moveTop = 0;
  let moveLeft = 0;
  //起始组件位置
  let OriginObjPosition = {
    left: 0,
    top: 0,
    originNum: -1,
  };
  // 起始鼠标信息
  let OriginMousePosition = {
    x: 0,
    y: 0,
  };
  // 记录交换位置的号码
  let OldPositon = null;
  let NewPositon = null;
  // 选中的卡片的dom和数据
  selectDom = document.getElementById("item-" + selectId);
  let selectMenuData = imageList.find((item) => {
    return item.id === selectId;
  });

  OriginMousePosition.x = event.screenX;
  OriginMousePosition.y = event.screenY;

  selectDom.classList.add("d_moveBox");

  moveLeft = OriginObjPosition.left = parseInt(
    selectDom.style.left.slice(0, selectDom.style.left.length - 2)
  );
  moveTop = OriginObjPosition.top = parseInt(
    selectDom.style.top.slice(0, selectDom.style.top.length - 2)
  );

  document.addEventListener("mousemove", mouseMoveListener);
  document.addEventListener("mouseup", mouseUpListener);

  // 拖拽中
  function mouseMoveListener(event) {
    moveTop = OriginObjPosition.top + (event.screenY - OriginMousePosition.y);
    moveLeft = OriginObjPosition.left + (event.screenX - OriginMousePosition.x);
    selectDom.style.left = moveLeft + "px";
    selectDom.style.top = moveTop + "px"; //这里要加上滚动的高度

    if (!DectetTimer) {
      DectetTimer = setTimeout(() => {
        cardDetect(moveTop, moveLeft);
        DectetTimer = null;
      }, 200);
    }
  }
  // 卡片检测
  function cardDetect(moveItemTop, moveItemLeft) {
    //计算当前移动卡片，可以覆盖的号码位置
    let newWidthNum = Math.round(moveItemLeft / cardWidth) + 1;
    let newHeightNum = Math.round(moveItemTop / cardHeight);

    if (
      newHeightNum > Math.ceil(imageList.length / colNum) - 1 ||
      newHeightNum < 0 ||
      newWidthNum <= 0 ||
      newWidthNum > colNum
    ) {
      return false;
    }

    const newPositionNum = newWidthNum + newHeightNum * colNum;
    if (newPositionNum !== selectMenuData.positionNum) {
      let newItem = imageList.find((item) => {
        return item.positionNum === newPositionNum;
      });
      if (newItem) {
        switchPosition(newItem, selectMenuData);
      }
    }
  }

  // 交换位置
  function switchPosition(newItem, originItem) {
    OldPositon = originItem.positionNum;
    NewPositon = newItem.positionNum;

    //位置号码从小移动到大
    if (NewPositon > OldPositon) {
      let changeArray = [];
      //从小移动到大，那小的号码就会空出来，其余卡片应往前移动一位
      //找出两个号码中间对应的卡片数据
      for (let i = OldPositon + 1; i <= NewPositon; i++) {
        let pushData = imageList.find((item) => {
          return item.positionNum === i;
        });
        changeArray.push(pushData);
      }

      for (let item of changeArray) {
        item.positionNum = item.positionNum - 1;
        document.querySelector("#item-" + item.id).style.top =
          computeTop(item.positionNum) + "px";
        document.querySelector("#item-" + item.id).style.left =
          computeLeft(item.positionNum) + "px";
      }
      originItem.positionNum = NewPositon;
    }

    //位置号码从大移动到小
    if (NewPositon < OldPositon) {
      let changeArray = [];
      //从大移动到小，那大的号码就会空出来，其余卡片应往后移动一位
      //找出两个号码中间对应的卡片数据
      for (let i = OldPositon - 1; i >= NewPositon; i--) {
        let pushData = imageList.find((item) => {
          return item.positionNum === i;
        });
        changeArray.push(pushData);
      }

      for (let item of changeArray) {
        item.positionNum = item.positionNum + 1;
        document.querySelector("#item-" + item.id).style.top =
          computeTop(item.positionNum) + "px";
        document.querySelector("#item-" + item.id).style.left =
          computeLeft(item.positionNum) + "px";
      }
      originItem.positionNum = NewPositon;
    }
  }

  // 鼠标松开
  function mouseUpListener() {
    //取消位于交换队列的检测事件、对位置进行最后一次检测
    clearTimeout(DectetTimer);
    DectetTimer = null;
    cardDetect(moveTop, moveLeft);

    selectDom.classList.add("d_transition");
    selectDom.style.top = computeTop(selectMenuData.positionNum) + "px";
    selectDom.style.left = computeLeft(selectMenuData.positionNum) + "px";

    mousedownTimer = setTimeout(() => {
      selectDom.classList.remove("d_transition");
      selectDom.classList.remove("d_moveBox");
      clearTimeout(mousedownTimer);
      mousedownTimer = null;
      selectDom = null;
    }, 300);

    document.removeEventListener("mousemove", mouseMoveListener);
    document.removeEventListener("mouseup", mouseUpListener);
  }
}

function renderImage(item, index) {
  const imgItem = document.createElement("div");
  imgItem.className = "box-item";
  imgItem.id = "item-" + item.id;
  imgItem.style.backgroundImage = `url('./images/${item.id}.png')`;
  imgItem.style.width = `${cardWidth}px`;
  imgItem.style.height = `${cardHeight}px`;
  imgItem.style.top = `${computeTop(index + 1)}px`;
  imgItem.style.left = `${computeLeft(index + 1)}px`;
  imgItem.onmousedown = touchStart.bind(this, item.id);
  dragCont.appendChild(imgItem);
}

function computeLeft(num) {
  //left为（位置号码-1)%列数*卡片外围宽度
  return (
    ((num - 1) % colNum) * cardWidth + 10 + ((num - 1) % colNum) * 20
  );
}

function computeTop(num) {
  //top为（位置号码/列数）向上取整，减去1，再乘以卡片外围高度
  return (
    (Math.ceil(num / colNum) - 1) * cardHeight +
    10 +
    (Math.ceil(num / colNum) - 1) * 20
  );
}

render();
