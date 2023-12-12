const logout = document.getElementById("logout");
const profile = document.getElementById("profile");

const user = async () => {
  const response = await fetch("/api/sessions/current", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.payload) {
        profile.innerHTML = `<h4 class="profileName">Hola ${result.payload.name}</h4>
                        <p class="profileEmail">Email: ${result.payload.email}</p>
                        `;
      }

      if (result.payload.role === "user") {
        profile.innerHTML = ` <h4 class="profileName">Hola ${result.payload.name}</h4>
                              <p class="profileEmail">Email: ${result.payload.email}</p>
                              <div>
                                <p> ¿Deseas ser premium?</p>
                                <button class="premium" onclick="premium()">Si</button>
                              </div>
       `;
      }
      if (result.payload.role === "premium") {
        profile.innerHTML = `<h4 class="profileName">Hola ${result.payload.name}</h4>
                            <p class="profileEmail">Email: ${result.payload.email}</p>
                            <div>
                              <p> ¿Deseas vender un producto?</p>
                              <button class="premium" onclick="productCreator()">si</button>
                            </div>
       `;
      }
      return result;
    });
};

async function adios() {
  const response = await fetch("/api/sessions/logout", {
    method: "GET",
  }).then((result) => {
    if (result.status === 200) {
      return (window.location = "/");
    }
  });
}

async function premium() {
  window.location = "/premium";
}

user();
