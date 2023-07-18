
const musicImg=document.getElementById("musicImg");
const songName=document.getElementById("songName");
const singerName=document.getElementById("singerName");
const songNameMobile=document.getElementById("songName-mobile");
const singerNameMobile=document.getElementById("singerName-mobile");
const mainSong=document.getElementById("mainSong");
const controlIcons=document.querySelector(".control-icons");
const playPause=document.getElementById("playpause");
const progress=document.getElementById("progress");
const previewSong=document.getElementById("preview");
const nextSong=document.getElementById("next");
const startTime=document.getElementById("startTime");
const endTime=document.getElementById("endTime");
const repeat=document.getElementById("repeat");
const musicListDiv=document.getElementById("musicListDiv");
const musicListIcon=document.getElementById("musicListIcon");
const musicSoundIcon=document.getElementById("musicSound");
const soundDiv=document.getElementById("soundDiv");


let musicIndex = 1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
});


function loadMusic(indexNum){
songName.innerText=allMusic[indexNum - 1].name;
songNameMobile.innerText=allMusic[indexNum - 1].name;
musicImg.src=`./music img/${allMusic[indexNum -1 ].img}.jpg`;
singerName.innerText=allMusic[indexNum - 1].artist;
singerNameMobile.innerText=allMusic[indexNum - 1].artist;
mainSong.src=`./music/${allMusic[indexNum-1].src}.mp3`;
}
function playMusic(){
    playPause.classList.remove("play-music");
    playPause.classList.add("pause-music");
    playPause.innerText="pause";
    mainSong.play();
    musicImg.style.animation="rotate 5.5s infinite linear";
}
function pauseMusic(){
    playPause.classList.remove("pause-music");
    playPause.classList.add("play-music");
    playPause.innerText="play_arrow";
    mainSong.pause();
    musicImg.style.animation="none";
}
function NextSong(){
    musicIndex++;
    musicIndex>allMusic.length ? musicIndex=1 : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
playPause.addEventListener("click",()=>{
    const isMusicPaused =playPause.classList.contains("play-music");
    isMusicPaused ? playMusic() : pauseMusic();
});
nextSong.addEventListener("click",()=>{
    NextSong();
    
});
previewSong.addEventListener("click",()=>{
    musicIndex--;
    musicIndex<1 ? musicIndex=allMusic.length : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
});

mainSong.addEventListener("timeupdate",(e)=>{

    const currentTime=e.target.currentTime;
    progress.value=Math.round((currentTime+Number.EPSILON)*100)/100;

    mainSong.addEventListener("loadedmetadata",()=>{
        let audioDuration=mainSong.duration;
        let totalMin=Math.floor(audioDuration / 60);
        let totalSec=Math.floor(audioDuration % 60);
        if(totalSec<10){
            totalSec=`0${totalSec}`;
        }
        endTime.innerText=`${totalMin}:${totalSec}`;
        progress.max=Math.round((audioDuration+Number.EPSILON)*100)/100;
        
    });

        let currentMin=Math.floor(currentTime/60);
        let currentSec=Math.floor(currentTime%60);
        if(currentSec<10){
            currentSec=`0${currentSec}`;
        }
        startTime.innerText=`${currentMin}:${currentSec}`;
});

progress.addEventListener("change",()=>{
    mainSong.currentTime=progress.value;
    playMusic();
});

repeat.addEventListener("click",()=>{

    let getText=repeat.innerText;

    switch(getText){
        case "repeat":
            repeat.innerText="repeat_on";   
            repeat.setAttribute("title","Repeat: All");
            break;
        case "repeat_on":
            repeat.innerText="repeat_one";
            repeat.setAttribute("title","Repeat: One");
            break;
        case "repeat_one":
            repeat.innerText="repeat";
            break;
    }
});

mainSong.addEventListener("ended",()=>{
    let getText=repeat.innerText;

    switch(getText){
        case "repeat":
            pauseMusic();
            break;
        case "repeat_on":
           setTimeout(()=>{
            NextSong();
           },1000);
            break;
        case "repeat_one":
            mainSong.currentTime=0;
            setTimeout(()=>{
                playMusic();
               },1000);
            break;
    }
});

const Shuffle=document.getElementById("Shuffle");

Shuffle.addEventListener("click",()=>{

    let randomNum=Math.floor((Math.random() * allMusic.length) + 1);
    
    let getText=Shuffle.innerText;
    switch(getText){
        case "shuffle":
    loadMusic(randomNum);
    playMusic();
    Shuffle.innerText="shuffle_on";
    break;
    case "shuffle_on":
        loadMusic(musicIndex);
        playMusic();
        Shuffle.innerText="shuffle";
        break;
    }
});


musicListIcon.addEventListener("click",()=>{
     musicListDiv.classList.toggle("active");
});
musicSoundIcon.addEventListener("click",()=>{
    soundDiv.classList.toggle("activesound");
});

let ulTag=document.querySelector("ul");

for(let i=0;i<allMusic.length;i++){
    let liTag=`<li li-index="${i+1}">
    <div class="song-details">
        <span>${allMusic[i].name}</span>
        <span>${allMusic[i].artist}</span>
    </div>
    <audio class="${allMusic[i].src}" src="./music/${allMusic[i].src}.mp3"></audio>
    <div class="Song-duration">
        <span id="${allMusic[i].src}" class="audio-duration">3:20</span>
    </div>
</li>`
ulTag.insertAdjacentHTML("beforeend",liTag);

let liAudioDuration=ulTag.querySelector(`#${allMusic[i].src}`);
let liAudioTag=ulTag.querySelector(`.${allMusic[i].src}`);
liAudioTag.addEventListener("loadeddata",()=>{
   
    let audioDuration=liAudioTag.duration;
    let totalMin=Math.floor(audioDuration / 60);
    let totalSec=Math.floor(audioDuration % 60);
    if(totalSec<10){
        totalSec=`0${totalSec}`;
    }
    liAudioDuration.innerText=`${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
});
}

const allLiTag=document.querySelectorAll("li");

 function playingNow(){
    for(let j=0;j<allLiTag.length;j++){

        let durationTag=allLiTag[j].querySelector(".audio-duration");

        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");
            let adDuration=durationTag.getAttribute("t-duration");
            durationTag.innerHTML=adDuration;
        }


        if(allLiTag[j].getAttribute("li-index") == musicIndex){
            allLiTag[j].classList.add("playing");
            durationTag.innerHTML="playing";
        }
    
        allLiTag[j].setAttribute("onclick","clicked(this)")
    }
 }

function clicked(element){
    let getLiIndex=element.getAttribute("li-index");
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

const closE=document.getElementById("closE");

closE.addEventListener("click",()=>{
    if(musicListDiv.classList.contains("active")){
        musicListDiv.classList.remove("active");
    }
});

const Sound=document.getElementById("sound");


mainSong.addEventListener("loadedmetadata",()=>{
    Sound.addEventListener("change",()=>{
        let soundVal=(Sound.value)/100;
        mainSong.volume=soundVal;
    });
});
