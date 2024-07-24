let bookList = document.getElementById("booklist");
let table = document.getElementById("booktable");
let body = document.getElementsByTagName("body");
let allBooks = Array.from(bookList.getElementsByTagName("tr"));
let maxPerPage = 5;
const parentDiv = document.getElementById("booktable").parentNode;

let allBookObjs = allBooks.map( (el, i) => {
    console.log(`Item ${i}: Section ${(Math.floor(i/maxPerPage))}`);
    let obj = {
        el: el,
        hide: () => {el.style.display = 'none';},
        show: () => {el.style.display = 'table-row';}
    }
    return obj;
});


function showPage(elements, page, maxElementsPerPage){
    for(let i = 0; i < elements.length; i++){
        /*
        Loop through all the elements and do the following for each one:
        - Divide the index of the element by the max number of elements per page, then round down.
        - If the resulting number equals the page number specified, show that element. Otherwise, hide it.
        */
        if((Math.floor(i/maxElementsPerPage)) == page){
            elements[i].show();
        }else{
            elements[i].hide();
        }
    }
    generatePageLinks(elements, maxElementsPerPage, page);
}

function generatePageLinks(elements, maxElementsPerPage, currentPage=0){
    let navList = document.getElementsByClassName('pagination');
    let pagesNeeded = Math.ceil(elements.length/maxElementsPerPage);

    if(navList.length > 0){
        console.log("links found - removing them to reset");
        for( var i = navList[0].children.length; i > 0; i--) {
            console.log("removing...");
            navList[0].firstChild.parentNode.removeChild(navList[0].firstChild);
        }
        let element = document.getElementById("navList");
        element.remove();
    }

    navList = document.createElement('ul');
    navList.id = "navList";
    navList.className = 'pagination';
    parentDiv.insertBefore(navList, table);
    console.log("no links found - we can now build new ones");
    

    for(let i=0; i < pagesNeeded; i++){
        let pageLink = document.createElement('li');
        if(i == currentPage){
            pageLink.innerHTML = `<a class="selected">${i+1}</a>`;
        }else{
            pageLink.innerHTML = `<a>${i+1}</a>`;
        }
        pageLink.addEventListener("click", (e) =>{showPage(elements, i, maxElementsPerPage);});
        navList.appendChild(pageLink);
    }
}