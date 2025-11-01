const inputElement = document.querySelector('.search_input')
const repositoryList = document.querySelector('.repository_list')
const repositories = document.querySelector('.repository')


// Массив куда сохраняется 5 репозиториев из гита
let arrRepository = []


//асинхронная функция, которая получает данные с сервера и сохраняет их в массив
//вызывает функцию, в которой генерируется всплывающий список
async function searchRepository(){
    let item = inputElement.value.trim()
    if(item.length === 0) {
        repositoryList.textContent = ''
        return
    }


    let data = await fetch(`https://api.github.com/search/repositories?q=${inputElement.value}`)
    try {
    let response = await data.json()
    repositoryList.textContent = ''
    arrRepository = response.items.slice(0, 5)
    arrRepository.forEach(repository => {
       createRepository(repository)
    });

    
    } catch (error) {
        console.log(error);
        
    }
}


//Функция в которой генерируется всплывающий список под инпутом
// и вешается слушатель на элемент списка при нажатии 

//  функция которая вызывается после клика по элементу из списка репозиториев
// сравнивает нажатый элемент с элементами массива и возвращает обьект из массива
// очищает все поля после нажатия

function createRepository(repository) {      
        const repositoryElem = createElementList('li','repository_elem', repository.name)
        repositoryList.append(repositoryElem)

        repositoryElem.addEventListener('click', function () {
            let repo = arrRepository.find(item => item.name === repository.name)
        createCard(repo)

        inputElement.value = ''
        repositoryList.textContent = ''
        
        });
    }

function createCard(repository) {
    const repositoryCard = createElementList('ul', 'repository_card')
    repositoryCard.id = repository.node_id
    const repositoryName = createElementList('li', 'repository_desc', `Name: ${repository.name}`)
    const repositoryOwner = createElementList('li', 'repository_desc', `Owner: ${repository.owner.login}`)
    const repositoryStars = createElementList('li', 'repository_desc', `Stars: ${repository.stargazers_count}`)

    repositoryCard.append(repositoryName, repositoryOwner, repositoryStars, createButtonCard(repositoryCard.id))
    repositories.append(repositoryCard)
}

function createElementList(tagName, className, text) {
    const element = document.createElement(tagName)
    element.classList.add(className)

    if(text) {
        element.textContent = text
    }

    return element
}

function createButtonCard(nodeId) {
    const button = createElementList('button', 'repositoty_button')
    button.addEventListener('click', () => deleteCard(nodeId));
    
    return button
}

function deleteCard(nodeId) {

    arrRepository = arrRepository.filter(item => item.node_id !== nodeId)

    const cardElement = document.getElementById(nodeId);
    cardElement.remove()
    
}


function debounce(fn, debounceTime) {
    let timer;
    return function(){
        clearTimeout(timer)
        
      timer = setTimeout(() => fn.apply(this, arguments),debounceTime)
    }
}


inputElement.addEventListener('keyup', debounce(searchRepository, 500))



