const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
let dataWorks = null;

/*fonction pour récupérer les projets*/
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  dataWorks = await response.json();
  return dataWorks;
}

/*Affichage des nouveaux projets dans le dom*/
async function main() {
  const card = await getWorks();
  card.map((card) => {
    createCard(card);
  });
  createCategorysButtons();
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
  console.log(buttons);
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

main();
