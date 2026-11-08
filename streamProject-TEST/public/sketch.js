let currentView = 'search';
let items = [];
let selected = null;
let episodes = [];
let currentSeason = 0;

let searchInput, searchButton, videoOverlay, videoPlayer, closeBtn, statusDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  searchInput = select('#search-input');
  searchButton = select('#search-btn');
  videoOverlay = select('#video-overlay');
  videoPlayer = select('#video-player');
  closeBtn = select('#close-btn');
  statusDiv = select('#status');

  searchButton.mousePressed(doSearch);
  closeBtn.mousePressed(closePlayer);
  searchInput.elt.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
}

function draw() {
  background(25);
  if (currentView === 'search') {
    drawSearchResults();
  } else if (currentView === 'detail') {
    drawDetail();
  } else if (currentView === 'episodes') {
    drawEpisodes();
  }
}

function setStatus(msg) { statusDiv.html(msg); }

async function doSearch() {
  const query = searchInput.value().trim();
  if (!query) return;
  setStatus('Searching...');
  try {
    const resp = await fetch('/api/search?q=' + encodeURIComponent(query));
    const data = await resp.json();
    items = data;
    currentView = 'search';
    setStatus('Found ' + items.length + ' results');
  } catch (e) {
    setStatus('Error: ' + e.message);
    console.error(e);
  }
}

