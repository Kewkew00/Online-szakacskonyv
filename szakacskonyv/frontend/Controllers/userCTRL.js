function registration(){
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        password: document.querySelector('#password').value,
        confirm: document.querySelector('#confirm').value
    }

    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data);
    })
}

function login(){
    let user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    }

    axios.post(`${serverUrl}/login`, user).then(res =>{
       
        if (res.status != 202){
            alert(res.data);
            return;
        }

        loggedUser = res.data;
        localStorage.setItem('szakacskonyv', JSON.stringify(loggedUser));
        renderNavItems();
        render('recipes');
    });
}

function updateProfile(){
    
    let data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value
    }

    axios.patch(`${serverUrl}/users/${loggedUser[0].ID}`, data).then(res => {
        alert(res.data);
    });
}

function updatePassword(){
    
    let data = {
        oldpass: document.querySelector('#oldpass').value,
        newpass: document.querySelector('#newpass').value,
        confirm: document.querySelector('#confirm').value
    }

    axios.patch(`${serverUrl}/passmod/${loggedUser[0].ID}`,data ,authorize() ).then(res => {
        alert(res.data);

        if (res.status == 200){
            document.querySelector('#oldpass').value = "";
            document.querySelector('#newpass').value = "";
            document.querySelector('#confirm').value = "";
        }
    });
}

function getUsers(){
    axios.get(`${serverUrl}/users`, authorize()).then(res => {
        renderUsers(res.data);
    });
}

function updateUser(id){
    let data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        role: document.querySelector('#role').value

    }
    axios.patch(`${serverUrl}/users/${id}`, data, authorize()).then(res => {
        alert(res.data);
        if (res.status == 200){
            render('users');
        }
    });
}

function editUser(id){
    
    render('edituser').then(()=>{
            axios.get(`${serverUrl}/users/${id}`, authorize()).then(res => {
                document.querySelector('#name').value = res.data[0].name;
                document.querySelector('#email').value = res.data[0].email;
                document.querySelector('#role').value = res.data[0].role;
                document.querySelector('#updBtn').onclick = function() {updateUser(id)};
            });
        });
}


function deleteUser(id){
    if (confirm('Biztps törlöd ezt a felhasználót?')){
        axios.delete(`${serverUrl}/users/${id}`, authorize()).then(res => {
            alert(res.data);
            if (res.status == 200){
                getUsers();
            }
        })
    }
}

function getMe(){
    axios.get(`${serverUrl}/me/${loggedUser[0].ID}`, authorize()).then(res => {
        document.querySelector('#name').value = res.data[0].name;
        document.querySelector('#email').value = res.data[0].email;
        document.querySelector('#role').value = res.data[0].role;
    });
}

function getUsers(){
    axios.get(`${serverUrl}/users`, authorize()).then(res => {
        renderUsers(res.data);
    });
}

function renderUsers(users){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        
        td1.innerHTML = '#';
        td2.innerHTML = user.name;
        td3.innerHTML = user.email;
        td4.innerHTML = user.role;
        
        if (user.ID != loggedUser[0].ID){
            let btn1 = document.createElement('button');
            let btn2 = document.createElement('button');
            btn1.innerHTML = 'Edit';
            btn1.classList.add('btn','btn-warning', 'btn-sm', 'me-2');
            btn2.innerHTML = 'Delete';
            btn2.classList.add('btn','btn-danger', 'btn-sm');
            td5.classList.add('text-end');
            btn1.onclick = function() {editUser(user.ID)};
            btn2.onclick = function() {deleteUser(user.ID)};
            td5.appendChild(btn1);
            td5.appendChild(btn2);   
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        tbody.appendChild(tr);
    });

    let total = document.querySelector('strong');
    total.innerHTML = users.length;
}

function logout(){
    localStorage.removeItem('szakacskonyv');
    loggedUser = null;
    renderNavItems();
    render('login');
}

function createCard(){
    const cardContainer = document.getElementById('card-container');


    data.forEach(cardData => {
        // Létrehozunk egy card divet
        const card = document.createElement('div');
        card.className = 'card';
        card.style.width = '18rem';

        // Létrehozunk egy card-body divet
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Létrehozunk egy h5 elemet
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = cardData.title;

        // Létrehozunk egy p elemet
        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = cardData.text;

        // Összekapcsoljuk a card-body elemeit
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        // Létrehozunk egy list-group elemet
        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group list-group-flush';

        // Létrehozunk list-group-item elemeket az adatbázis elemei alapján
        cardData.items.forEach(itemText => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.textContent = itemText;
          listGroup.appendChild(listItem);
        });

        // Létrehozunk egy második card-body-t a linkek számára
        const cardLinksBody = document.createElement('div');
        cardLinksBody.className = 'card-body';

        // Létrehozunk linkeket az adatbázis alapján
        cardData.links.forEach(linkUrl => {
          const link = document.createElement('a');
          link.href = linkUrl;
          link.className = 'card-link';
          link.textContent = 'Card link';
          cardLinksBody.appendChild(link);
        });

        // Összerakjuk az összes elemet a card divbe
        card.appendChild(cardBody);
        card.appendChild(listGroup);
        card.appendChild(cardLinksBody);

        // Végül hozzáadjuk a card-ot a HTML dokumentumhoz
        cardContainer.appendChild(card);
      });
};

/*const card = document.createElement('div');
card.className = 'card';
card.style.width = '18rem';

// Létrehozunk egy card-body divet
const cardBody = document.createElement('div');
cardBody.className = 'card-body';

// Létrehozunk egy h5 elemet
const cardTitle = document.createElement('h5');
cardTitle.className = 'card-title';
cardTitle.textContent = 'Card title';

// Létrehozunk egy p elemet
const cardText = document.createElement('p');
cardText.className = 'card-text';
cardText.textContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

// Összekapcsoljuk a card-body elemeit
cardBody.appendChild(cardTitle);
cardBody.appendChild(cardText);

// Létrehozunk egy list-group elemet
const listGroup = document.createElement('ul');
listGroup.className = 'list-group list-group-flush';

// Létrehozunk list-group-item elemeket
const items = ['An item', 'A second item', 'A third item'];
items.forEach(itemText => {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item';
  listItem.textContent = itemText;
  listGroup.appendChild(listItem);
});

// Létrehozunk egy második card-body-t a linkek számára
const cardLinksBody = document.createElement('div');
cardLinksBody.className = 'card-body';

// Létrehozunk két linket
const link1 = document.createElement('a');
link1.href = '#';
link1.className = 'card-link';
link1.textContent = 'Card link';

const link2 = document.createElement('a');
link2.href = '#';
link2.className = 'card-link';
link2.textContent = 'Another link';

// Összekapcsoljuk a linkeket
cardLinksBody.appendChild(link1);
cardLinksBody.appendChild(link2);

// Összerakjuk az összes elemet a card divbe
card.appendChild(img);
card.appendChild(cardBody);
card.appendChild(listGroup);
card.appendChild(cardLinksBody);

// Végül hozzáadjuk a card-ot a HTML dokumentumhoz
document.getElementById('card-container').appendChild(card);*/