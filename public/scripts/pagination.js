//limits results to display per page
let maxElementsPerPage = 10;
//array that stores element objects
const allElements = [];
//stores the indexes of the first element on each page - used to know when to stop displaying results
let pageIndexes = [];
let pagesNeeded = 0;
let currentPage = 0;

//grab the page elements
const pageElement = document.getElementsByClassName('page')[0];

//establish global var for pageLinks
let pageLinksElement = '';

const elementListElement = document.getElementsByClassName('element-list')[0];
//create new resultsMsg DIV element and insert it before the element-list element
const resultsMsgElement = document.createElement("DIV");
resultsMsgElement.innerHTML = "<strong>NO RESULTS FOUND</strong>";
resultsMsgElement.style.color = 'red';
pageElement.insertBefore(resultsMsgElement, elementListElement);

const elements_liElements = document.getElementsByClassName('element-item cf');
// const elementNames = document.getElementsByTagName('h3');//elementNames[0].textContent
// const elementAvatars = document.getElementsByClassName('avatar'); //elementAvatars[0].src
// const elementEmails = document.getElementsByClassName('email');//elementEmails[0].textContent
// const elementJoinDates = document.getElementsByClassName('date');//elementJoinDates[0].textContent

const header = document.getElementsByClassName('page-header cf')[0];
const searchBar = document.createElement('input');
searchBar.onkeyup = filterList;
searchBar.className = "element-search";
const searchButton = document.createElement('button');
searchButton.textContent = "Search";
searchButton.className = "element-search";
searchButton.addEventListener("click", filterList);
const formElement = document.createElement('form');
formElement.className = "element-search";
formElement.addEventListener('click', (e) => {
    console.log(e.target.id);
    if(e.target.id == 'max5' || e.target.id == 'max10' || e.target.id == 'max20'){
        let val = parseInt(e.target.value);
        switch(val){
            case 5:
                resultMax10.checked = false;
                resultMax20.checked = false;
                break;
            case 10:
                resultMax5.checked = false;
                resultMax20.checked = false;
                break;
            case 20:
                resultMax5.checked = false;
                resultMax10.checked = false;
                break;
        };
        maxElementsPerPage = val;
        showPage(allElements, 0);
    }
})
const formlabel = document.createElement('label');
formlabel.textContent = "Results Per Page:";

const resultMax5 = document.createElement('input');
const resultMax5_label = document.createElement('label');
resultMax5_label.textContent = "5";
resultMax5_label.for = "max5";
resultMax5.type = 'radio';
resultMax5.value = '5';
resultMax5.id = "max5";

const resultMax10 = document.createElement('input');
const resultMax10_label = document.createElement('label');
resultMax10_label.textContent = "10";
resultMax10_label.for = "max10";
resultMax10.type = 'radio';
resultMax10.value = '10';
resultMax10.id = "max10";
resultMax10.checked = true;

const resultMax20 = document.createElement('input');
const resultMax20_label = document.createElement('label');
resultMax20_label.textContent = "20";
resultMax20_label.for = "max20";
resultMax20.type = 'radio';
resultMax20.value = '20';
resultMax20.id = "max20";

formElement.appendChild(formlabel);
formElement.appendChild(resultMax5);
formElement.appendChild(resultMax5_label);
formElement.appendChild(resultMax10);
formElement.appendChild(resultMax10_label);
formElement.appendChild(resultMax20);
formElement.appendChild(resultMax20_label);

header.appendChild(searchButton);
header.appendChild(searchBar);
header.appendChild(formElement);



//store all element data into an array of element objects
for(let i = 0; i < elements_liElements.length; i++){
    //ok, some of this isn't used - was thinking about adding more filtering options like email or join date
    let element = {
        // name: elementNames[i].textContent,
        // avatar: elementAvatars[i].src,
        // email: elementEmails[i].textContent,
        // joinDate: elementJoinDates[i].textContent,
        // listItem: elements_liElements[i],
        el: elements_liElements[i],
        hide: () => {elements_liElements[i].style.display = 'none';},
        show: () => {elements_liElements[i].style.display = 'block';}
    }
    allElements.push(element);
}

function showPage(elements, page){
    //organize pages
    let length = elements.length;
    pagesNeeded = Math.ceil(length / maxElementsPerPage);
    appendPageLinks(elements, maxElementsPerPage);
    
    //the count for elements visible should be set to 0 by default, but keep the 'none found' message hidden
    let elementsVisible = 0;
    currentPage = page;
    //show only elements from the array passed in
    for(let i = 0; i < elements.length; i++){
        /*
        if the current element's index is greater than or equal to the index referenced in the pageIndexes array OR 
        the current element's index is less than the pageIndex + maxElementsPerPage (which would be the first index of 
        the next page), show the element. Otherwise, hide the element.
        */
        if(elements.indexOf(elements[i]) >= pageIndexes[page] && elements.indexOf(elements[i]) < (pageIndexes[page]+maxElementsPerPage)){
            elements[i].show();
            //console.log(`${elements[i].name} - ${i}`);
            //count how many elements are visible
            elementsVisible++;
        }else{
            elements[i].hide();
        }
    }
    if(elementsVisible > 0){
        //highlight the button that corresponds with the page you're on
        let linkList = document.querySelector('.pagination');
        let links = linkList.querySelectorAll('li > a');
        for(let i = 0; i < links.length; i++){
            if(i == page){
                links[i].style.border = "1px solid firebrick";
            }else{
                links[i].style.border = "";
            }
        }
    }else{
        resultsMsgElement.style.display = 'block';
    }
}

function filterList(){
    //get text from searchbar
    let query = searchBar.value;
    //start with clear array
    let filteredElementList = [];
    if(query != ''){
        let elements = allElements;
        //compare searchbar text with each element's name
        for(let i = 0; i < elements.length; i++){
            //if element's name starts with the same letters from the searchbar, show it, else hide it.
            if(elements[i].name.startsWith(searchBar.value)){
                filteredElementList.push(elements[i]);
            }else{
                elements[i].hide();
            }
        }
        //run showPage with the NEW array, not the default array
        showPage(filteredElementList, 0);
    }else{
        //run showPage with default elements list
        showPage(allElements, currentPage);
    }
}

function appendPageLinks(elementList, maxPerPage){
    //checking if ul pagination links already exist, removing them if they do
    var linkCheck = document.getElementsByClassName('pagination');
    if(linkCheck.length > 0){
        pageElement.removeChild(pageLinksElement);
    }
    //create new ul pagination element
    pageLinksElement = document.createElement('ul');
    pageLinksElement.className = 'pagination';
    let pageIndex = 0;
    pageIndexes = [];
    for(let i=0; i < pagesNeeded; i++){
        //add current index to the pageIndexes array, then increment by max 
        pageIndexes.push(pageIndex);
        pageIndex += maxPerPage;
        let pageLink = document.createElement('li');
        pageLink.innerHTML = `<a>${i+1}</a>`;
        pageLink.addEventListener("click", (e) =>{showPage(elementList, i);});
        pageLinksElement.appendChild(pageLink);
    }
    pageElement.appendChild(pageLinksElement);
}

showPage(allElements, 0)