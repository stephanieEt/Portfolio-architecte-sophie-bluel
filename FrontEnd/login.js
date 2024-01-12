const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #pass");
const messageError = document.querySelector("#connection p");
let tokenId;

/*Fonction pour récupérer les users*/

async function recoverUsers(email, password) {
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("erreur th");
      }
    })
    .then((data) => {
      tokenId = data.token;
      window.localStorage.setItem("token", tokenId);
      window.location.href = "index.html";
    })
    .catch((error) => {
      messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
      console.log(error);
    });
}

form.addEventListener("submit", (event) => {
  login();
  event.preventDefault();
});

/*Fonction pour se connecter*/
function login() {
  const userEmail = email.value;
  const userPassword = password.value;
  recoverUsers(userEmail, userPassword);
}