function drawSearchResults() {
  if (items.length === 0) {
    fill(150);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('No results. Use the search bar above.', width/2, height/2);
    return;
  }
  const cardW = 180, cardH = 260, gap = 20;
  const cols = floor((width - gap) / (cardW + gap));
  const startX = (width - (cols * (cardW + gap) - gap)) / 2;
  const startY = 80;

  for (let i = 0; i < items.length; i++) {
    const col = i % cols;
    const row = floor(i / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    fill(40);
    stroke(100);
    rect(x, y, cardW, cardH, 10);
    fill(80);
    rect(x+10, y+10, cardW-20, cardH-120, 5);
    fill(255);
    textSize(14);
    textAlign(CENTER, TOP);
    text(items[i].title, x+10, y+cardH-105, cardW-20, 80);
    fill(200);
    textSize(12);
    text(items[i].rating + ' | ' + (items[i].meta || ''), x+10, y+cardH-40, cardW-20, 20);
  }
}

function mousePressed() {
  if (currentView !== 'search') return;
  const cardW = 180, cardH = 260, gap = 20;
  const cols = floor((width - gap) / (cardW + gap));
  const startX = (width - (cols * (cardW + gap) - gap)) / 2;
  const startY = 80;
  for (let i = 0; i < items.length; i++) {
    const col = i % cols;
    const row = floor(i / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    if (mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + cardH) {
      loadDetail(items[i]);
      break;
    }
  }
}

async function loadDetail(item) {
  if (!item.link) return;
  setStatus('Loading detail...');
  try {
    const resp = await fetch('/api/detail?url=' + encodeURIComponent(item.link));
    const info = await resp.json();
    selected = { ...item, ...info, link: item.link };
    currentView = 'detail';
    episodes = [];
    currentSeason = 0;
    setStatus(selected.name || selected.title);
  } catch (e) {
    setStatus('Error loading detail');
    console.error(e);
  }
}

function drawDetail() {
  if (!selected) return;
  background(25);
  fill(80);
  rect(50, 80, 200, 300, 5);
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(selected.name || selected.title, 280, 100, width-330, 100);
  textSize(14);
  fill(200);
  let y = 180;
  const lines = [
    'Rating: ' + (selected.imdb || selected.rating || 'N/A'),
    'Duration: ' + (selected.duration || 'N/A'),
    'Director: ' + (selected.director || 'N/A'),
    'Date: ' + (selected.dateCreated || 'N/A')
  ];
  lines.forEach(l => { text(l, 280, y); y += 25; });
  text('Synopsis:', 280, y+20);
  text(selected.description || 'No description available.', 280, y+40, width-330, 200);

  fill('#e50914');
  rect(width/2-60, height-150, 120, 40, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  text('▶ Play', width/2, height-130);

  if (selected.seasons && selected.seasons.length > 0) {
    for (let i = 0; i < selected.seasons.length; i++) {
      const bx = 50 + i * 120;
      const by = 420;
      fill(i === currentSeason ? '#e50914' : 60);
      rect(bx, by, 100, 35, 5);
      fill(255);
      textSize(14);
      textAlign(CENTER, CENTER);
      text('Season ' + (i+1), bx+50, by+17);
    }
    textAlign(LEFT, TOP);
    textSize(14);
    fill(200);
    text('Episodes: ' + (selected.seasons[currentSeason] || 0), 50, 470);
  }

  fill(100);
  rect(50, height-40, 80, 30, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  text('← Back', 90, height-25);
}

function mouseClicked() {
  if (currentView === 'detail') {
    if (mouseX > width/2-60 && mouseX < width/2+60 && mouseY > height-150 && mouseY < height-110) {
      playMovie(selected.link);
    }
    if (mouseX > 50 && mouseX < 130 && mouseY > height-40 && mouseY < height-10) {
      currentView = 'search';
    }
    if (selected && selected.seasons) {
      for (let i = 0; i < selected.seasons.length; i++) {
        const bx = 50 + i * 120;
        const by = 420;
        if (mouseX > bx && mouseX < bx+100 && mouseY > by && mouseY < by+35) {
          loadSeason(i);
          break;
        }
      }
    }
  } else if (currentView === 'episodes') {
    handleEpisodeClicks();
  }
}

async function loadSeason(seasonNum) {
  if (!selected || !selected.link) return;
  currentSeason = seasonNum;
  setStatus('Loading season ' + (seasonNum+1) + '...');
  const count = selected.seasons[seasonNum] || 0;
  episodes = [];
  for (let i = 1; i <= count; i++) {
    episodes.push({
      title: 'Episode ' + i,
      url: selected.link + '?season=' + (seasonNum+1) + '&episode=' + i
    });
  }
  currentView = 'episodes';
  setStatus('Season ' + (seasonNum+1));
}

function drawEpisodes() {
  background(25);
  textAlign(LEFT, TOP);
  fill(255);
  textSize(24);
  text('Season ' + (currentSeason+1) + ' Episodes', 50, 30);
  const cols = 3, gap = 20, cardW = (width - 100) / cols - gap;
  for (let i = 0; i < episodes.length; i++) {
    const col = i % cols;
    const row = floor(i / cols);
    const x = 50 + col * (cardW + gap);
    const y = 80 + row * (100 + gap);
    fill(60);
    rect(x, y, cardW, 80, 5);
    fill(255);
    textSize(16);
    text(episodes[i].title, x+10, y+10, cardW-20, 60);
  }
  fill(100);
  rect(50, height-40, 80, 30, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  text('← Back', 90, height-25);
}

function handleEpisodeClicks() {
  if (mouseX > 50 && mouseX < 130 && mouseY > height-40 && mouseY < height-10) {
    currentView = 'detail';
    return;
  }
  const cols = 3, gap = 20, cardW = (width - 100) / cols - gap;
  for (let i = 0; i < episodes.length; i++) {
    const col = i % cols;
    const row = floor(i / cols);
    const x = 50 + col * (cardW + gap);
    const y = 80 + row * (100 + gap);
    if (mouseX >= x && mouseX <= x + cardW && mouseY >= y && mouseY <= y + 80) {
      playEpisode(episodes[i].url);
      break;
    }
  }
}

async function playMovie(url) {
  setStatus('Loading video...');
  try {
    const resp = await fetch('/api/embed?url=' + encodeURIComponent(url));
    const data = await resp.json();
    if (data.embed) {
      videoPlayer.attribute('src', data.embed);
      videoOverlay.style('display', 'flex');
      setStatus('Now playing');
    } else {
      setStatus('No embed found');
    }
  } catch (e) {
    setStatus('Error loading embed');
  }
}

async function playEpisode(url) {
  playMovie(url);
}

function closePlayer() {
  videoPlayer.attribute('src', '');
  videoOverlay.style('display', 'none');
  setStatus('Player closed');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}