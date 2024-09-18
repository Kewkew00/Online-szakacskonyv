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