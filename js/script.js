console.log("inside the javascript")

let currentsong=new Audio();
let songs;
let currFolder;


function convertSecondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {


    currFolder=folder;


    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    songs = []
    let as = div.getElementsByTagName("a")
    for (i = 1; i < as.length; i++) {
        let element = as[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songul=document.querySelector(".main").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const i of songs) {
        songul.innerHTML=songul.innerHTML+`<li>
        <div class="flex wrap john justify-centre item-centre gap-5">
                                <img src="img/music.svg" alt="">
                                <div class="sname">${i.replaceAll("%20"," ")}</div>
                            </div>
                            <div class="flex wrap justify-centre item-centre gap-5">
                                <span style="font-size: 12px;">Play Now</span>
                                <img src="img/play.svg" alt="">
                            </div>
        </li>`
    }


    //attach a event listener to each song
    Array.from(document.querySelector(".main").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".john").querySelector(".sname").innerHTML)
            playsong(e.querySelector(".john").querySelector(".sname").innerHTML)
        })
    })

    return songs
}


const playsong=(track,pause=false)=>{
    // let audio=new Audio("/Music/"+track)
    currentsong.src=`/${currFolder}/`+track
    if(!pause){
        currentsong.play()
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".duration").innerHTML="00:00/00:00"
}

async function displayAlbums(){
    let a = await fetch(`/Music/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".CardContainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if(e.href.includes("/Music") &&!e.href.includes(".htaccess")) {
            let folder=e.href.split("/").slice(-2)[0];
            //Get the matadata from the folder
            let a = await fetch(`/Music/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                            <img src="Music/${folder}/cover.jpg" alt="">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-9800-icon e-9800-baseline"
                                viewBox="0 0 24 24">
                                <path
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                </path>
                            </svg>
                            <h3>${response.title}</h3>
                            <p>${response.description}</p>
                        </div>`
        }
    }

    //Load the plylist whenever it clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`Music/${item.currentTarget.dataset.folder}`)  
            console.log(songs[0]);
            playsong(songs[0].replaceAll("%20"," "))

        })
    })
}


async function main() {
    
    await getsongs("Music/2md")
    playsong(songs[0],true)
    
    
    //to play song
    // let audio = new Audio(songs[2])
    // audio.play()
    
    //Display all albums on the page
    await displayAlbums();
    

    //Attach a eventlistener to previous , play and next
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="img/pause.svg"
        }
        else{
            currentsong.pause()
            play.src="img/play.svg"
        }
    })


    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".duration").innerHTML=`${convertSecondsToMinutes(Math.floor(currentsong.currentTime))}/${convertSecondsToMinutes(Math.floor(currentsong.duration))}`
        document.querySelector(".circle").style.left=(Math.floor(currentsong.currentTime)/currentsong.duration)*100+"%"
    })


    //Add an event listener to seekbar
    document.querySelector(".seek").addEventListener("click",(e)=>{
    console.log(e.target.getBoundingClientRect().width,e.offsetX);
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%"
    currentsong.currentTime=(currentsong.duration*percent)/100
    })


    //Add event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })


    //Add event listener to cross
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
    }) 


    //Add event listener to previous
    previous.addEventListener("click",()=>{
        currentsong.pause()
        console.log("previous clicked");
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playsong(songs[index-1].replaceAll("%20"," "))
        }
    })


    //Add event listener to next
    next.addEventListener("click",()=>{
        currentsong.pause()
        console.log("next clicked");
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index);
        if((index+1)<songs.length){
            playsong(songs[index+1].replaceAll("%20"," "))
        }
    })

    
    
}
main()
