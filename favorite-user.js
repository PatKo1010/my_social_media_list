const basic_Url = "https://lighthouse-user-api.herokuapp.com";
const Index_Url = basic_Url + "/api/v1/users/";
const favoriteList = JSON.parse(localStorage.getItem("my-favorite-user"))
let filteredList = []
let data = favoriteList
const userPerPage = 15
let page = 1 
let AllPages

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

function renderPagination(nowPage, data) {
  AllPages = Math.ceil(data.length / userPerPage);
  let rawHTML = ""
  rawHTML += `   
      <li id = "previous-page" class="page-item">
        <a class="page-link" href="#" aria-label="Previous" id="previous-page">
          &laquo;
        </a>
      </li>`
  if (nowPage === 2) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='1'>1</a></li>`
  } else if (nowPage === 3) {
    rawHTML += `
       <li class="page-item"><a class="page-link" href="#" data-page = '1'>1</a></li>
    <li class="page-item"><a class="page-link" href="#" data-page = '2'>2</a></li>`
  } else if (nowPage > 3) {
    rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page = "dots">...</a></li>
        <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage - 2}"> ${nowPage - 2}</a></li>
        <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage - 1}">${nowPage - 1}</a></li>`
  }

  rawHTML += `
   <li class="page-item active"><a class="page-link" href="#" data-page = "${nowPage}">${nowPage}</a></li>`

  let n = 0
  while (nowPage < AllPages) {
    nowPage++
    rawHTML += `
     <li class="page-item"><a class="page-link" href="#" data-page = "${nowPage}">${nowPage}</a></li>`
    n++
    if (n === 2) {
      break
    }
  }
  if (n === 2 && nowPage !== AllPages) {
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

function getUsersPerPage(page, data) {
  let starter = (page - 1) * userPerPage;
  let slicedData = data.slice(starter, starter + userPerPage);
  return slicedData;
}

renderUser (getUsersPerPage(page, data))
renderPagination (page,data)



//在分頁上加入事件監聽器
paginator.addEventListener("click", (event) => {
  event.preventDefault
  let target = event.target
  if ((target.dataset.page === 'dots') || (target.tagName !== 'A')) return
  if (target.id === 'previous-page') {
    if (page === 1) { return }
    page -= 1
  } else if (target.matches('#next-page')) {
    if (page === AllPages) return
    page += 1
  } else {
    page = Number(target.dataset.page)
  }
  renderUser(getUsersPerPage(page, data))
  renderPagination(page, data)
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
  data = filteredList
  if (filteredList.length === 0) {
    alert("no results found");
  } else {
    renderUser(getUsersPerPage(1,data));
    renderPagination(1,data);
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
  renderUser(getUsersPerPage(page,data))
  renderPagination(page, data)
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
  if (target.classList.contains('favorite')){
    data = favoriteList
    page = 1 
    renderUser(getUsersPerPage(page,data))
    renderPagination(page,data)
  }
})