// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiQYWGMtwN6bLoYwN6aLj3IaQj9FBtUIQ",
  authDomain: "storage-2-4445c.firebaseapp.com",
  projectId: "storage-2-4445c",
  storageBucket: "storage-2-4445c.appspot.com",
  messagingSenderId: "291069857011",
  appId: "1:291069857011:web:fee04b805faf056007bb86",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

let upload = document.getElementById("upload");
upload.addEventListener("click", () => {
  let file = document.getElementById("file");
  const mountainsRef = ref(storage, `images/${file.files[0].name}`);
  console.log(file.files[0]);

  uploadBytes(mountainsRef, `images/${file.files.name}`).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });

  const uploadTask = uploadBytesResumable(mountainsRef, file.files[0]);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      let notice = document.getElementById("notice");
      notice.innerText = " im updated";
      let progresss = document.getElementById("progresss");
      progresss.innerHTML = `<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${Math.ceil(
        progress
      )}%">${Math.ceil(progress)}%</div>`;

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log(error, "error in upload time");
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);

        let downimg = document.getElementById("downimg");
        downimg.src = downloadURL;
      });
    }
  );
});

let down = document.getElementById("down");
down.addEventListener("click", () => {
  getDownloadURL(`images/${file.files.name}`)
    .then((url) => {
      // Insert url into an <img> tag to "download"
      console.log("img is downloaed", url);
      let look = document.getElementById("look");
      look.src = url;
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    });
});

function deleteimg() {
  // Create a reference to the file to delete
  const desertRef = ref(storage, `images/beach.jpg`);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      // File deleted successfully
      console.log(desertRef, "file is delete");
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error, "error is come delete point par");
    });
}

let del = document.getElementById("del");
del.addEventListener("click", deleteimg);

let listf = document.getElementById("listf");

function fileList() {
  // Create a reference under which you want to list
  const listRef = ref(storage, `images/${file.files.name}`);

  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      console.log("im running in file list");
      res.prefixes.forEach((images) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
        console.log(itemRef, "all the list item");
        // All the items under listRef.
      });
    })
    .catch((error) => {
      console.log(error, "error in list item");
      // Uh-oh, an error occurred!
    });
}

listf.addEventListener("click", fileList);
