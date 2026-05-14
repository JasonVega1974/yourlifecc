/* =============================================================
   worship.js — Worship Playlist (F1.0)
   30 hardcoded songs, lazy-loaded YouTube iframe via youtube-nocookie.com.
   Privacy: no requests to YouTube until the user clicks a song.
============================================================= */

const WORSHIP_PLAYLIST = [
  { id:'iJCV_2H9xD0', title:'Way Maker', artist:'Sinach', duration:'5:50' },
  { id:'-f4MUUMWMV4', title:'Goodness of God', artist:'Bethel Music', duration:'6:32' },
  { id:'nQWFzMvCfLE', title:'What a Beautiful Name', artist:'Hillsong Worship', duration:'4:04' },
  { id:'Sc6SSHuZvQE', title:'Reckless Love', artist:'Cory Asbury', duration:'5:19' },
  { id:'r2zhf2mqEMI', title:'Come As You Are', artist:'Crowder', duration:'3:42' },
  { id:'TCunuL58odQ', title:'How He Loves', artist:'David Crowder Band', duration:'5:50' },
  { id:'dy9nwe9_xzw', title:'Oceans (Where Feet May Fail)', artist:'Hillsong United', duration:'8:58' },
  { id:'u-1fwZtKJSM', title:'Living Hope', artist:'Phil Wickham', duration:'5:03' },
  { id:'KBD18rsVJHk', title:'How Great Is Our God', artist:'Chris Tomlin', duration:'4:09' },
  { id:'2go_dOJVwc4', title:'Raise a Hallelujah', artist:'Bethel Music', duration:'5:40' },
  { id:'XtwIT8JjddM', title:'10,000 Reasons', artist:'Matt Redman', duration:'5:52' },
  { id:'LqBpifDpNKc', title:'O Praise the Name', artist:'Hillsong Worship', duration:'5:49' },
  { id:'PcmqSfr1ENY', title:'I Speak Jesus', artist:'Here Be Lions', duration:'4:37' },
  { id:'mC-zw0zCCtg', title:'Jireh', artist:'Elevation Worship & Maverick City', duration:'5:32' },
  { id:'16KYvfIc2bE', title:'In Christ Alone', artist:'Keith Getty & Stuart Townend', duration:'4:24' },
  { id:'P-Zp586pvZg', title:'The Heart of Worship', artist:'Matt Redman', duration:'4:37' },
  { id:'EbMYye-2Yt8', title:'Holy Forever', artist:'Jen Johnson', duration:'8:14' },
  { id:'Ak5WTb-mgeA', title:'Worthy', artist:'Elevation Worship', duration:'6:09' },
  { id:'o8Gds6lBick', title:'Mighty Name of Jesus', artist:'Feat. Hope Darst', duration:'7:57' },
  { id:'YJNFAaWJhp0', title:'Hard Fought Hallelujah', artist:'Brandon Lake, Jelly Roll', duration:'5:31' },
  { id:'f2oxGYpuLkw', title:'Praise', artist:'Brandon Lake | Elevation Worship', duration:'5:04' },
  { id:'LawxIZE9ePE', title:'Same God', artist:'Elevation Worship', duration:'8:01' },
  { id:'cej4vn4sWtE', title:'Jesus Be The Name', artist:'Elevation Worship', duration:'8:59' },
  { id:'uHz0w-HG4iU', title:'Great Are You Lord', artist:'All Sons & Daughters', duration:'5:01' },
  { id:'dQdfs5S6jyA', title:'Gratitude', artist:'Brandon Lake', duration:'5:41' },
  { id:'jzQvggUparA', title:'Firm Foundation', artist:'The Belonging Co', duration:'7:55' },
  { id:'LM1qrx0Huds', title:'I Thank God', artist:'Tribl', duration:'8:07' },
  { id:'sIaT8Jl2zpI', title:'You Say', artist:'Lauren Daigle', duration:'4:30' },
  { id:'NXRR4fb_5HI', title:'Let It Be A Hallelujah', artist:'Lauren Daigle', duration:'4:07' },
  { id:'6DjKbUQfe9U', title:'No One Like The Lord', artist:'Jenn Johnson', duration:'8:18' },
];

