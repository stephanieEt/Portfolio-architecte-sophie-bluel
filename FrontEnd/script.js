const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
const loginLink = document.getElementById("login");
const bannerEditor = document.querySelector(".editor");
const body = document.querySelector("body");
const modifyLink = document.querySelector(".my-projets p");

let dataWorks = null;
let isConnect = false;
let btnId = "";
let inputTxt;
let select;
let imgInput;

/*fonction pour récupérer les projets*/
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  dataWorks = await response.json();
  return dataWorks;
}

/*Affichage des nouveaux projets dans le dom*/
async function main() {
  if (window.localStorage.getItem("token")) {
    isConnect = true;
    loginLink.innerHTML = "logout";
    loginLink.href = "index.html";
    displayEditor();
    setDataForCategory();
    loginLink.addEventListener("click", logout);
  }
  const card = await getWorks();
  card.map((card) => {
    createCard(card);
  });
  if (!isConnect) {
    createCategorysButtons();
  }
  displayGalleryPicture();
}

// Création d'UNE image
function createCard(card) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = card.imageUrl;
  figcaption.innerText = card.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

/*Fonction pour récupérer les catégories*/
async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

/*Affichage des catégories dans le dom*/
async function createCategorysButtons() {
  const btn = document.createElement("button");
  btn.innerText = "Tous";
  btn.id = 0;
  filter.appendChild(btn);
  const category = await getCategorys();
  category.map((element) => {
    const btn = document.createElement("button");
    btn.innerText = element.name;
    btn.id = element.id;
    filter.appendChild(btn);
  });

  filterByCategory();
}

/* Fonction pour filtrer les projets par catégorie*/
async function filterByCategory() {
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const differentsCategory = dataWorks.filter((card) => {
          return card.categoryId == btnId;
        });
        differentsCategory.map((card) => {
          createCard(card);
        });
      } else {
        dataWorks.map((card) => {
          createCard(card);
        });
      }
    });
  });
}

function logout() {
  window.localStorage.removeItem("token");
}

function displayEditor() {
  modifyLink.classList.remove("hidden-editor");
  bannerEditor.classList.remove("hidden-editor");
  body.classList.add("body-editor");
}

main();

/*Ajout de la modal*/
const modal = document.getElementById("myModal");
const modal1 = document.querySelector(".modal1");
const xmark = document.querySelector(".modal-wrapper .xmark");
const galleryPicture = document.querySelector(".galleryPicture");
const contentModalImg = document.getElementById("contentModalImg");
const newModal = document.getElementById("new-elements");

modal.addEventListener("click", () => {
  modal1.style.display = "flex";
  contentModalImg.style.display = "contents";
});
xmark.addEventListener("click", () => {
  modal1.style.display = "none";
  newModal.style.display = "none";
});
modal1.addEventListener("click", (e) => {
  if (e.target.className == "modal1") {
    modal1.style.display = "none";
  }
});

/*Ajout de la modal 2*/
const btnAddPicture = document.getElementById("btnAddPicture");

btnAddPicture.addEventListener("click", displayAddPicture);

function displayAddPicture() {
  contentModalImg.style.display = "none";
  newModal.style.display = "flex";
}

/*Evénement en appuyant sur la flèche retour pour retourner sur modal principal*/
const arrowLeft = document.querySelector(".close-icon");
arrowLeft.addEventListener("click", () => {
  contentModalImg.style.display = "flex";
  newModal.style.display = "none";
});
modal1.addEventListener("click", (e) => {
  if (e.target.className == "modal1") {
    newModal.style.display = "none";
  }
});

/*Mettre les images dans la galerie photo*/
async function displayGalleryPicture() {
  galleryPicture.innerHTML = "";
  dataWorks.map((works) => {
    const cards = document.createElement("div");
    const img = document.createElement("img");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    cards.classList.add("cards");
    trash.id = works.id;
    img.src = works.imageUrl;
    cards.appendChild(trash);
    cards.appendChild(img);
    galleryPicture.appendChild(cards);
  });
  deleteGalleryPicture();
}

/*Suppression d'une image de la modal*/
function deleteGalleryPicture() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = trash.id;
      fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }).then((response) => {
        if (response.ok) {
          dataWorks = dataWorks.filter((card) => {
            return card.id != id;
          });
          gallery.innerHTML = "";
          displayGalleryPicture();
          dataWorks.map((card) => {
            createCard(card);
          });
        } else {
          window.localStorage.removeItem("token");
          window.location.href = "index.html";
        }
      });
    });
  });
}

/*Étape 3.3 : Envoi d’un nouveau projet au back-end via le formulaire de la modale*/

const file = document.getElementById("photo-addition-button");
const title = document.getElementById("title-input");
const category = document.getElementById("category-input");
const validation = document.getElementById("send-validation");

title.addEventListener("input", controlForm);
file.addEventListener("input", controlForm);
category.addEventListener("input", controlForm);

// fonction qui passe le bouton Valider en vert si tous les champs sont remplis
function controlForm() {
  if (title.checkValidity() && validateFileUpload(file)) {
    validation.classList.add("valid");
  }
}

// validation du fichier image
function validateFileUpload(inputElement) {
  const fileName = inputElement.value;
  const allowedExtensions = ["jpg", "png"];
  const fileExtension = fileName.split(".").pop();
  let valid = false;
  allowedExtensions.map((extention) => {
    if (extention === fileExtension) {
      valid = true;
    }
  });
  return valid;
}

let blob = null;

/* blob preview Image*/
const containerAvatar = document.getElementById("photo-add");
const avatar = document.getElementById("avatar");
function imagePreview(e) {
  blob = new Blob([e.files[0]], { type: "image/jpeg" });
  const blobURL = URL.createObjectURL(blob);
  containerAvatar.innerHTML = "";
  const img = document.createElement("img");
  img.src = blobURL;
  containerAvatar.appendChild(img);
}

// Créer les options categorie du select de la modal
async function setDataForCategory() {
  const categoryInput = document.getElementById("category-input");
  const category = await getCategorys();
  category.map((element) => {
    const option = document.createElement("option");
    option.innerHTML = element.name;
    option.id = element.id;
    option.value = element.id;
    categoryInput.appendChild(option);
  });
}

const formAddWork = document.querySelector("#change");
formAddWork.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token"); // Récupère le token depuis le local storage
  const formData = new FormData(formAddWork);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {});
});
