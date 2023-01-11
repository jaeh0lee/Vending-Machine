class ItemGenerator {
  constructor() {
    this.itemList = document.querySelector(".list-item");
  }

  async setup() {
    await this.loadDate((json) => {
      this.itemMaker(json);
    });
  }

  async loadDate(callback) {
    const response = await fetch("./src/js/item.json");

    if (response.ok) {
      callback(await response.json());
    } else {
      alert("통신 에러" + response.status);
    }
  }

  itemMaker(data) {
    const docFrag = document.createDocumentFragment();

    data.forEach((el) => {
      const item = document.createElement("li");
      const itemTemplate = `
                <button class="btn-item" type="button" data-item="${el.name}" data-cost="${el.cost}" data-img="${el.img}" data-count=${el.count}>
                    <img src="src/img/${el.img}" alt="" class="img-item">
                    <strong class="txt-item">${el.name}</strong>
                    <span class="txt-price">${el.cost}</span>
                </button>
            `;
      item.innerHTML = itemTemplate;
      docFrag.appendChild(item);
    });
    this.itemList.appendChild(docFrag);
  }
}

export default ItemGenerator;
