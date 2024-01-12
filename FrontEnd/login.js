const form = document.querySelector("form");
const email = document.querySelector("form #email");
const password = document.querySelector("form #pass");
const messageError = document.querySelector("#connection p");

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
      // mettre la logique de sauvegarde de token
      console.log(data.token);
    })
    .catch((error) => {
      // mettre la logique d'information d'erreur
      console.log("erreur cat");
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
