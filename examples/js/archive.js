let map;
const welcomeModal = document.getElementById('welcomeModal');
const tileMap = document.getElementById('map');
const restoreWelcomeModal = document.getElementById('restoreWelcomeModalBtn');
const sidebar = document.getElementById('offcanvasRight');
const form = document.getElementById('form');
const input = document.getElementById('input');
const responseText = document.getElementById('response');
const imageContainer = document.getElementById('imgContainer');
const mapToggle = document.getElementById('mapToggle');

const setupMap = () => {
  map = L.map('map').setView([51.505, -0.09], 13);

  map.attributionControl.setPosition('bottomleft');

  map.addGoogleMutant();
  map.whenReady(() => {
    new bootstrap.Modal(welcomeModal).show();
  });
};

const setupCollection = () => {
  map.imgGroup = L.distortableCollection().addTo(map);
};

setupMap();
L.Control.geocoder().addTo(map);
setupCollection();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  extractKey();
});

function extractKey() {
  let getUrl;
  if (!input.value.includes('archive.org/details/') && !input.value.includes('https://'))
  {
    getUrl = `https://archive.org/details/${input.value}/`;
    showImages(getUrl);
  }
  else if (!input.value.includes('https://') && !input.value.includes('http://') && input.value.includes('archive.org/details/')) {
    getUrl = `https://${input.value}`;
    showImages(getUrl);
  }
  else if (input.value.includes('http://')) {
    getUrl = input.value.replace('http:', 'https:');
    input.value = getUrl;
    console.log('input', input.value);
    showImages(getUrl);
  }
  else
  {
    getUrl = input.value;
    showImages(getUrl);
  }
}


// ignore start

// let startNum = 0;
// const totalData = 100;
// // another pagination
// const newPaginate = (data) => {
//   const startPage = (startNum * totalData) + 1;
//   const endPage = (startNum + 1) * totalData;
//   console.log(startPage, endPage);
//   return data.slice(startPage - 1, endPage);
// };

// ignore end


// pagination function
const paginate = (imgs) => {
  const imgsPerPage = 100;
  const pages = Math.ceil(imgs.length / imgsPerPage);

  const paginatedImgs = Array.from({length: pages}, (_, index) => {
    const start = index * imgsPerPage;
    return imgs.slice(start, start + imgsPerPage);
  });
  return paginatedImgs;
};

let currPage = 0;
let imgs = [];
const rightBtn = document.getElementById('rightBtn');
const leftBtn = document.getElementById('leftBtn');

// add and remove button when the array ends on both ends

// next btn
rightBtn.addEventListener('click', () => {
  const imgs = paginate(files.filter(file => file.format === 'PNG' || file.format === 'JPEG'));
  if (currPage < imgs.length -1) {
    currPage = currPage + 1;
  } else {
    currPage = 0;
  }
  // console.log(currPage + 1);
  // const len = newPaginate(files.filter(file => file.format === 'PNG' || file.format === 'JPEG')).length;
  // console.log(len);
  // if (len !== 0) {
  //   startNum++;
  // }
  imageContainer.textContent = '';
  renderImages(files, mainUrl, actCount);
});

// previous btn
leftBtn.addEventListener('click', () => {
  const imgs = paginate(files.filter(file => file.format === 'PNG' || file.format === 'JPEG'));
  if (currPage) {
    currPage = currPage - 1;
  } else {
    currPage = imgs.length - 1;
  }
  // console.log(currPage - 1);
  // if (startNum < 0) {
  //   startNum = 0;
  // } else {
  //   startNum--;
  // }
  imageContainer.textContent = '';
  renderImages(files, mainUrl, actCount);
});

const range = document.getElementById('range');


let files;
let mainUrl;
let actCount;

