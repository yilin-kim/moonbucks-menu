import { $ } from "./utils/dom.js";
import storeMenu from "./storeMenu/index.js";
import MenuApi from "./api/index.js";

function App() {
  // 상태(변할 수 있는 데이터)
  // - 메뉴들, 개수, 품절 상태
  // 메뉴명은 App이라는 함수 객체가 가지고 있는 상태이기 때문에 this를 이용해서 관리할 수 있다.
  // 빈 배열로 초기화하고 데이터가 변할 때마다 관리한다.
  // 메뉴별 관리를 위해 menu 데이터를 배열이 아닌 객체 형식으로 바꾼다.
  this.menu = {
    espresso: [],
    frapuccino: [],
    blended: [],
    teavana: [],
    dessert: [],
  };
  // 현재 메뉴도 상태로 관리한다.
  this.currentCategory = "espresso";
  // 메소드 선언
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  // 화면에 그려주는 함수
  const render = () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    // map function을 통해 [`<li></li>`,`<li></li>`,`<li></li>`]으로 리턴된 걸 join 시켜서 문자열로 만들어준다.
    const menuListTemplate = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
          item.isSoldOut ? "sold-out" : ""
        }">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
      })
      .join("");

    // HTML에 추가해서 넣어준다.
    $("#menu-list").innerHTML = menuListTemplate;

    // 메뉴 개수를 업데이트한다.
    updateMenuCount();
  };

  // espresso menu list 내 자식요소(li tag) 개수를 카운팅해서 메뉴 개수를 보여준다.
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuItem = async () => {
    // 사용자가 메뉴 이름에 빈 값을 입력했을 때 예외 처리한다.
    if ($("#menu-name").value === "") {
      alert("메뉴 이름을 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    // 메뉴 추가 후 espresso menu name을 빈값으로 초기화한다.
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    // data 속성은 dataset으로 접근 가능해서 menuId를 가져온다.
    const menuId = e.target.closest("li").dataset.menuId;
    // 디폴트값으로 기존 메뉴의 이름을 넣어준다.
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // 새로운 이름을 입력받아서 li tag에 넣어준다.
    const updatedMenuName = prompt(
      "메뉴 이름을 입력하세요",
      $menuName.innerText
    );
    await MenuApi.updateMenu(this.currentCategory, menuId, updatedMenuName);
    render();
  };

  const removeMenuItem = async (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const initEventListeners = () => {
    // 수정, 삭제, 품절 관련 이벤트를 위임한다.
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuItem(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    //form 태그가 자동으로 전송되는 걸 막는다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // 확인 버튼을 눌렀을 때 메뉴를 추가한다.
    $("#menu-submit-button").addEventListener("click", addMenuItem);

    // 엔터키를 눌렀을 때 메뉴를 추가한다.
    // 메뉴의 이름을 입력받는 건 element 찾아서, 메소드로 이벤트를 달고 이벤트를 받을 수 있다. (사용자 입력 이벤트 ex. keypress)
    $("#menu-name").addEventListener("keypress", (e) => {
      // 엔터키가 아닐 때 바로 종료한다.
      if (e.key !== "Enter") return;
      // 엔터키를 눌렀을 때 메뉴를 추가하는 함수를 호출한다.
      addMenuItem();
    });

    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        // 카테고리 변경 업데이트
        this.currentCategory = categoryName;
        // console.log("this.currentCategory", this.currentCategory);
        // ~메뉴 관리 카테고리명 변경
        $(".category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        // 메뉴 이름 입력 placeholder 변경
        $("#menu-name").placeholder = `${e.target.innerText.slice(
          3
        )} 메뉴 이름`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}

// 페이지 최초로 접근했을 때 app 이라는 객체를 생성한다.
// new 연산자로 생성된 인스턴스는 하나의 라이프사이클을 가지고, 이거에 대한 개별적인 상태 관리가 가능해진다.
const app = new App();
// 그 app의 init이라는 메소드를 불러와서 로직을 실행될 수 있게끔 한다.
app.init();
