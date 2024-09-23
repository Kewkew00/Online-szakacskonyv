const AppTitle = "Szakácskönyv";
const AppVersion = "v1.0";
const Author = "Kevo és Tari";
const Company = "Kevo és Tari Péksége és Temetkezési Vállalata";

const serverUrl = 'http://localhost:3001';

let loggedUser = null;

let title = document.querySelector('title');
let header = document.querySelector('header');
let footer = document.querySelector('footer');

title.innerHTML = AppTitle + ' ' + AppVersion;
header.innerHTML = title.innerHTML;
footer.innerHTML = Company + ' |  2024.';

async function render(view){
     let main = document.querySelector('main');
     main.innerHTML = await(await fetch(`Views/${view}.html`)).text();

     switch(view){
        case 'profile': {
            getMe();
            break;
        }
        case 'users': {
            getUsers();
            break;
        }
        case 'recipes': {
            addRecipes();
            break;
        }
        case 'statistics': {
            getUserStats();
            getAdminStats();
            break;
        }
     }
}

if (localStorage.getItem('szakacskonyv')){
    loggedUser = JSON.parse(localStorage.getItem('szakacskonyv'));
    render('recipes');
}else{
    render('login');
}

function renderNavItems(){
    let lgdOutNavItems = document.querySelectorAll('.lgdOut');
    let lgdInNavItems = document.querySelectorAll('.lgdIn');
    let admNavItems = document.querySelectorAll('.lgdAdm');

    if (loggedUser == null){
        lgdInNavItems.forEach(item =>{
            item.classList.add('d-none');
        });
        lgdOutNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
        admNavItems.forEach(item => {
            item.classList.add('d-none');
        });
        return;
    }

    if (loggedUser.role == 'admin'){
        admNavItems.forEach(item => {
            item.classList.remove('d-none');
        });
    }
 
    lgdInNavItems.forEach(item => {
        item.classList.remove('d-none');
    });

    lgdOutNavItems.forEach(item => {
        item.classList.add('d-none');
    });
}

function authorize(){
    let res = {
         headers: { "Authorization": loggedUser[0].ID  }
    }
    return res;
}

renderNavItems();