const basic_Url = "https://lighthouse-user-api.herokuapp.com";
const Index_Url = basic_Url + "/api/v1/users/";
const userData = [];
let filteredUser = [];
let favoriteList = JSON.parse( localStorage.getItem('my-favorite-user') ) || []
let data = userData
let page = 1
let AllPages

const cardContainer = document.querySelector("#card-container");

//使用資料顯示使用者畫面
axios.get(Index_Url).then((response) => {
  const dataResult = response.data.results;
  userData.push(...dataResult);
  renderUser(getUsersPerPage(1,data));
  renderPagination(page, data);
});

function renderUser(data) {
  let rawHTML = "";
  data.forEach((item) => {
    if (item.gender === 'male'){
      rawHTML += `
        <div class="card m-3" style = "width: 15rem">
          <img id="${item.id}" class="photo" src=${item.avatar} data-toggle="modal" data-target="#exampleModal" alt="...">
            <div class="card-body">
              <i class="fas fa-male mr-2"></i>
              <span class="card-text">${item.name}</span>
              <i class="fas fa-heart ml-2 ${favoriteList.some(user => user.id === item.id) ? "hold" : "unhold"}" data-id= "${item.id}"></i>
              <p class='user-age mt-2'>Age:${item.age}</p>
            </div>
        </div>`
    }else if (item.gender === "female") {
      rawHTML += `
        <div class="card m-3" style = "width: 15rem">
          <img id="${item.id}" class="photo" src=${item.avatar} data-toggle="modal" data-target="#exampleModal" alt="...">
            <div class="card-body">
              <i class="fas fa-female mr-2"></i>
              <span class="card-text">${item.name}</span>
              <i class="fas fa-heart ml-2 ${favoriteList.some(user => user.id === item.id)? "hold": "unhold"}" data-id= "${item.id}"></i>
              <p class='user-age mt-2'>Age:${item.age}</p>
            </div>
        </div>`
    }
  })
  cardContainer.innerHTML = rawHTML;
}

const userPerPage = 15;

function getUsersPerPage(page,data) {
  let starter = (page - 1) * userPerPage;
  let slicedData = data.slice(starter, starter + userPerPage);
  return slicedData;
}

const paginator = document.querySelector("#paginator");

function renderPagination(nowPage,amount) {
  AllPages = Math.ceil(amount.length / userPerPage);
  let rawHTML = ""
  rawHTML += `   
      <li id = "previous-page" class="page-item">
        <a class="page-link" href="#" aria-label="Previous" id="previous-page">
          &laquo;
        </a>
      </li>`
  if (nowPage === 2){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='1'>1</a></li>`
  } else if (nowPage === 3) {
    rawHTML += `
       <li class="page-item"><a class="page-link" href="#" data-page = '1'>1</a></li>
    <li class="page-item"><a class="page-link" href="#" data-page = '2'>2</a></li>`
  } else if (nowPage > 3){
    rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page = "dots">...</a></li>
        <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage - 2}"> ${nowPage -2}</a></li>
        <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage - 1}">${nowPage -1 }</a></li>`
  }

  rawHTML+= `
   <li class="page-item active"><a class="page-link" href="#" data-page = "${nowPage}">${nowPage}</a></li>`
  
  let n = 0 
  while (nowPage < AllPages){
    nowPage ++
    rawHTML += `
     <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage}">${nowPage}</a></li>`
    n++ 
    if (n === 2 ){
      break
    }
  }
    if (n===2 && nowPage !== AllPages){
      rawHTML += `
          <li class="page-item"><a class="page-link" href="#" data-page = "dots">...</a></li>`
    }
  
  rawHTML += `
   <li id = "next-page" class="page-item">
      <a id = "next-page" class="page-link" href="#" aria-label="Next">&raquo
      </a>
    </li>`

  paginator.innerHTML = rawHTML;
}

//在分頁上加入事件監聽器
paginator.addEventListener("click", (event) => {
  event.preventDefault
  let target = event.target
  if ( (target.dataset.page  === 'dots')|| (target.tagName !== 'A'))return
  if (target.id === 'previous-page'){
    if (page === 1 ) {return}
    page -= 1
  } else if (target.matches ('#next-page')){
    console.log(AllPages)
    if ( page === AllPages) return
    page += 1
  } else {
    page = Number (target.dataset.page)
  }
  renderUser(getUsersPerPage(page, data))
  renderPagination (page,data)
});



const input = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const form = document.querySelector("form");

//在搜尋欄上加上監聽器
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = input.value.toLowerCase().replace(/\s+/g, "");
  filteredUser = userData.filter((user) => {
    return user.name.toLowerCase().includes(keyword);
  });
  data = filteredUser
  if (filteredUser.length === 0) {
    alert("no results found");
  } else {
    renderUser(getUsersPerPage(1,data));
    renderPagination(1,filteredUser);
  }
});

const movieModalTitle = document.querySelector(".modal-title");
const movieModalBody = document.querySelector(".modal-body");

//渲染跳出畫面
function renderModal(user) {
  movieModalTitle.innerText = `${user.name}`;
  movieModalBody.innerHTML = `
  <pre>
  age: ${user.age}
  birthday: ${user.birthday}
  email: ${user.email}
  </pre>`;
}


function addFavoriteUser(id,target) {
  const favoriteUser  = userData.find(user => user.id === Number(id))
  if (favoriteList.some(user => user.id === Number(id))) {
    alert('Already Exist')
  } else {
    favoriteList.push(favoriteUser)
    localStorage.setItem("my-favorite-user", JSON.stringify(favoriteList))
    target.classList.add('hold')
  }
}

cardContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("photo")) {
    const id = target.id;
    axios.get(Index_Url + id).then((response) => {
      const userInfo = response.data;
      renderModal(userInfo);
    });
  } else if (target.classList.contains("fa-heart")){
    addFavoriteUser(target.dataset.id, target)
  }
});


const ageFloor = document.querySelector('#age-floor')
const ageCeiling = document.querySelector ('#age-ceiling')
const ageFilter = document.querySelector ('#age-filter')
let filteredListByAge = []

//在 agefilter上加入監視器
ageFilter.addEventListener ('submit',event =>{
  if (ageFloor.value.length === 0 || ageCeiling.value.length ===0) {
    alert('Please enter your prefered range')
  }
  if (Number (ageFloor.value) > Number (ageCeiling.value)){
    alert ('Please enter correct range')
  }

  filteredListByAge = userData.filter (user => {
    return user.age >= Number(ageFloor.value) && user.age<=Number(ageCeiling.value)
  })
  data = filteredListByAge

  renderUser(getUsersPerPage(1,data))
  renderPagination(1, data)
})


// const navButtons = document.querySelector('#navbarSupportedContent')

// navButtons. addEventListener ('click', event => {
//   const target = event.target
//   console.log (target)
//   if (target.classList.contains('home')){
//     data = userData
//     renderUser(getUsersPerPage(1,data))
//     renderPagination(data.length)
//   } 
// })

