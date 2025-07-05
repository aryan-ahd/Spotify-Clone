console.log("inside the javascript");

let currentsong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;

function convertSecondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs(folder, songList) {
  currFolder = folder;
  songs = songList;

  const songul = document.querySelector(".main ul");
  songul.innerHTML = "";

  for (const song of songs) {
    songul.innerHTML += `
      <li>
        <div class="flex wrap john justify-centre item-centre gap-5">
          <img src="img/music.svg" alt="">
          <div class="sname">${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="flex wrap justify-centre item-centre gap-5">
          <span style="font-size: 12px;">Play Now</span>
          <img src="img/play.svg" alt="">
        </div>
      </li>`;
  }

  Array.from(songul.getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      const track = e.querySelector(".john .sname").innerHTML;
      playsong(track);
    });
  });
}

const playsong = (track, pause = false) => {
  const index = songs.findIndex(s => s.replaceAll("%20", " ") === track);
  if (index !== -1) currentIndex = index;

  currentsong.src = `/${currFolder}/${songs[currentIndex]}`;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".duration").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  const res = await fetch("/Music/index.json");
  const data = await res.json();

  const cardContainer = document.querySelector(".CardContainer");

  data.forEach(album => {
    cardContainer.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <img src="Music/${album.folder}/cover.jpg" alt="">
        <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-9800-icon e-9800-baseline"
          viewBox="0 0 24 24">
          <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
        </svg>
        <h3>${album.title}</h3>
        <p>${album.description}</p>
      </div>`;
  });

  document.querySelectorAll(".card").forEach((e, i) => {
    e.addEventListener("click", () => {
      const album = data[i];
      getsongs(`Music/${album.folder}`, album.songs);
      playsong(album.songs[0].replaceAll("%20", " "));
    });
  });
}

async function main() {
  const res = await fetch("/Music/index.json");
  const data = await res.json();
  const firstAlbum = data[0];

  await getsongs(`Music/${firstAlbum.folder}`, firstAlbum.songs);
  playsong(firstAlbum.songs[0].replaceAll("%20", " "), true);
  await displayAlbums();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    const current = Math.floor(currentsong.currentTime);
    const duration = Math.floor(currentsong.duration);
    document.querySelector(".duration").innerHTML = `${convertSecondsToMinutes(current)}/${convertSecondsToMinutes(duration)}`;
    document.querySelector(".circle").style.left = (current / duration) * 100 + "%";
  });

  document.querySelector(".seek").addEventListener("click", e => {
    const width = e.target.getBoundingClientRect().width;
    const percent = (e.offsetX / width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  previous.addEventListener("click", () => {
    currentsong.pause();
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playsong(songs[currentIndex].replaceAll("%20", " "));
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    currentIndex = (currentIndex + 1) % songs.length;
    playsong(songs[currentIndex].replaceAll("%20", " "));
  });
}

main();
