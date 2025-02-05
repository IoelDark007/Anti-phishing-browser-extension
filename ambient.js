const urlParams = new URLSearchParams(window.location.search);
const targetURL = urlParams.get('url');
let countdown = 10;
const isWarningPage = window.location.pathname === 'ambient.html'

const countdownElement = document.getElementById("countdown"); 

//let UrlArray = []

if (!isWarningPage /*&& !UrlArray.includes(targetURL)*/){

const interval = setInterval(() => {
    countdown --;
    countdownElement.textContent = `(${countdown})`

    if (countdown <= 0) {
        clearInterval(interval);
        if (targetURL) {
            window.location.href = targetURL;
    //        UrlArray.push(targetURL)
        }
    }
 }, 1000);

 const cautionBtn = document.getElementById("caution-btn");
 cautionBtn.addEventListener('click', ()=>{
    if(targetURL){
        window.location.href = targetURL;
    //    UrlArray.push(targetURL);
     //   console.log("added to array")
    }
 })
}/* else{
    console.log("this one is in the array")
}*/

