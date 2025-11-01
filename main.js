const inputElement = document.querySelector('.search_input')
const repositoryList = document.querySelector('.repository_list')
const repositories = document.querySelector('.repository')



let arrRepository = []
let time



async function searchRepository(){
    const enteredValue = inputElement.value.trim()
    
    if(enteredValue.length === 0) {
        setData([])
        return;
    }

    let timeNow = new Date().getTime();
    time = timeNow
    const data = await fetch(`https://api.github.com/search/repositories?q=${inputElement.value}`)
    if(time === timeNow){
        try {
            const response = await data.json()
            setData(response.items.slice(0, 5)) 
        } catch (error) {
            console.log(error);  
        }
    }
}

function setData(newArr) {
    arrRepository = newArr
    if(newArr.length > 0){    
        createListRepository(arrRepository)

        return
    }

    repositoryList.textContent = ''
    
}

function createListRepository(arr) {
    repositoryList.textContent = ''

    for (let i = 0; i < arr.length; i++) {
        if(arr.length > 0){       
            const repositoryElem = createElementList('li','repository_elem', arr[i].name)
            repositoryList.append(repositoryElem)

            repositoryElem.addEventListener('click', function () {
                let repo = arrRepository.find(item => item.name === arr[i].name)
                createCard(repo)

                inputElement.value = ''
                setData([])
            })

        } 
    }
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



