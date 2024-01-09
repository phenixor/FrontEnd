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
        figure.id = project.id


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

    const masterButton = document.createElement("input");
    masterButton.setAttribute("type", "checkbox");
    masterButton.id = "unfiltering";
    masterButton.name = "Tout";
    masterButton.addEventListener("click", async()=>{
        affichage()
    })
    masterButton.checked = true

    SecPortfolio.append(masterButton);

}

showWorks();

function affichage() {
    const masterButton = document.getElementById("unfiltering");
    const Buttons = document.querySelectorAll(".filtering");
    const galleryDivs = document.getElementsByClassName("gallery");
    

    if (masterButton.checked) {
        for (let j = 0; j < galleryDivs.length; j++) {
            const figures = galleryDivs[j].querySelectorAll("figure");
            for (let i = 0; i < figures.length; i++) {
                figures[i].style.display = "block";
            }
        };

        for ( let k=0; k < Buttons.length; k++){
            Buttons[k].checked = false
        }
    }
}

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

    const masterButton = document.getElementById("unfiltering")
    masterButton.checked = false


    for ( let k=0; k < Buttons.length; k++){
        if (Buttons[k].checked) {
            const figure = document.getElementsByClassName(Buttons[k].id);
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

/* Modale */

let modal = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.closeModal').addEventListener('click', closeModal);
    modal.querySelector('.stopPropa').addEventListener('click', stopPropagation);
    document.querySelector('.modal-background').style.display = 'block';
    document.querySelector('.modal-background').addEventListener('click', closeModal);
}

const closeModal = function (e) {
    if (modal === null) return;
    if (e !== undefined) e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.closeModal').removeEventListener('click', closeModal);
    modal.querySelector('.stopPropa').removeEventListener('click', stopPropagation);
    document.querySelector('.modal-background').style.display = 'none';
    document.querySelector('.modal-background').removeEventListener('click', closeModal);
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".modalAppear").forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

/*Affichage éléments + suppression et ajout dans la modal*/

async function adminGestion () {
    
    const token = localStorage.getItem('token')

    const affProj = await fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const projects = await affProj.json();

    const divModal = document.getElementById('modalDiv');

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        const destruction =  document.createElement('input')

        imageElement.src = project.imageUrl;
        figure.id = project.id;
        figure.className = "imgModal";

        destruction.type = 'button';
        destruction.value = 'Supprimer';
        destruction.addEventListener('click', async () => {
            const confirmDeletion = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
            if (confirmDeletion) {
                const token = localStorage.getItem('token');
                const projectId = project.id;
        
                try {
                    const deleteResponse = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
        
                    if (deleteResponse.ok) {
                        figure.remove(); 
                        const otherFigure = document.querySelector(`figure[id="${projectId}"]`);
                        if (otherFigure) {
                            otherFigure.remove();
                        }
                    } else {
                        console.error('La suppression du projet a échoué.');
                    }
                } catch (error) {
                    console.error('Erreur lors de la suppression du projet : ', error);
                }
            }
        });


        divModal.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(destruction)
    }

const form = document.getElementById('addProjectForm');
const nameInput = document.getElementById('projectName');
const categoryInput = document.getElementById('projectCategory');
const imageInput = document.getElementById('projectImage');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const projectName = nameInput.value;
    const projectCategory = categoryInput.value;
    const projectImage = imageInput.files[0]; 

    const formData = new FormData();
    formData.append('title', projectName);
    formData.append('category', projectCategory);
    formData.append('image', projectImage);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            console.log('Projet ajouté avec succès !');
        } else {
            console.error('Échec lors de l\'ajout du projet.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du projet : ', error);
    }
});
}

adminGestion ();