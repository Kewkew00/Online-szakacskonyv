let recipess = [];

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
            createCard();
        }
    });
}

function renderCard(){
    
}