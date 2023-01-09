let freeCoupon = 0;
// let totalItemCount = 0;

class VendingMachine {
  constructor() {
    const vMachine = document.querySelector(".sec-vending-machine");
    this.itemList = vMachine.querySelector(".list-item");
    this.changes = vMachine.querySelector(".txt-change");
    this.inputCost = vMachine.querySelector(".inp-put");
    this.btnPut = vMachine.querySelector(".btn-put");
    this.btnReturn = vMachine.querySelector(".btn-return");
    this.btnGet = vMachine.querySelector(".btn-get");
    this.basketList = vMachine.querySelector(".list-item-select");

    const myInfo = document.querySelector(".sec-my-info");
    this.barStar = myInfo.querySelector(".bar-star");
    this.imgStar = myInfo.querySelector(".img-star");
    this.myMoney = myInfo.querySelector(".txt-mymoney");
    this.gotList = myInfo.querySelector(".list-item-select");
    this.totalPrice = myInfo.querySelector(".txt-total");

    this.modal = document.querySelector("#modal");
    this.btnClose = document.querySelector(".btn-close");

    this.myItemCount = 0;
    this.freeCnt = 0;
  }

  setup() {
    this.addEvent();
  }

  // 선택한 아이템 목록 생성
  basketItemGenerator(target) {
    const basketItem = document.createElement("li");
    basketItem.dataset.item = target.dataset.item;
    basketItem.dataset.cost = target.dataset.cost;
    basketItem.innerHTML = `
            <button class="btn-select" type="button">
                <img src="src/img/${target.dataset.img}" alt="" class="img-item">
                <strong class="txt-item">${target.dataset.item}</strong>
                <span class="count-num">1</span>
            </button>
        `;
    this.basketList.appendChild(basketItem);
  }

