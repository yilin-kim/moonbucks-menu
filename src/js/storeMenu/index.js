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

export default storeMenu;
