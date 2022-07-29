// step1 요구사항 분석
// 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - [x] 메뉴의 이름을 입력 받고 '확인' 버튼으로 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 개수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// 메뉴 수정
// - [x] 메뉴의 수정 버튼을 클릭하면, 'prompt' 인터페이스를 통해 모달창이 뜬다.
// - [x] 모달창에서 수정할 메뉴의 이름을 입력 받고, 확인 버튼을 누르면 메뉴가 수정된다.

// 메뉴 삭제
// - [x] 메뉴 삭제 버튼을 클릭하면,`confirm` 인터페이스를 통해 모달창이 뜬다.
// - [x] 사용자가 확인 버튼을 누르면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

// step2 요구사항 분석
// localStorage Read & Write
// - [x] localStorage에 메뉴를 저장한다. (추가, 수정, 삭제)
// - [x] localStorage에서 메뉴를 가져온다.

// 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [ ] 프라푸치노 메뉴판 관리
// - [ ] 블렌디드 메뉴판 관리
// - [ ] 티바나 메뉴판 관리
// - [ ] 디저트 메뉴판 관리

// 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 접근할 때는 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [ ] 에스프레소 메뉴를 페이지에 그려준다.

// 품절 상태 관리
// - [ ] 품절 처리 버튼을 추가한다.
// - [ ] 품절 버튼을 누르면 localStorage에 품절 상태를 저장한다.
// - [ ] localStorage에 품절 상태를 저장한다.
// - [ ] 품절 상태를 UI에 반영한다.

// JS에서 DOM element 가져올 때 관용적으로 $표시를 사용한다.
// $표시로 DOM element return해서 반복 줄이는 함수
const $ = (selector) => document.querySelector(selector);

const storeMenu = {
  setLocalStorage(menu) {
    // JSON 객체를 문자열로 저장한다.
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    // localStorage에서 메뉴를 가져온다.
    return localStorage.getItem("menu");
  },
};

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
  this.init = () => {
    if (storeMenu.getLocalStorage()) {
      // 문자열로 저장된 데이터를 파싱해서 JSON 객체로 만들어서 문자열을 순회하지 못해서 ㅅ가져와야 한다.
      this.menu = JSON.parse(storeMenu.getLocalStorage());
      console.log(this.menu);
    }
    render();
  };

  // 화면에 그려주는 함수
  const render = () => {
    // map function을 통해 [`<li></li>`,`<li></li>`,`<li></li>`]으로 리턴된 걸 join 시켜서 문자열로 만들어준다.
    const menuListTemplate = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
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
    $("#espresso-menu-list").innerHTML = menuListTemplate;

    // 메뉴 개수를 업데이트한다.
    updateMenuCount();
  };

  // espresso menu list 내 자식요소(li tag) 개수를 카운팅해서 메뉴 개수를 보여준다.
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").children.length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuItem = () => {
    // 사용자가 메뉴 이름에 빈 값을 입력했을 때 예외 처리한다.
    if ($("#espresso-menu-name").value === "") {
      alert("메뉴 이름을 입력해주세요.");
      return;
    }

    // input tag의 입력값으로 메뉴 이름을 저장한다.
    const espressoMenuName = $("#espresso-menu-name").value;

    // 저장한 메뉴 이름을 메뉴의 특정 키값(카테고리)에 접근해서 그 배열에 메뉴 이름을 저장한다.
    this.menu[this.currentCategory].push({ name: espressoMenuName });

    // 상태가 변경됐을 때 바로 local Storage에 저장한다.
    storeMenu.setLocalStorage(this.menu);
    render();
    // 메뉴 추가 후 espresso menu name을 빈값으로 초기화한다.
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    // data 속성은 dataset으로 접근 가능해서 menuId를 가져온다.
    const menuId = e.target.closest("li").dataset.menuId;
    // 디폴트값으로 기존 메뉴의 이름을 넣어준다.
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // 새로운 이름을 입력받아서 li tag에 넣어준다.
    const updatedMenuName = prompt(
      "메뉴 이름을 입력하세요",
      $menuName.innerText
    );
    // 상태가 변경됐을 때 바로 수정한다.
    this.menu[menuId].name = updatedMenuName;
    // localStorage에 반영한다.
    storeMenu.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuItem = (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      storeMenu.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      // 메뉴 개수 갱신
      updateMenuCount();
    }
  };

  // 수정, 삭제 관련 이벤트를 위임한다.
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuItem(e);
    }
  });

  //form 태그가 자동으로 전송되는 걸 막는다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 확인 버튼을 눌렀을 때 메뉴를 추가한다.
  $("#espresso-menu-submit-button").addEventListener("click", addMenuItem);

  // 엔터키를 눌렀을 때 메뉴를 추가한다.
  // 메뉴의 이름을 입력받는 건 element 찾아서, 메소드로 이벤트를 달고 이벤트를 받을 수 있다. (사용자 입력 이벤트 ex. keypress)
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    // 엔터키가 아닐 때 바로 종료한다.
    if (e.key !== "Enter") return;
    // 엔터키를 눌렀을 때 메뉴를 추가하는 함수를 호출한다.
    addMenuItem();
  });

  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
    }
  });
}

// 페이지 최초로 접근했을 때 app 이라는 객체를 생성한다.
// new 연산자로 생성된 인스턴스는 하나의 라이프사이클을 가지고, 이거에 대한 개별적인 상태 관리가 가능해진다.
const app = new App();
// 그 app의 init이라는 메소드를 불러와서 로직을 실행될 수 있게끔 한다.
app.init();
