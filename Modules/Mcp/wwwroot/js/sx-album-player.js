if (!customElements.get('sx-album-player')) {

const fmtTime = (secs) => {
  const m  = Math.floor(secs / 60);
  const ss = String(Math.floor(secs % 60)).padStart(2, '0');
  return `${m}:${ss}`;
};

class SxAlbumPlayer extends HTMLElement {

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = this._template();
    htmx.process(shadow);
    this._wire(shadow);
  }

  _template() {
    const src    = this.getAttribute('src')    || '';
    const title  = this.getAttribute('title')  || 'Unknown';
    const artist = this.getAttribute('artist') || '';
    const art    = this.getAttribute('art')    || '';
    const year   = this.getAttribute('year')   || '';

    return `
<style>
  :host { display: block; }

  section {
    padding: 3rem 0;
    background: linear-gradient(
      135deg,
      #0f0c29 0%,
      #302b63 50%,
      #24243e 100%
    );
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .layout {
    display: flex;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .art img {
    width: 280px;
    max-width: 100%;
    border-radius: .5rem;
    box-shadow: 0 1rem 3rem rgba(0,0,0,.5);
  }

  .info { flex: 1; color: #fff; min-width: 240px; }

  .label {
    font-size: .75rem;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: rgba(255,255,255,.45);
    margin-bottom: .25rem;
  }

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0 0 .25rem;
    line-height: 1.15;
  }

  .meta {
    color: rgba(255,255,255,.45);
    font-size: .9rem;
    margin-bottom: 1.5rem;
  }

  .scrub {
    height: 4px;
    background: rgba(255,255,255,.15);
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: .4rem;
  }

  #scrubFill {
    height: 100%;
    width: 0%;
    background: var(--bs-primary, #0d6efd);
    border-radius: 2px;
    pointer-events: none;
    transition: width .1s linear;
  }

  .timestamps {
    display: flex;
    justify-content: space-between;
    font-size: .72rem;
    color: rgba(255,255,255,.35);
    margin-bottom: 1.5rem;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  #playBtn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--bs-primary, #0d6efd);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  #playBtn:hover {
    filter: brightness(1.15);
  }

  input[type=range] {
    width: 110px;
    accent-color: var(--bs-primary, #0d6efd);
  }

  .vol-icon {
    fill: rgba(255,255,255,.4);
    flex-shrink: 0;
  }
</style>

<section>
  <div class="container">
    <div class="layout">

      <div class="art">
        <img src="${art}" alt="Album Art">
      </div>

      <div class="info">
        <p class="label">Single</p>
        <h1>${title}</h1>
        <p class="meta">${artist}&nbsp;·&nbsp;${year}</p>

        <audio id="audio" preload="metadata">
          <source src="${src}" type="audio/wav">
        </audio>

        <div class="scrub" id="scrubBar">
          <div id="scrubFill"></div>
        </div>

        <div class="timestamps">
          <span id="cur">0:00</span>
          <span id="dur">0:00</span>
        </div>

        <div class="controls">
          <button id="playBtn" aria-label="Play">
            <svg id="iconPlay"
                 xmlns="http://www.w3.org/2000/svg"
                 width="22" height="22"
                 fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.804 8 5 4.633v6.734zm.792-.696
                a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713
                12.69 4 12.345 4 11.692V4.308c0-.653.713-.998
                1.233-.696z"/>
            </svg>
            <svg id="iconPause"
                 xmlns="http://www.w3.org/2000/svg"
                 width="22" height="22"
                 fill="currentColor" viewBox="0 0 16 16"
                 style="display:none">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5
                0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5
                1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5
                1.5 0 0 1 1.5-1.5"/>
            </svg>
          </button>

          <svg class="vol-icon"
               xmlns="http://www.w3.org/2000/svg"
               width="18" height="18" viewBox="0 0 16 16">
            <path d="M7 4a.5.5 0 0 0-.812-.39L3.825
              5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0
              .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12z"/>
            <path d="M8.707 7.293a1 1 0 0 0-1.414
              1.414L8.586 10l-1.293 1.293a1 1 0 1 0
              1.414 1.414L10 11.414l1.293 1.293a1 1 0
              0 0 1.414-1.414L11.414 10l1.293-1.293a1
              1 0 0 0-1.414-1.414L10 8.586z"/>
          </svg>

          <input id="vol"
                 type="range"
                 min="0" max="1"
                 step="0.05" value="1"
                 aria-label="Volume">
        </div>
      </div>

    </div>
  </div>
</section>`;
  }

  _wire(root) {
    const $ = (id) => root.getElementById(id);
    const audio = $('audio'),  btn  = $('playBtn'),
          iPlay = $('iconPlay'), iPause = $('iconPause'),
          fill  = $('scrubFill'), bar  = $('scrubBar'),
          cur   = $('cur'), dur = $('dur'), vol = $('vol');

    audio.addEventListener('loadedmetadata', () =>
      dur.textContent = fmtTime(audio.duration));

    audio.addEventListener('timeupdate', () => {
      fill.style.width =
        `${(audio.currentTime / audio.duration) * 100}%`;
      cur.textContent = fmtTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      iPlay.style.display  = '';
      iPause.style.display = 'none';
      btn.setAttribute('aria-label', 'Play');
    });

    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        iPlay.style.display  = 'none';
        iPause.style.display = '';
        btn.setAttribute('aria-label', 'Pause');
      } else {
        audio.pause();
        iPlay.style.display  = '';
        iPause.style.display = 'none';
        btn.setAttribute('aria-label', 'Play');
      }
    });

    bar.addEventListener('click', (e) => {
      const r = bar.getBoundingClientRect();
      audio.currentTime =
        ((e.clientX - r.left) / r.width) * audio.duration;
    });

    vol.addEventListener('input', () =>
      audio.volume = parseFloat(vol.value));
  }
}

customElements.define('sx-album-player', SxAlbumPlayer);

} // end guard