  // 이벤트 활성화
  addEvent() {
    // 1. 입금 버튼 기능
    this.btnPut.addEventListener("click", (event) => {
      const inpCostVal = parseInt(this.inputCost.value);
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));
      const changesVal = parseInt(this.changes.textContent.replaceAll(",", ""));

      if (inpCostVal) {
        // 입금액이 소지금보다 작고, 0보다 크다면
        if (inpCostVal <= myMoneyVal && inpCostVal > 0) {
          this.myMoney.textContent =
            new Intl.NumberFormat().format(myMoneyVal - inpCostVal) + " 원";
          this.changes.textContent =
            new Intl.NumberFormat().format(
              (changesVal ? changesVal : 0) + inpCostVal
            ) + " 원";
        } else {
          alert("소지금이 부족합니다.");
        }
        this.inputCost.value = null;
      }
    });

    // 2. 거스름돈 반환 버튼 기능
    this.btnReturn.addEventListener("click", (event) => {
      const changesVal = parseInt(this.changes.textContent.replaceAll(",", ""));
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(",", ""));

      if (changesVal) {
        this.myMoney.textContent =
          new Intl.NumberFormat().format(changesVal + myMoneyVal) + " 원";
        this.changes.textContent = "원";
      }
    });

    // 3. 자판기 메뉴 기능
    const btnsItem = this.itemList.querySelectorAll("button");

    btnsItem.forEach((item) => {
      item.addEventListener("click", (event) => {
        const targetItem = event.currentTarget;
        const changesVal = parseInt(
          this.changes.textContent.replaceAll(",", "")
        );
        const targetItemPrice = parseInt(targetItem.dataset.cost);
        const basketItem = this.basketList.querySelectorAll("li");
        let isSelect = false;

        // 입금된 금액이 아이템 값보다 많거나 같을 경우
        if (changesVal >= targetItemPrice) {
          this.changes.textContent =
            new Intl.NumberFormat().format(changesVal - targetItemPrice) +
            " 원";

          // 클릭한 아이템이 이미 선택한 아이템인지 탐색
          for (const item of basketItem) {
            // 내가 클릭한 아이템과 장바구니에 담은 아이템이 같을 경우
            if (item.dataset.item === targetItem.dataset.item) {
              item.querySelector(".count-num").textContent++;
              isSelect = true;
              break;
            }
          }

          // 해당 아이템을 처음 선택했을 경우
          if (!isSelect) {
            this.basketItemGenerator(targetItem);
          }

          // 아이템의 수량을 줄임
          targetItem.dataset.count--;

          // 아이템 수량이 모두 소진되면 품절 표시
          if (parseInt(targetItem.dataset.count) === 0) {
            targetItem.parentElement.classList.add("sold-out");
            const warning = document.createElement("em");
            warning.textContent = "해당 상품은 품절입니다.";
            warning.classList.add("ir");
            // em 요소를 버튼 요소의 앞에 배치 -> 스크린리더가 먼저 읽도록
            targetItem.parentElement.insertBefore(warning, targetItem);
          }
        } else {
          alert("잔액이 부족합니다. 돈을 입금해주세요.");
        }
      });
    });

    // 4. 획득 버튼 기능
    this.btnGet.addEventListener("click", (event) => {
      let isGot = false;
      let total = 0;

      // 별 추가를 위한 아이템 카운트
      this.basketList.querySelectorAll(".count-num").forEach((count) => {
        // totalItemCount += parseInt(count.textContent);
        this.myItemCount += parseInt(count.textContent);
      });
      console.log("myitemcount::::" + this.myItemCount);

      // 장바구니와 이미 구입한 목록 비교
      for (const basketItem of this.basketList.querySelectorAll("li")) {
        isGot = false;
        for (const gotItem of this.gotList.querySelectorAll("li")) {
          let gotItemCount = gotItem.querySelector(".count-num");

          // 구매한 아이템이 이미 구매한 아이템 리스트에 존재하는지 확인
          if (basketItem.dataset.item === gotItem.dataset.item) {
            // 구매한 아이템 리스트의 아이템 수량 업데이트
            gotItemCount.textContent =
              parseInt(gotItemCount.textContent) +
              parseInt(basketItem.querySelector(".count-num").textContent);
            isGot = true;
            break;
          }
        }
        // 처음 구매한 아이템이라면
        if (!isGot) {
          this.gotList.appendChild(basketItem);
        }
      }

      // 별 프로그래스바 설정
      this.barStar.setAttribute("value", `${this.myItemCount * 10}`);

      // 별 10개 달성시
      if (this.myItemCount >= 10) {
        this.freeCnt = Math.floor(this.myItemCount / 10);
        freeCoupon = this.freeCnt;
        this.imgStar.classList.add("star-active");
        setTimeout(() => {
          modal.style.display = "block";
          this.myItemCount -= 10 * this.freeCnt;
          this.barStar.setAttribute("value", `${this.myItemCount * 10}`);
          this.gotList.innerHTML = null;
        }, 1000);
      }

      // 장바구니 목록 초기화
      this.basketList.innerHTML = null;

      // 모달창 닫은 후 아이템 무료 적용
      this.btnClose.addEventListener("click", (event) => {
        // 모달창 닫기
        modal.style.display = "none";
        console.log("토탈쿠폰개수:" + freeCoupon);

        // 아메리카노 무료로 변경
        for (const item of this.itemList.querySelectorAll("button")) {
          if (item.dataset.item === "Americano") {
            let itemPrice = item.querySelector(".txt-price");
            item.dataset.cost = 0;
            itemPrice.textContent = "Free";
            itemPrice.classList.add("freeIcon");
            item
              .querySelector(".freeIcon")
              .setAttribute("data-freecnt", freeCoupon);

            item.addEventListener("click", (event) => {
              if (this.freeCnt !== 0) {
                item
                  .querySelector(".freeIcon")
                  .setAttribute("data-freecnt", this.freeCnt - 1);
                this.freeCnt--;
              }
              if (this.freeCnt < 0) {
                this.freeCnt = 0;
              }
              console.log("쿠폰카운트:" + this.freeCnt);
              if (this.freeCnt === 0) {
                itemPrice.classList.remove("freeIcon");
                item.dataset.cost = 4500;
                itemPrice.textContent = 4500;
              }
            });
          }
        }
      });

      // 5. 장바구니 아이템 삭제 기능
      // const basketItems = this.basketList.querySelectorAll('button');

      // basketItems.forEach((item) => {
      //     item.addEventListener('click', (event) => {
      //         const targetItem = event.currentTarget;
      //         console.log('클릭');
      //         console.log(targetItem.dataset.item);
      //     })
      // })
      // basketItems.addEventListener('click', (event) => {
      //     console.log('클릭');
      // })

      // 구매한 아이템 리스트를 순환하며 총 금액 계산
      this.gotList.querySelectorAll("li").forEach((gotItem) => {
        let cntItem = parseInt(gotItem.querySelector(".count-num").textContent);

        if (gotItem.dataset.item === "Americano") {
          gotItem.dataset.cost = 4500;
          if (cntItem >= freeCoupon) {
            cntItem -= freeCoupon;
          } else {
            cntItem = 0;
          }
        }

        total += gotItem.dataset.cost * cntItem;
      });

      this.totalPrice.textContent = `총 금액 : ${new Intl.NumberFormat().format(
        total
      )} 원`;
    });
  }
}

export default VendingMachine;
