const API_BASE = 'http://localhost:4000/api';

async function fetchJSON(path){
  const res = await fetch(`${API_BASE}${path}`);
  if(!res.ok) throw new Error('fetch error ' + res.status);
  return res.json();
}

function makeCard(car){
  const div = document.createElement('div');
  div.className = 'card';
  const img = document.createElement('img');
  img.src = car.image_url || 'placeholder.jpg';
  img.alt = car.name;
  const h = document.createElement('h3');
  h.textContent = car.name;
  const p = document.createElement('p');
  p.textContent = car.short_desc || car.type + ' • ' + car.subtype;
  const btn = document.createElement('button');
  btn.textContent = 'View';
  btn.onclick = ()=> showDetails(car.id);
  div.append(img,h,p,btn);
  return div;
}

async function showTypes(){
  try{
    const types = await fetchJSON('/types');
    const container = document.getElementById('types-container');
    container.innerHTML = '';
    types.forEach(t=>{
      const card = document.createElement('div');
      card.className = 'card';
      const h = document.createElement('h3'); h.textContent = t.type;
      const p = document.createElement('p'); p.textContent = t.description || '';
      const list = document.createElement('div');
      (t.subtypes||[]).forEach(s=>{
        const sbtn = document.createElement('button');
        sbtn.textContent = s;
        sbtn.onclick = ()=> loadBySubtype(t.type, s);
        list.appendChild(sbtn);
      });
      card.append(h,p,list);
      container.appendChild(card);
    });
  }catch(e){ console.error(e); }
}

async function loadBySubtype(type, subtype){
  try{
    const cars = await fetchJSON(`/cars?type=${encodeURIComponent(type)}&subtype=${encodeURIComponent(subtype)}`);
    renderGallery(cars);
    location.hash = '#gallery';
  }catch(e){ console.error(e); }
}

function renderGallery(cars){
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  cars.forEach(c=> grid.appendChild(makeCard(c)));
}

async function showDetails(id){
  const detailSection = document.getElementById('details');
  const listSection = document.querySelector('#gallery');
  try{
    const car = await fetchJSON(`/cars/${id}`);
    document.getElementById('details-content').innerHTML = `
      <h2>${car.name}</h2>
      <img src="${car.image_url}" alt="${car.name}" style="max-width:100%;border-radius:8px"/>
      <p><strong>Type:</strong> ${car.type} • <strong>Subtype:</strong> ${car.subtype}</p>
      <p><strong>Features:</strong></p>
      <ul>${(car.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul>
      <p>${car.description || ''}</p>
    `;
    document.getElementById('back-btn').onclick = ()=> {
      detailSection.classList.add('hidden');
      document.getElementById('gallery').classList.remove('hidden');
    };
    document.getElementById('gallery').classList.add('hidden');
    detailSection.classList.remove('hidden');
  }catch(e){ console.error(e); }
}

async function init(){
  await showTypes();
  // load all cars initially
  try{
    const all = await fetchJSON('/cars');
    renderGallery(all);
  }catch(e){ console.error(e); }
}

window.addEventListener('load', init);