// Module-private state. `_worship` prefix avoids collision with other globals.
let _worshipCurrentIndex = -1;
let _worshipIsShuffleOn = false;
let _worshipPlayedSongs = [];
let _worshipInitDone = false;
let _worshipAutoplayListenerAdded = false;

// Privacy: youtube-nocookie.com sets no cookies on first load.
const WORSHIP_EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';

// Idempotent — showSection() calls this every time s-worship becomes active.
function worshipInit() {
  if (_worshipInitDone) return;
  worshipRenderPlaylist();
  worshipSetupEventListeners();
  _worshipInitDone = true;
}

function worshipRenderPlaylist() {
  const grid = document.getElementById('worship-playlistGrid');
  if (!grid) return;
  grid.innerHTML = '';
  WORSHIP_PLAYLIST.forEach((video, index) => {
    grid.appendChild(worshipCreateVideoCard(video, index));
  });
}

function worshipCreateVideoCard(video, index) {
  const card = document.createElement('div');
  card.className = 'wp-card';
  card.setAttribute('data-index', index);
  const thumbUrl = 'https://img.youtube.com/vi/' + video.id + '/maxresdefault.jpg';
  card.innerHTML = `
    <div class="wp-thumb">
      <img src="${thumbUrl}" alt="${video.title}" loading="lazy">
    </div>
    <div class="wp-info">
      <div class="wp-info-title">${video.title}</div>
      <div class="wp-info-artist">${video.artist || 'Worship Music'}</div>
      <span class="wp-info-meta">${video.duration || '—'}</span>
    </div>`;
  card.addEventListener('click', () => worshipPlayVideo(index));
  return card;
}

function worshipPlayVideo(index) {
  if (index < 0 || index >= WORSHIP_PLAYLIST.length) return;
  _worshipCurrentIndex = index;
  const video = WORSHIP_PLAYLIST[index];

  if (_worshipIsShuffleOn && !_worshipPlayedSongs.includes(index)) {
    _worshipPlayedSongs.push(index);
  }

  const player = document.getElementById('worship-youtubePlayer');
  if (player) player.src = WORSHIP_EMBED_BASE + video.id + '?autoplay=1&rel=0&enablejsapi=1';

  const titleEl = document.getElementById('worship-nowPlayingTitle');
  const artistEl = document.getElementById('worship-nowPlayingArtist');
  if (titleEl) titleEl.textContent = video.title;
  if (artistEl) artistEl.textContent = video.artist || 'Worship Music';

  // Mini-player thumbnail + show
  const miniImg = document.getElementById('wpMiniThumbImg');
  if (miniImg) miniImg.src = 'https://img.youtube.com/vi/' + video.id + '/mqdefault.jpg';
  const mini = document.getElementById('wpMini');
  if (mini) mini.classList.remove('hidden');

  const playBtn = document.getElementById('worship-playPauseBtn');
  if (playBtn) playBtn.textContent = '❚❚';

  worshipUpdateActiveCard();
  worshipStartProgressTick(video.duration);
  worshipSetupAutoplayListener();
}

// Approximate progress bar — drives the thin gold strip across the top of
// the mini-player. Animates linearly over the song duration so the user
// gets a visual cue of where they are. Resets on every play call.
let _worshipProgressTimer = null;
function worshipStartProgressTick(durationStr){
  const bar = document.getElementById('wpProgressBar');
  if(!bar) return;
  if(_worshipProgressTimer){ clearInterval(_worshipProgressTimer); _worshipProgressTimer = null; }
  // Parse "5:32" → 332 seconds
  let total = 240;
  if(typeof durationStr === 'string'){
    const parts = durationStr.split(':').map(n => parseInt(n,10) || 0);
    if(parts.length === 2) total = parts[0]*60 + parts[1];
    else if(parts.length === 3) total = parts[0]*3600 + parts[1]*60 + parts[2];
  }
  bar.style.transition = 'none';
  bar.style.width = '0%';
  // Force reflow so the next transition takes effect
  void bar.offsetWidth;
  bar.style.transition = 'width ' + total + 's linear';
  bar.style.width = '100%';
}

