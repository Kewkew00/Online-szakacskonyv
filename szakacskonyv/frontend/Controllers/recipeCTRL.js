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

function renderRecipeTable(){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    let summary = 0;
    stepdatas.forEach((item, index) =>{
        let tr = document.createElement('tr');

        tr.onclick = function() {selectRow(Number(index))};
        
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td1.innerHTML = (index +1) + '.';
        td2.innerHTML = moment(item.date).format('YYYY-MM-DD');
        td3.innerHTML = item.count;
        td3.classList.add('text-end');
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
        summary += item.count;
    });
    document.querySelector('strong').innerHTML = summary;
}

function selectRow(index){
    document.querySelector('.insertmode').classList.add('d-none');
    document.querySelectorAll('.editmode').forEach(item =>{
        item.classList.remove('d-none');
    });

    document.querySelector('#date').value = moment(stepdatas[index].date).format('YYYY-MM-DD');
    document.querySelector('#steps').value = stepdatas[index].count;
}