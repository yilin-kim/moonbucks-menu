const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    if (!response.ok) {
      console.error(response.statusText);
    } else {
      // console.log(response);
      return response.json();
    }
  },
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("Error creating menu");
    }
    return response.json();
  },
  async updateMenu(category, id, name) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("Error updating menu");
    }
    return response.json();
  },
  async toggleSoldOutMenu(category, id) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}/soldout`,
      { method: "PUT" }
    );
    if (!response.ok) {
      console.error("Error toggling menu");
    }
  },
  async deleteMenu(category, id) {
    await fetch(`${BASE_URL}/category/${category}/menu/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Error deleting menu");
    }
  },
};

export default MenuApi;