// Fullscreen toggle — expands artwork to fill the panel above the mini-player
function worshipToggleFullscreen(){
  const sec = document.getElementById('s-worship');
  const btn = document.getElementById('wpFullscreenBtn');
  if(!sec) return;
  const isOn = sec.classList.toggle('wp-fullscreen');
  if(btn) btn.textContent = isOn ? '⊟' : '⛶';
}

function worshipTogglePlayPause() {
  if (_worshipCurrentIndex === -1) {
    worshipPlayVideo(0);
    return;
  }
  const video = WORSHIP_PLAYLIST[_worshipCurrentIndex];
  const player = document.getElementById('worship-youtubePlayer');
  if (player) player.src = WORSHIP_EMBED_BASE + video.id + '?autoplay=1&rel=0&enablejsapi=1';
  worshipSetupAutoplayListener();
}

function worshipSetupAutoplayListener() {
  if (_worshipAutoplayListenerAdded) return;
  _worshipAutoplayListenerAdded = true;
  window.addEventListener('message', function(event) {
    // Accept messages from both nocookie and main YouTube origins.
    if (event.origin !== 'https://www.youtube-nocookie.com' && event.origin !== 'https://www.youtube.com') return;
    try {
      const data = JSON.parse(event.data);
      // state 0 = video ended → autoplay next
      if (data.event === 'onStateChange' && data.info === 0) {
        setTimeout(worshipPlayNext, 500);
      }
    } catch(e) { /* ignore parse errors from non-JSON YT messages */ }
  });
}

function worshipUpdateActiveCard() {
  const cards = document.querySelectorAll('#s-worship .wp-card');
  cards.forEach((card, idx) => {
    card.classList.toggle('active', idx === _worshipCurrentIndex);
  });
}

function worshipPlayPrevious() {
  if (!WORSHIP_PLAYLIST.length) return;
  let newIndex = _worshipCurrentIndex - 1;
  if (newIndex < 0) newIndex = WORSHIP_PLAYLIST.length - 1;
  worshipPlayVideo(newIndex);
}

function worshipPlayNext() {
  if (!WORSHIP_PLAYLIST.length) return;
  let newIndex;
  if (_worshipIsShuffleOn) {
    const unplayed = [];
    for (let i = 0; i < WORSHIP_PLAYLIST.length; i++) {
      if (!_worshipPlayedSongs.includes(i)) unplayed.push(i);
    }
    if (!unplayed.length) {
      _worshipPlayedSongs = [];
      for (let i = 0; i < WORSHIP_PLAYLIST.length; i++) {
        if (i !== _worshipCurrentIndex) unplayed.push(i);
      }
    }
    newIndex = unplayed[Math.floor(Math.random() * unplayed.length)];
  } else {
    newIndex = _worshipCurrentIndex + 1;
    if (newIndex >= WORSHIP_PLAYLIST.length) newIndex = 0;
  }
  worshipPlayVideo(newIndex);
}

function worshipToggleShuffle() {
  _worshipIsShuffleOn = !_worshipIsShuffleOn;
  const btn = document.getElementById('worship-shuffleBtn');
  if (_worshipIsShuffleOn) {
    if (btn) btn.classList.add('active');
    _worshipPlayedSongs = _worshipCurrentIndex >= 0 ? [_worshipCurrentIndex] : [];
  } else {
    if (btn) btn.classList.remove('active');
    _worshipPlayedSongs = [];
  }
}

function worshipSetupEventListeners() {
  const prev    = document.getElementById('worship-prevBtn');
  const next    = document.getElementById('worship-nextBtn');
  const play    = document.getElementById('worship-playPauseBtn');
  const shuffle = document.getElementById('worship-shuffleBtn');
  if (prev)    prev.addEventListener('click', worshipPlayPrevious);
  if (next)    next.addEventListener('click', worshipPlayNext);
  if (play)    play.addEventListener('click', worshipTogglePlayPause);
  if (shuffle) shuffle.addEventListener('click', worshipToggleShuffle);
}
