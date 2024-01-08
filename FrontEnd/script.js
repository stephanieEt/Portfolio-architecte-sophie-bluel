const gallery = document.querySelector(".gallery");
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
  const tabElements = await init();
  tabElements.map((element) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = element.imageUrl;
    figcaption.innerText = element.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
displayProjects();
