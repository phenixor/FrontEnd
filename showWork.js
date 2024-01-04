async function showWorks(){
    const reponseProject = await fetch('http://localhost:5678/api/works');
    const projects = await reponseProject.json();

    const DivGallery = document.getElementsByClassName("gallery")[0];
    
    DivGallery.innerHTML ='';

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        const textElement = document.createElement("figcaption");

        imageElement.src = project.imageUrl;
        textElement.innerText = project.title;
        figure.className = project.category.id;


        DivGallery.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(textElement);
    }

    const SecPortfolio = document.getElementById("portfolio");

    const categories = projects.map((project) => {
        return project.category
    })

    const uniqueCategories = removeDuplicates(categories, "id")


    for (let i = 0; i < uniqueCategories.length; i++) {
        const projectCat = uniqueCategories[i];

        const Button = document.createElement("input");
        Button.setAttribute("type", "checkbox");
        Button.id = projectCat.id;
        Button.className = "filtering";
        Button.name = projectCat.name;
        Button.addEventListener("click", async()=>{
            await hideWork();
            await filterButton()
        });

        SecPortfolio.append(Button);
    }

}

showWorks();

function hideWork() {
    const galleryDivs = document.getElementsByClassName("gallery");
    for (let i = 0; i < galleryDivs.length; i++) {
        const figures = galleryDivs[i].querySelectorAll("figure");
        for (let j = 0; j < figures.length; j++) {
            figures[j].style.display = "none";
        }
    }
}

async function filterButton () {
    
    const Buttons = document.querySelectorAll(".filtering")


    for ( let k=0; k < Buttons.length; k++){
        if (Buttons[k].checked) {
            const figure = document.getElementsByClassName(Buttons[k].id);
            console.log(figure);
            for (let j = 0; j < figure.length; j++) {
                figure[j].style.display = "block";
            }
        }
        
    }    
}

function removeDuplicates(array, key) {
    var seen = {};
    return array.filter(function(item) {
      var value = item[key];
      return seen.hasOwnProperty(value) ? false : (seen[value] = true);
    });
  }