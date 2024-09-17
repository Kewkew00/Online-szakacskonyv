function registration(){
    let newUser = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
        confirm: document.querySelector('#confirm').value,
    }

    axios.post(`${serverUrl}/reg`, newUser).then(res => {
        alert(res.data);
    })
}