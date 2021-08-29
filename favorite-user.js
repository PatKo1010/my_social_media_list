const basic_Url = "https://lighthouse-user-api.herokuapp.com";
const Index_Url = basic_Url + "/api/v1/users/";
const favoriteList = JSON.parse(localStorage.getItem("my-favorite-user"))
let filteredList = []

const cardContainer = document.querySelector("#card-container");

function renderUser(data) {
  let rawHTML = "";
  data.forEach((item) => {
    if (item.gender === 'male') {
      rawHTML += `
        <div class="card m-3" style = "width: 15rem">
          <img id="${item.id}" class="photo" src=${item.avatar} data-toggle="modal" data-target="#exampleModal" alt="...">
            <div class="card-body">
              <i class="fas fa-male mr-2"></i>
              <span class="card-text">${item.name}</span>
              <i class="far fa-trash-alt ml-2" data-id ="${item.id}"></i>
            </div>
        </div>`
    } else if (item.gender === "female") {
      rawHTML += `
        <div class="card m-3" style = "width: 15rem">
          <img id="${item.id}" class="photo" src=${item.avatar} data-toggle="modal" data-target="#exampleModal" alt="...">
            <div class="card-body">
              <i class="fas fa-female mr-2"></i>
              <span class="card-text">${item.name}</span>
              <i class="far fa-trash-alt ml-2" data-id ="${item.id}"></i>
            </div>
        </div>`
    }
  })
  cardContainer.innerHTML = rawHTML;
}

const paginator = document.querySelector("#paginator");
const userPerPage = 15
let page = 1 

function renderPagination(amount) {
  let pages = Math.ceil(amount / userPerPage);
  let rawHTML = "";
  for (let page = 1; page <= pages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-id= "${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getUsersPerPage(page) {
  const data = filteredList.length ? filteredList : favoriteList;
  let starter = (page - 1) * userPerPage;
  let slicedData = data.slice(starter, starter + userPerPage);
  return slicedData;
}

renderUser (getUsersPerPage(1))
renderPagination (favoriteList.length)



//在分頁上加入事件監聽器
paginator.addEventListener("click", (event) => {
  let target = event.target;
  page = Number(event.target.dataset.id);
  console.log(getUsersPerPage(page));
  renderUser(getUsersPerPage(Number(event.target.dataset.id)));
});

const input = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const form = document.querySelector("form");

//在搜尋欄上加上監聽器
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = input.value.toLowerCase().replace(/\s+/g, "");
  filteredList = favoriteList.filter((user) => {
    return user.name.toLowerCase().includes(keyword);
  });
  if (filteredList.length === 0) {
    alert("no results found");
  } else {
    renderUser(getUsersPerPage(1));
    renderPagination(filteredList.length);
  }
});

const userModalTitle = document.querySelector(".modal-title");
const userModalBody = document.querySelector(".modal-body");

//渲染跳出畫面
function renderModal(user) {
  userModalTitle.innerText = `${user.name}`;
  userModalBody.innerHTML = `
  <pre>
  age: ${user.age}
  birthday: ${user.birthday}
  email: ${user.email}
  </pre>`;
}

//刪除最愛用戶
function deleteFavoriteUser (id){
  let toDeleteIndex = favoriteList.findIndex(item => {
    return item.id === Number (id)
  })
  let toDeleteIndexInFiltered = filteredList.findIndex(item => {
    return item.id === Number(id)
  })
  if (toDeleteIndex +1 === favoriteList.length && favoriteList.length%userPerPage === 1){
    page -= 1 
  }

  favoriteList.splice(toDeleteIndex,1)
  filteredList.splice(toDeleteIndexInFiltered, 1)
  
  localStorage.setItem('my-favorite-user',JSON.stringify(favoriteList))
  renderUser(getUsersPerPage(page))
  renderPagination(favoriteList.length)
}

//在圖表上加入監視器
cardContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("photo")) {
    const id = target.id;
    axios.get(Index_Url + id).then((response) => {
      const userInfo = response.data;
      renderModal(userInfo);
    });
  } else if (target.classList.contains("fa-trash-alt")) {
    deleteFavoriteUser(target.dataset.id)
  }

});

const navButtons = document.querySelector ('#navbarSupportedContent')

navButtons.addEventListener('click', event => {
  const target = event.target 
  console.log (event.target)
  console.lig
  if (target.classList.contains('favorite')){
    console.log(target)
    renderUser(favoriteList)
    renderPagination(favoriteList.length)
  }
})