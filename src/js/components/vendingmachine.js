class VendingMachine {
  constructor() {
    const vMachine = document.querySelector(".vending-wrap");
    this.itemList = vMachine.querySelector(".list-item");
    this.changes = vMachine.querySelector(".change-txt");
    this.inputCost = vMachine.querySelector(".input-money");
    this.btnPut = vMachine.querySelector(".btn-put");
    this.btnReturn = vMachine.querySelector(".btn-return");
    this.btnGet = vMachine.querySelector(".btn-get");
    this.basketList = vMachine.querySelector(".list-item-select");

    const myInfo = document.querySelector(".info-wrap");
    this.myMoney = myInfo.querySelector(".txt-money");
    this.gotList = myInfo.querySelector(".list-item-select");
    this.totalPrice = myInfo.querySelector(".txt-total");
  }

  setup() {
    this.addEvent();
  }

  // 선택한 햄버거 목록 생성
  basketItemGenerator(target) {
    const basketItem = document.createElement("li");
    basketItem.dataset.item = target.dataset.item;
    basketItem.dataset.cost = target.dataset.cost;
    basketItem.innerHTML = `
    <button class="btn-select" type=button>
    <img src="src/img/${target.dataset.img}" alt="" class="img-item">
    <strong class="txt-item">${target.dataset.item}</strong>
    <span class="count-num">1</span>
    </button>
    `;
    this.basketList.appendChild(basketItem);
  }

  //이벤트 활성화
  addEvent() {
    // 1. 입금 기능
    this.btnPut.addEventListener("click", (event) => {
      const inputCost = parseInt(this.inputCost.value);
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));
      const changesVal = parseInt(this.changes.textContent.replaceAll(",", ""));

      if (inputCost) {
        if (inputCost <= myMoneyVal && inputCost > 0) {
          this.myMoney.textContent =
            new Intl.NumberFormat().format(myMoneyVal - inputCost) + "원";
          this.changes.textContent =
            new Intl.NumberFormat().format(
              (changesVal ? changesVal : 0) + inputCost
            ) + "원";
        } else {
          alert("소지금이 부족합니다");
        }
        this.inputCost.value = null;
      }
    });

    // 2. 거스름돈 반환 버튼 기능
    this.btnReturn.addEventListener("click", () => {
      const changesVal = parseInt(this.changes.textContent.replaceAll(",", ""));
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));

      if (changesVal) {
        this.myMoney.textContent =
          new Intl.NumberFormat().format(changesVal + myMoneyVal) + "원";
        this.changes.textContent = "원";
      }
    });

    // 3. 자판기 메뉴 기능
    const btnHambuger = this.itemList.querySelectorAll("button");

    btnHambuger.forEach((item) => {
      item.addEventListener("click", (event) => {
        const targetEl = event.currentTarget;
        const changesVal = parseInt(
          this.changes.textContent.replaceAll(",", "")
        );
        let isStaged = false;
        const targetElPrice = parseInt(targetEl.dataset.cost);
        const basketItem = this.basketList.querySelectorAll("li");

        // 입금된 금액이 아이템 값보다 많거나 같을 경우
        if (changesVal >= targetElPrice) {
          this.changes.textContent =
            new Intl.NumberFormat().format(changesVal - targetElPrice) + "원";

          //클릭한 아이템이 이미 선택한 아이템인지 탐색
          for (const item of basketItem) {
            //  내가 클릭한 아이템과 장바구니에 담은 아이템이 같을 경우
            if (item.dataset.item === targetEl.dataset.item) {
              item.querySelector(".count-num").textContent++;
              isStaged = true;
              break;
            }
          }

          // 해당 아이템을 처음 선택했을 경우
          if (!isStaged) {
            this.basketItemGenerator(targetEl);
          }

          // 아이템의 수량을 줄임
          targetEl.dataset.count--;

          //아이템 수량이 모두 소진되면 품절 표시
          if (parseInt(targetEl.dataset.count) === 0) {
            targetEl.parentElement.classList.add("sold-out");
            const warning = document.creatElement("em");
            warning.textContent = "해당 상품은 품절입니다.";
            warning.classList.add("ir");
            // em 요소를 버튼 요소의 앞에 배치 -> 스크린리더가 먼저 읽도록
            targetEl.parentElement.insertBefore(warning, targetEl);
          }
        } else {
          alert("잔액이 부족합니다. 돈을 입금해주세요.");
        }
      });
    });

    // 4. 획득 버튼 기능
    this.btnGet.addEventListener("click", () => {
      let isGot = false;
      let total = 0;

      for (const basketItem of this.basketList.querySelectorAll("li")) {
        isGot = false;
        for (const gotItem of this.gotList.querySelectorAll("li")) {
          let gotItemCount = gotItem.querySelector(".count-num");

          //구매한 아이템이 이미 구매한 이이템 리스트에 존재하는지 확인
          if (basketItem.dataset.item === gotItem.dataset.item) {
            gotItemCount.textContent =
              parseInt(gotItemCount.textContent) +
              parseInt(basketItem.querySelector(".count-num").textContent);
            isGot = true;
            break;
          }
          // 처음 획득하는 음료수라면
        }
        if (!isGot) {
          this.gotList.appendChild(basketItem);
        }
      }

      // 장바구니 목록 초기화
      this.basketList.innerHTML = null;

      // 구매한 아이템 리스트 순환하며 총 금액 계산
      this.gotList.querySelectorAll("li").forEach((gotItem) => {
        let ctnItem = parseInt(gotItem.querySelector(".count-num").textContent);
        total +=
          gotItem.dataset.cost *
          parseInt(gotItem.querySelector(".count-num").textContent);
      });
      this.totalPrice.textContent = `총 금액 : ${new Intl.NumberFormat().format(
        total
      )} 원`;
    });
  }
}

export default VendingMachine;
