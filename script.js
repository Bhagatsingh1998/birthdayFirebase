
const loaderSection = document.querySelector('.loader-section');
const headerCakeImg = document.querySelector('.header-cake-img');
const loaderClose = document.querySelector('#loaderClose');


// const heroSection = anime({
//   targets: '.hero',
//   backgroundColor: [
//     {value: 'red', duration: 500}, 
//     {value: 'green', duration: 500}
//   ],
//   loop: true,
//   easing: 'linear'
// })

const hbdShort = new Howl({
  src: ['./assets/sounds/hbdShort.mp3']
});



const headerAlphabets = anime({
  targets: '.header-alphabet-img',
  translateY : [
    {value: 180, duration: 500},
    {value: 0, duration:500}
  ],
  rotate : [
    value = '1turn'
  ],
  loop: true,
  delay: function(el, i, l) {return i*500},
  easing: 'linear'
});



var hbd = new Howl({
  src: ['./assets/sounds/hdb.mp3'],

});

// window.onload = function() {
//   var context = new AudioContext();
//   // context.start();
//   context().hbdShort.play();  
// }

// window.onload = function(){
//   var url = 'https://badasstechie.github.io/Clips/Siren.mp3';
//   window.AudioContext = window.AudioContext||window.webkitAudioContext; //fix up prefixing
//   var context = new AudioContext(); //context
//   var source = context.createBufferSource(); //source node
//   source.connect(context.destination); //connect source to speakers so we can hear it
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true); 
//   request.responseType = 'arraybuffer'; //the  response is an array of bits
//   request.onload = function() {
//       context.decodeAudioData(request.response, function(response) {
//           source.buffer = response;
//           hbdShort.play(); //play audio immediately
//           // source.loop = true;
//       }, function () { console.error('The request failed.'); } );
//   }
//   request.send();
// }

// $( document ).ready(function() {
//   hbdShort.play();  
// });

// setInterval(function(){
//   hbdShort.play();
// },100);





// hbdShort.on('end', function() {
//   console.log('hey');
//   loaderSection.style.visibility = 'visible'; 
//   hbd.play();
// });

function loaderCloseFun(e) {
  // console.log(e);
  loaderSection.style.display = 'none';
}
loaderClose.addEventListener('click', loaderCloseFun);

headerCakeImg.addEventListener('click', e => {
  loaderSection.style.visibility = 'visible';
  hbdShort.play();  
});


// slideshow

var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("form-pic");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  slides[slideIndex-1].style.transitionTimingFunction = "linear"; 
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}