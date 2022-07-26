// step1 요구사항 분석
// 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다
// - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// JS에서 DOM element 가져올 때 관용적으로 $표시를 사용한다.
// $표시로 DOM element return해서 반복 줄이는 함수
const $ = (selector) => document.querySelector(selector);

function App() {
  //form 태그가 자동으로 전송되는 걸 막는다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 메뉴의 이름을 입력받는 건 element 찾아서, 메소드로 이벤트를 달고 이벤트를 받을 수 있다. (사용자 입력 이벤트 ex. keypress)
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
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
    }
  });
}

App();

// 메뉴 수정
// - [ ] 메뉴의 수정 버튼을 클릭하면, 'prompt' 인터페이스를 통해 모달창이 뜬다.
// - [ ] 모달창에서 수정할 메뉴의 이름을 입력 받고, 확인 버튼을 누르면 메뉴가 수정된다.
// - [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.

// 메뉴 삭제
// - [ ] 메뉴 삭제 버튼을 클릭하면,`confirm` 인터페이스를 통해 모달창이 뜬다.
// - [ ] 사용자가 확인 버튼을 누르면 메뉴가 삭제된다.
// - [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
