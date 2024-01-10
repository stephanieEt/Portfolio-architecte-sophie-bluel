const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
let liste = [];

/*mettre à jour l'affichage*/
gallery.innerHTML = "";

/*fonction pour récupérer les projets*/
async function init() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
init();

/*Affichage des nouveaux projets dans le dom*/
async function displayProjects() {
  const card = await init();
  card.map((card) => {
    createCard(card);
  });
}
displayProjects();

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
getCategorys();

/*Affichage des catégories dans le dom*/
async function createCategorysButtons() {
  const category = await getCategorys();
  category.map((element) => {
    const btn = document.createElement("button");
    btn.innerText = element.name;
    btn.id = element.id;
    filter.appendChild(btn);
  });
}
createCategorysButtons();

/* Fonction pour filtrer les projets par catégoie*/
async function filterCategory() {
  const project = await init();
  console.log(project);
  const buttons = document.querySelectorAll(".filter button");
  console.log(buttons);
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const differentsCategory = project.filter((card) => {
          return card.categoryId == btnId;
        });
        differentsCategory.forEach((card) => {
          createCard(card);
        });
      } else {
        displayProjects();
      }
    });
  });
}
filterCategory();
