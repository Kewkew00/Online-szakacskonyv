let receptek = [];

function addRecipes(){
    let data = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        time: document.querySelector('#time').value,
        additions: document.querySelector('#additions').value,
        calorie: document.querySelector('#calorie').value
    }

    axios.post(`${serverUrl}/recipes/${loggedUser[0].ID}`, data, authorize()).then(res =>{
        alert(res.data);

        if (res.status == 200){
            document.querySelector('#title').value = null;
            document.querySelector('#description').value = null;
            document.querySelector('#time').value = null;
            document.querySelector('#additions').value = null;
            document.querySelector('#calorie').value = null;
            getRecipes();
        }
    });
    createCard(res.data);
}

function deleteRecipe(ID){
    if (confirm('Biztos törölni akarod a receptet?')){
        
        axios.delete(`${serverUrl}/recipes/${ID}`, authorize()).then(res =>{
            alert(res.data);
            if (res.status == 200){
                getRecipes();
            }
        })
    }
}

function getRecipes(){
    axios.get(`${serverUrl}/recipes/${loggedUser[0].ID}`, authorize()).then(res =>{
        createCard(res.data);
    })
}

function createCard(recipes) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card col-md-4 mb-4';

        let btn = document.createElement('button');
        btn.innerHTML = 'Törlés';
        btn.classList.add('btn','btn-danger');
        btn.onclick = function() {deleteRecipe(recipe.ID)};

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title"><strong> ${recipe.title} </strong></h5>
                <p class="card-text">${recipe.description}</p>
                <p><strong>Elkészítési idő:</strong> ${recipe.time} perc</p>
                <p><strong>Hozzávalók:</strong> ${recipe.additions}</p>
                <p><strong>Kalória:</strong> ${recipe.calorie} kcal</p>
                
            </div>
        `;
        card.appendChild(btn);
        cardContainer.appendChild(card);
    });
}