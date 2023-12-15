const form = document.getElementById("formProductCreator");
const deleteBtn = document.getElementById("delete-btn");
const addBtn = document.getElementById("add-btn");

fetch("/api/sessions/current")
  .then((response) => response.json())
  .then((userData) => {
    if (userData.role === "ADMIN") {
      deleteBtn.disabled = false;
      addBtn.disabled = false;
    } else if (userData.role === "PREMIUM") {
      deleteBtn.disabled = true;
      addBtn.disabled = false;
    }
  })
  .catch((error) => console.error(error));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = value;
  });

  // Agregar lógica del campo 'owner' según el rol del usuario
  try {
    const responseUser = await fetch("/api/sessions/current");
    const userData = await responseUser.json();

    if (userData.role === "PREMIUM") {
      // Si el usuario es premium, establecer 'owner' como su correo electrónico
      productData.owner = userData.email;
    } else {
      // Si no es premium, establecer 'owner' como "admin"
      productData.owner = "admin";
    }

    const responseProduct = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const result = await responseProduct.json();
    if (responseProduct.ok) {
      console.log(result.message);
      form.reset();
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error(error);
  }
});
