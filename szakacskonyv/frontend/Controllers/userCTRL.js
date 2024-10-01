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
        phone: document.querySelector('#phone').value,
        role: document.querySelector('#role').value
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
        phone: document.querySelector('#phone').value,
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
    
    render('profile').then(()=>{
            axios.get(`${serverUrl}/users/${id}`, authorize()).then(res => {
                document.querySelector('#name').value = res.data[0].name;
                document.querySelector('#email').value = res.data[0].email;
                document.querySelector('#phone').value = res.data[0].phone;
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
        document.querySelector('#phone').value = res.data[0].phone;
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
