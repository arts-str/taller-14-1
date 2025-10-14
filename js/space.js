const buscar = document.getElementById('btnBuscar');
const input = document.getElementById('inputBuscar');
const contenedor = document.getElementById('contenedor');
const NASA_API_URL = 'https://images-api.nasa.gov/search?q=';



function returnSearchJSON(search) {
    fetch(NASA_API_URL + search).then(promise => promise.json()).then(data => {  
        if(data.collection.items.length === 0){
            alert('empty');
        }else{
            createCards(data.collection);
        }
    })
}

buscar.onclick = () =>{
    returnSearchJSON(input.value);
};


function createCards(data) {
    contenedor.innerHTML = '';
    data.items.forEach(element => {
        getImgData(element).then(imgHref => {
            let imgSrc = imgHref[0]; 
            let title = element.data[0].title;
            let description = element.data[0].description;
            contenedor.insertAdjacentHTML('beforeend', addCard(imgSrc, title, description));
        });
    });
}

async function addCard(imgSrc, title, description) {
    const img = `<img src="${imgSrc}" class="card-img-top" alt="...">`
    const video = `<video src="${imgSrc}" controls class="card-img-top" alt="..."></video>`;
    const format = imgSrc.substring(imgSrc.length-3, imgSrc.length);
    console.log(format);
    
    let media;
    switch (format) {
        case 'jpg':
            media = img;
            break;
        case 'tif':
            break;
        case 'mp4':
            media = video;
            break;
        case 'mov':
            media = video;
            break;
    
        default:
            break;
    }
    
    return `
        <div class="card">
            ${media}
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
            </div>
        </div>
    `
}


async function getImgData(element) {
    const response = await fetch(element.href)
    const data = await response.json();
    return data
}

