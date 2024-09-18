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

    axios.patch(`${serverUrl}/passmod/${loggedUser[0].ID}`, data).then(res => {
        alert(res.data);

        if (res.status == 200){
            document.querySelector('#oldpass').value = "";
            document.querySelector('#newpass').value = "";
            document.querySelector('#confirm').value = "";
        }
    });
}