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
}

function deleteRecipe(){
    if (confirm('Are you shure to delete then selected data?')){
        let date = document.querySelector('#date').value;
    
        axios.delete(`${serverUrl}/recipes/${loggedUser[0].ID}/${date}`, authorize()).then(res =>{
            alert(res.data);

            if (res.status == 200){
                cancel();
                getRecipes();
            }
        });
    }
}

function getRecipes(){
    axios.get(`${serverUrl}/recipes/${loggedUser[0].ID}`, authorize()).then(res =>{
        renderCard(res.data);
    })
}

function renderCard(){
    const fetchRecipes = async () => {
        const response = await fetch('/recipes');
        const recipes = await response.json();
        displayRecipes(recipes);
    };

    const displayRecipes = (recipes) => {
        const container = document.getElementById('recipes-container');
        container.innerHTML = '';
        
        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>${recipe.description}</p>
                <p>Time: ${recipe.time} mins</p>
                <p>Additions: ${recipe.additions}</p>
                <p>Calories: ${recipe.calories}</p>
            `;
            container.appendChild(card);
        });
    };

    window.onload = fetchRecipes;
};