let imageCount = 0;
let fetchedFrom;
function renderImages(files, url, count) {
  const thumbs = files.filter(file => file.source === 'derivative');
  const images = files.filter(file => file.format === 'PNG' || file.format === 'JPEG');

  // <---------------- here is the issue, i want to get the last number and the first number instead of hardcoded 1-100-------->
  range.innerHTML = `1-100 of ${images.length}`;

  if (count < 100) {
    images.forEach((file) => {
      const imageRow = document.createElement('div');
      const image = new Image(150, 150);
      const placeButton = document.createElement('a');
      fetchedFrom = document.createElement('p');
      const fetchedFromUrl = document.createElement('a');
      fetchedFromUrl.setAttribute('href', input.value);
      fetchedFromUrl.setAttribute('target', '_blank');
      fetchedFromUrl.innerHTML = 'this Internet Archive Collection';
      fetchedFrom.appendChild(fetchedFromUrl);

      placeButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'place-button');
      placeButton.innerHTML = 'Place on map';
      image.setAttribute('data-original-image', `${url.replace('metadata', 'download')}/${file.name}`);
      image.src = `${url.replace('metadata', 'download')}/${file.name}`;
      imageRow.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-4', 'pe-5');
      imageRow.append(image, placeButton);
      imageContainer.appendChild(imageRow);
      imageCount++;
    });
  } else if (thumbs.length === images.length) {
    // when the images gotten is above 100 it needs to be paginated and also displayed in thumbnail format
    imageCount = images.length;
    // paginate function is called here
    imgs = paginate(thumbs);
    imgs[currPage].forEach((file) => {
      const imageRow = document.createElement('div');
      const image = new Image(65, 65);
      const placeButton = document.createElement('a');
      const fileName = document.createElement('p');
      const fetchedFromUrl = document.createElement('a');

      fetchedFrom = document.createElement('p');
      fetchedFromUrl.setAttribute('href', input.value);
      fetchedFromUrl.setAttribute('target', '_blank');
      fetchedFromUrl.innerHTML = 'this Internet Archive Collection';
      fetchedFrom.appendChild(fetchedFromUrl);
      fileName.innerHTML = file.name;
      fileName.classList.add('m-0');
      fileName.style.fontSize = '12px';


      placeButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'place-button', 'mt-1');
      placeButton.innerHTML = 'Place';
      placeButton.setAttribute('title', 'Place image on map');

      image.setAttribute('data-original', `${url.replace('metadata', 'download')}/${file.original}`);
      image.src = `${url.replace('metadata', 'download')}/${file.name}`;

      imageRow.classList.add('col-4', 'd-flex', 'flex-column', 'p-2', 'align-items-center');
      imageRow.append(image, placeButton, fileName);

      imageContainer.appendChild(imageRow);
      imageContainer.setAttribute('class', 'row');
    });
  } else {
    images.forEach((file) => {
      const imageRow = document.createElement('div');
      const image = new Image(65, 65);
      const placeButton = document.createElement('a');
      fetchedFrom = document.createElement('p');
      const fetchedFromUrl = document.createElement('a');
      fetchedFromUrl.setAttribute('href', input.value);
      fetchedFromUrl.setAttribute('target', '_blank');
      fetchedFromUrl.innerHTML = 'this Internet Archive Collection';
      fetchedFrom.appendChild(fetchedFromUrl);
      const fileName = document.createElement('p');
      fileName.innerHTML = file.name;
      fileName.classList.add('m-0');
      fileName.style.fontSize = '12px';

      placeButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'place-button', 'mt-1');
      placeButton.innerHTML = 'Place';
      placeButton.setAttribute('title', 'Place image on map');

      image.setAttribute('data-original', `${url.replace('metadata', 'download')}/${file.name}`);
      image.src = `${url.replace('metadata', 'download')}/${file.name}`;
      imageRow.classList.add('col-4', 'd-flex', 'flex-column', 'p-2', 'align-items-center');
      imageRow.append(image, placeButton, fileName);
      imageContainer.appendChild(imageRow);
      imageContainer.setAttribute('class', 'row');
      imageCount++;
    });
  }
}

function showImages(getUrl) {
  const url = getUrl.replace('details', 'metadata');

  axios.get(url)
      .then((response) => {
        if (response.data.files && response.data.files.length != 0) {
          count = response.data.files.filter((file)=> {
            if (file.format === 'PNG' || file.format === 'JPEG' || file.format.includes('Thumb') ) {
              return file;
            }
          }).length;
          files = response.data.files;
          mainUrl = url;
          actCount = count;
          renderImages(files, mainUrl, actCount);
          responseText.innerHTML = imageCount ? `${imageCount} image(s) fetched successfully from ${fetchedFrom.innerHTML}.` : 'No images found in the link provided...';
        } else {
          responseText.innerHTML = 'No images found in the link provided...';
        }
      })
      .catch((error) => {
        responseText.innerHTML = 'Uh-oh! Something\'s not right with the link provided!';
      })
      .finally(() => {
        bootstrap.Modal.getInstance(welcomeModal).hide();
      });
}

welcomeModal.addEventListener('hidden.bs.modal', (event) => {
  new bootstrap.Offcanvas(sidebar).show();
});

restoreWelcomeModal.addEventListener('click', (event) => {
  bootstrap.Modal.getInstance(welcomeModal).show();
  input.value='';
});

mapToggle.addEventListener('click', (event) => {
  new bootstrap.Offcanvas(sidebar).show();
});

tileMap.addEventListener('click', (event) => {
  bootstrap.Offcanvas.getInstance(sidebar).hide();
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('place-button')) {
    const imageURL = event.target.previousElementSibling.dataset.original;
    const image = L.distortableImageOverlay(imageURL);
    map.imgGroup.addLayer(image);
  }
});
