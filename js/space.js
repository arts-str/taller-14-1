const buscar = document.getElementById('btnBuscar');
const input = document.getElementById('inputBuscar');
const contenedor = document.getElementById('contenedor');
const NASA_API_URL = 'https://images-api.nasa.gov/search?q=';



function returnSearchJSON(search) {
    fetch(NASA_API_URL + search).then(promise => promise.json()).then(data => { 
        showSpinner();
        setTimeout(() => {
            if(data.collection.items.length === 0){
                removeSpinner();
                showEmptyWarning();
            }else{
                removeSpinner();
                createCards(data.collection);
            }
            
        }, 1000);
    })
}

buscar.onclick = () =>{
    let search = ltrim(input.value);

    if (search) {  
        returnSearchJSON(search);
    }else{
        showEmptyWarning();
    }
};


function createCards(data) {
    contenedor.innerHTML = '';
    data.items.forEach(element => {
        getImgData(element).then(imgHref => {
            let imgObj = retrurnFirstUsableMedia(imgHref);                     
            let title = element.data[0].title;
            let description = element.data[0].description;
            let date = formatDate(element.data[0].date_created);
            let card = addCard(imgObj, title, description, date);
            if (card !== undefined) {
                contenedor.insertAdjacentHTML('beforeend', card);
            }
        });
    });
}

function addCard(imgObj, title, description, date) {
    let imgSrc = imgObj.url;

    const img = `<img src="${imgSrc}" class="card-img-top" alt="...">`
    const video = `<video src="${imgSrc}" controls class="card-img-top" alt="..."></video>`;
    let media;

    switch (imgObj.type) {
        case 'jpg':
        case 'png':
            media = img;
            break;
        case 'mp4':
        case 'mov':
            media = video;
            break;
        default:
            return undefined;
    }
    
    return `
        <div class="card">
            ${media}
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
                
                <p class="card-text align-text-bottom"><small class="text-body-secondary text-secondary">${date}</small></p>
            </div>
        </div>
    `
}


async function getImgData(element) {
    const response = await fetch(element.href);
    const data = await response.json();
    return data;
}

function showSpinner() {
    contenedor.classList.remove('grid');
    contenedor.innerHTML= 
        `
            <div class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
        `;
}

function removeSpinner() {
    contenedor.classList.add('grid');
    contenedor.innerHTML = '';
}

function showEmptyWarning() {
    contenedor.classList.remove('grid');
    contenedor.innerHTML = 
    `
        <div class="text-center alert alert-warning" role="alert">
            Tu busqueda no devolvió resultados, intenta otra!
        </div>
    `;
}

function ltrim(str) {
    if(!str) return str;
    return str.replace(/^\s+/g, '');
}

function retrurnFirstUsableMedia(imgHref) {
    for (const url of imgHref) {
        const format = url.substring(url.length-3, url.length);        
        switch (format) {
            case 'jpg':       
            case 'mp4':
            case 'mov':
            case 'png':
                return {url: url, type: format};
            default:
                break;
        }
    }      
        
}

function formatDate(isoDate) {
    const date = new Date(isoDate);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    };

    const readableDateTime = date.toLocaleString('es-UY', options);

    return readableDateTime; // "May 31, 2019, 12:00 AM"

}