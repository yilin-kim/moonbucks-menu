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
// - [ ] localStorage에 메뉴를 저장한다.
// - [ ] localStorage에서 메뉴를 가져온다.

// 카테고리별 메뉴판 관리
// - [ ] 에스프레소 메뉴판 관리
// - [ ] 프라푸치노 메뉴판 관리
// - [ ] 블렌디드 메뉴판 관리
// - [ ] 티바나 메뉴판 관리
// - [ ] 디저트 메뉴판 관리

// 페이지 접근시 최초 데이터 Read & Rendering
// - [ ] 페이지에 최초로 접근할 때는 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [ ] 에스프레소 메뉴를 페이지에 그려준다.

// 품절 상태 관리
// - [ ] 품절 처리 버튼을 추가한다.
// - [ ] 품절 버튼을 누르면 localStorage에 품절 상태를 저장한다.
// - [ ] localStorage에 품절 상태를 저장한다.
// - [ ] 품절 상태를 UI에 반영한다.

// JS에서 DOM element 가져올 때 관용적으로 $표시를 사용한다.
// $표시로 DOM element return해서 반복 줄이는 함수
const $ = (selector) => document.querySelector(selector);

function App() {
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

    const $espressoMenuName = $("#espresso-menu-name").value;
    const createMenuItem = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };

    // HTML에 추가해서 넣어준다.
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      createMenuItem($espressoMenuName)
    );

    updateMenuCount();

    // 메뉴 추가 후 espresso menu name을 빈값으로 초기화한다.
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    // 디폴트값으로 기존 메뉴의 이름을 넣어준다.
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // 새로운 이름을 입력받아서 li tag에 넣어준다.
    const newMenuName = prompt("메뉴 이름을 입력하세요", $menuName.innerText);
    $menuName.innerText = newMenuName;
  };

  const removeMenuItem = (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
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
}

App();
