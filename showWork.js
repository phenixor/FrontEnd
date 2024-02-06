const token = localStorage.getItem("token");
if (token) {
    const logLabel = document.getElementById("logLabel");
    logLabel.innerHTML = "Logout";
    logLabel.setAttribute("href", "./index.html")
    logLabel.addEventListener("click", () =>{
        localStorage.removeItem("token");
        window.location.reload();
    })
} else {
    const bandeau = document.getElementsByClassName("bandeau")[0];
    bandeau.style.display = "none";
}

function displayProjectInWorks(project) {
    const DivGallery = document.getElementsByClassName("gallery")[0];
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    const textElement = document.createElement("figcaption");

    imageElement.src = project.imageUrl;
    textElement.innerText = project.title;
    figure.className = project.categoryId;
    figure.id = project.id


    DivGallery.appendChild(figure);
    figure.appendChild(imageElement);
    figure.appendChild(textElement);
}

async function showWorks(){
    const reponseProject = await fetch('http://localhost:5678/api/works');
    const projects = await reponseProject.json();
    

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        displayProjectInWorks(project);
       
    }

    const SecPortfolio = document.getElementById("portfolio");

    const categories = projects.map((project) => {
        return project.category
    })

    const uniqueCategories = removeDuplicates(categories, "id")


    for (let i = 0; i < uniqueCategories.length; i++) {
        const projectCat = uniqueCategories[i];

        const buttonArticle = document.createElement("article");
        buttonArticle.className = "apparence";

        const Button = document.createElement("input");
        Button.setAttribute("type", "checkbox");
        Button.id = projectCat.id;
        Button.className = "filtering";
        Button.name = projectCat.name;
        Button.addEventListener("click", async()=>{
            await hideWork();
            await filterButton();
        });

        
        const DivGallery = document.getElementsByClassName("gallery")[0];

        const text = document.createElement("p");
        text.textContent = Button.name;
        text.className = "textButton";
        const backDiv = document.createElement("div");
        SecPortfolio.append(buttonArticle);
        buttonArticle.append(Button);
        buttonArticle.append(backDiv);
        backDiv.append(text);
        DivGallery.insertAdjacentElement('beforebegin', buttonArticle);
    }

    const masterArticle = document.createElement("article")
    masterArticle.className = "apparence";

    const masterButton = document.createElement("input");
    masterButton.setAttribute("type", "checkbox");
    masterButton.id = "unfiltering";
    masterButton.name = "Tout";
    masterButton.addEventListener("click", async()=>{
        affichage()
    })
    masterButton.checked = true;

    masterArticle.append(masterButton);
    const text = document.createElement("p");
    text.textContent = "Tout";
    text.className = "textButton";
    const backDiv = document.createElement("div");
    masterArticle.append(backDiv);
    backDiv.append(text);


    const Title = SecPortfolio.querySelector('h2');

    Title.insertAdjacentElement('afterend', masterArticle);

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
function displayProjectInModal (project) {
        const grpImg = document.getElementById('grpDestruction')
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        const destruction =  document.createElement('button');

        imageElement.src = project.imageUrl;
        imageElement.className = "preview";
        figure.id = project.id;
        figure.className = "imgModal";

        const destructionIcon = document.createElement('i');
        destructionIcon.classList.add('fa-solid', 'fa-trash-alt');

        destruction.appendChild(destructionIcon);
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
        grpImg.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(destruction);
}

async function adminGestion () {
    
    const token = localStorage.getItem('token')

    const affProj = await fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const projects = await affProj.json();

    const divModal = document.getElementById('modalDiv');
    const grpImg = document.createElement("div");
    grpImg.className= "grpImg";
    grpImg.id = "grpDestruction"
    divModal.appendChild(grpImg);
    const chgModal = document.getElementById('chgModal');
    chgModal.insertAdjacentElement('beforebegin', grpImg);

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        
        displayProjectInModal(project);
    }

const form = document.getElementById('addProjectForm');
const nameInput = document.getElementById('projectName');
const categoryInput = document.getElementById('projectCategory');
const imageInput = document.getElementById('projectImage');
const submitButton = document.getElementById('couleurBoutton');
const previewImage = document.getElementById('previewImage');

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    const missingImg = document.getElementById('missingImg');
    const imgButton = document.getElementById('imgButton');
    const imgText = document.getElementById('imgText');
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'inline-block';
        missingImg.style.display = 'none';
        imgButton.style.display = 'none';
        imgText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.src = '#';
      previewImage.style.display = 'none';
      missingImg.style.display = 'block';
      imgButton.style.display = 'flex';
      imgText.style.display = 'block';
    }
  });

form.addEventListener('input', function() {
    const imageValid = imageInput.files.length > 0;
    const nameValid = nameInput.value.trim() !== '';
    const categoryValid = categoryInput.value.trim() !== '';

    if (imageValid && nameValid && categoryValid) {
      submitButton.removeAttribute('disabled');
      submitButton.style.border = "#1D6154"
      submitButton.style.backgroundColor = "#1D6154"
    } else {
      submitButton.setAttribute('disabled', 'true');
      submitButton.style.border = "#A7A7A7"
      submitButton.style.backgroundColor = "#A7A7A7"
    }
  });

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
            const project = await response.json()
            console.log('Projet ajouté avec succès !');
            displayProjectInModal(project);
            displayProjectInWorks(project);

            console.log('Projet ajouté avec succès !');
        } else {
            console.error('Échec lors de l\'ajout du projet.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du projet : ', error);
    }
});

const retourModal = document.getElementById('retour');

const T1 = document.getElementById('T1');
const T2 = document.getElementById('T2');
const grpDestruction = document.getElementById('grpDestruction');
const allerModal = document.getElementById('chgModal');

retourModal.addEventListener('click', async() => {
    retourModal.style.display = 'none';
    T1.style.display = 'block';
    T2.style.display = 'none';
    form.style.display = 'none';
    allerModal.style.display = 'flex';
    grpDestruction.style.display = 'flex';
});

allerModal.addEventListener('click', async() => {
    retourModal.style.display = 'flex';
    T1.style.display = 'none';
    T2.style.display = 'block';
    form.style.display = 'flex';
    allerModal.style.display = 'none';
    grpDestruction.style.display = 'none';
});
};

adminGestion ();



