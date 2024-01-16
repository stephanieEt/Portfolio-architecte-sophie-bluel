const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
const loginLink = document.getElementById("login");
const bannerEditor = document.querySelector(".editor");
const body = document.querySelector("body");
const modifyLink = document.querySelector(".my-projets p");
let dataWorks = null;
let isConnect = false;

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
    loginLink.addEventListener("click", logout());
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

/* Fonction pour filtrer les projets par catégoie*/
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

modal.addEventListener("click", () => {
  modal1.style.display = "flex";
});
xmark.addEventListener("click", () => {
  modal1.style.display = "none";
});
modal1.addEventListener("click", (e) => {
  if (e.target.className == "modal1") {
    modal1.style.display = "none";
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
    console.log(works);
  });
  /*deleteGalleryPicture();*/
}

/*Suppression d'une image de la modal*/
/*function deleteGalleryPicture() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.map(trash => {
    trash.addEventListener("click",(e) =>{
      const id = trash.id
      const init ={
        method:"DELETE",
        headers:{"content-type":"application/json"},
        }
      fetch("http://localhost:5678/api/works/1/" +id,init)

    })
  })
}*/

/*async function displayGalleryPicture() {
  galleryPicture.innerHTML = "";
  const pictures = await getWorks();
  pictures.map((works) => {
    const div = document.createElement("div");
    const button = document.createElement("button");
    const img = document.createElement("img");

    const icon = document.createElement("img");

    img.src = works.imageUrl;
    img.alt = works.title;
    img.crossOrigin = "anonymous";

    icon.src = "./assets/icons/trash-can-solid.png";
    icon.crossOrigin = "anonymous";
    icon.className = "deleteBtn";
    button.className = "btnIcon";
    div.className = "card";
    div.id = works.id;

    button.appendChild(icon);
    div.appendChild(img);
    div.appendChild(button);

    galleryPicture.appendChild(div);
  });
}
displayGalleryPicture();*/
