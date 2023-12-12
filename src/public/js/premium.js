document.addEventListener("DOMContentLoaded", () => {
  const premiumForm = document.getElementById("premiumForm");
  const uploadFile = document.querySelectorAll("input[type='file']");

  let currentLoadingElement = null;

  uploadFile.forEach((file) => {
    file.addEventListener("change", (event) => {
      if (currentLoadingElement) {
        currentLoadingElement.parentNode.removeChild(currentLoadingElement);
      }

      const loading = document.createElement("span");
      loading.innerHTML = "Listo, siguiente por favor";
      event.target.parentNode.appendChild(loading);

      currentLoadingElement = loading;
    });
  });

  premiumForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    premiumForm.querySelector("#premiumSubmit").disabled = true;

    try {
      const user = await fetchUser();

      const formData = new FormData(premiumForm);

      const response = await fetch(`/api/users/${user.id}/documents`, {
        method: "POST",
        body: formData,
      }).then((response) => response.json());
      if (response.status === 200) {
        Swal.fire({
          title: "¡Felicitaciones!",
          text: "Ahora eres Premium",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/profile";
        });
      } else {
        const errorData = await response.json();
        console.error("Error en la solicitud:", errorData.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    } finally {
      premiumForm.querySelector("#premiumSubmit").disabled = false;

      if (currentLoadingElement) {
        currentLoadingElement.parentNode.removeChild(currentLoadingElement);
        currentLoadingElement = null;
      }
    }
  });
});

const fetchUser = async () => {
  const response = await fetch("/api/sessions/current", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  const result = await response.json();
  const user = result.payload;
  return user;
};
