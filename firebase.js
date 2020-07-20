// setting  up refference to collection
// db.collection('wishes');

// getting the data from the collection.
// db.collection('wishes').get();
// its an async request. thus cant store it a variable but it returens the promise

// db.collection('wishes').get()
// .then(snapshots => {
//   // console.log(snapshots.docs);
//   let snapshotsDocs = snapshots.docs;
//   snapshotsDocs.forEach(doc => {
//     let docData = doc.data();
//     console.log(docData);
//   });
// });

const formSubmit = document.querySelector("#wish-form");
const selfiePath = document.querySelector("#selfiePath");
const picsPath = document.querySelector("#picsPath");
const videoPath = document.querySelector("#videoPath");
const wishDb = db.collection("wishes");
const storageService = firebase.storage();

let selectedFiles;
let picsArray = [];
let selfie, video;

wishDb.onSnapshot(snapshot => {
  let changes = snapshot.docChanges();

  changes.forEach(change => {
    let wishObject = change.doc.data();
    // console.log(wishObject);
    displayWish(wishObject);
  })
});

function displayWish(wishObject) {

  let content = document.createElement('div');
  content.classList.add("content");
  let contentDetails = document.createElement('div');
  contentDetails.classList.add('content-details');
  let contentImgHolder = document.createElement('div');
  contentImgHolder.classList.add('content-img-holder');
  let contentImg = document.createElement('img');
  contentImg.classList.add('content-img');
  let imgURL;
  // console.log(wishObject.selfiPath);
  if(wishObject.selfiPath) {
    storageService.ref().child(`selfies/${wishObject.selfiPath}`).getDownloadURL().then(function(url) {
      // console.log(url);
      imgURL = url;
      contentImg.src = imgURL;
    }).catch(err => {console.log(err);});
  } else {
    console.log('a');
    contentImg.src = './assets/imgs/other/user.png';
  }
  contentImgHolder.appendChild(contentImg);

  let contentInfo = document.createElement('div');
  contentInfo.classList.add('content-info');
  let h2 = document.createElement('h2');
  h2.innerText = wishObject.name;
  console.log(wishObject.name);
  let h4 = document.createElement('h4');
  h4.innerText = wishObject.wish;
  contentInfo.appendChild(h2);
  contentInfo.appendChild(h4);
  contentDetails.appendChild(contentImgHolder);
  contentDetails.appendChild(contentInfo);

  let contentPics = null;
  if(wishObject.picsPath) {
    contentPics = document.createElement('div');
    contentPics.classList.add('content-pics');
    contentPics.classList.add('row');
    for(let pic of wishObject.picsPath) {
      console.log(pic);
      let contentPicHolder = document.createElement('div');
      contentPicHolder.classList.add('content-pic-holder');
      contentPicHolder.classList.add('col-lg-4');
      contentPicHolder.classList.add('col-md-4');
      contentPicHolder.classList.add('col-sm-6');
      let contentPic = document.createElement('img');
      contentPic.classList.add('content-pic');
      storageService.ref().child(pic).getDownloadURL().then(function(url) {
        contentPic.src = url;
      }).catch(err => {console.log(err);});
      contentPicHolder.appendChild(contentPic);
      contentPics.appendChild(contentPicHolder);
    }
  }

  let contentVideo = document.createElement('div');

  if (wishObject.videoPath) {
    console.log(wishObject.videoPath);
    storageService.ref().child(`videos/${wishObject.videoPath}`).getDownloadURL().then(function(url) {
      // contentPic.src = url;
      console.log(url);
      contentVideo.innerHTML = `
      <video
          id="my-video"
          class="video-js"
          controls
          preload="auto"
          poster="./assets/imgs/other/slide3.jpg"
          data-setup="{}"
        >
          <source id="source" src="${url}" />
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank"
              >supports HTML5 video</a
            >
          </p>
        </video>
  `;
    }).catch(err => {console.log(err);});
    
  }

  content.appendChild(contentDetails);
  content.appendChild(contentPics);
  content.appendChild(contentVideo);
  document.querySelector('.content-main-div').appendChild(content);
}

selfiePath.addEventListener("change", uploadSelfie);
picsPath.addEventListener("change", uploadPics);
videoPath.addEventListener("change", uploadVideo);

function uploadVideo(e) {
  video = e.target.files[0];
  console.log(video);
}

function uploadSelfie(e) {
  selfie = e.target.files[0];
  // console.log(selfie);
}

function uploadPics(e) {
  selectedFiles = e.target.files;
  if (selectedFiles.length > 1) {
    for (let pic of selectedFiles) {
      // console.log(pic);
      picsArray.push(pic);
    }
  } else {
    picsArray.push(e.target.files[0]);
  }
  // console.log(picsArray);
  // console.log(selectedFiles);
}

function submitWish(e) {
  e.preventDefault();
  let selfiName, videoName;
  let id = wishDb.doc().id;

  if(selfie) {
    selfiName = `${id}__${selfie.name}`;
  } else {
    selfiName = null;
  }
  // console.log(selfiName);

  if (video) {
    console.log(video.name);
    videoName = `${id}__${video.name}`;
  } else {
    videoName = null;
  }

  console.log(videoName);

  let picsName = [];

  for (let pic of picsArray) {
    // console.log(pic);
    picsName.push(`pics/${id}__${pic.name}`);
  }
  // console.log(picsName);

  let data = {
    name: document.querySelector("#userName").value,
    selfiPath: selfiName,
    picsPath: picsName,
    videoPath: videoName,
    wish: document.querySelector("#wish").value,
  };
  // console.log(data);

  // selfi
  if (selfiName) {
    storageService.ref(`selfies/${selfiName}`).put(selfie);
    console.log("saving of selfie done");
  } else {
    console.log("Selfie not uploaded!!!");
  }

  if (picsName) {
    console.log("a");
    for (let i = 0; i < picsArray.length; i++) {
      console.log(picsArray[i]);
      console.log(picsName[i]);

      storageService.ref(`${picsName[i]}`).put(picsArray[i]);
      console.log("saving of vieo done");
    }
  } else {
    console.log("pics not uploaded!!!");
  }

  if (videoName) {
    const storageServiceRef = storageService.ref(`videos/${videoName}`);
    const task = storageServiceRef.put(video);
    task.on(
      "state_changed",
      function progress(snap) {
        let percent = (snap.bytesTransferred / snap.totalBytes)*100;
        const uploader = document.querySelector('#uploader');
        // percent = Math.ceil(percent);
        // console.log(snap.bytesTransferred);
        // console.log(snap.totalBytes);
        // console.log(percent);
        uploader.value = percent;
      },
      function err(error) { console.log(err);},
      function complete() {
        console.log('completed');
        wishDb.add(data);
        var alert = document.querySelector("#alert");
        alert.style.visibility = "visible";

        setTimeout(() => {
          alert.style.visibility = "hidden";
        }, 2000);
        formSubmit.reset();
      }
    );
    console.log("saving of vieo done");
  } else {
    console.log("video not uploaded!!!");
    wishDb.add(data);
    var alert = document.querySelector("#alert");
    alert.style.visibility = "visible";
    setTimeout(() => {
      alert.style.visibility = "hidden";
    }, 2000);
    formSubmit.reset();
  }

}

formSubmit.addEventListener("submit", submitWish);
