import React, { useState } from "react";
// import Button from "@material-ui/core/Button";
import { storage, db } from "../../firebase";
import "./upload.css";
import { Button } from "react-bootstrap";

function Imageupload({ username, avatar }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  let lat = 0;
  let lon = 0;

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(lon);
      console.log(lat);
    });

    uploadTask.on(
      "state_changes",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error Function
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              caption: caption,
              imageUrl: url,
              username: username,
              avatar: avatar,
              longitude: lon,
              latitude: lat,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
            // setLat(0);
            // setLon(0);
          });
      }
    );
  };

  return (
    <div className="img-upload">
      <input
        type="text"
        placeholder="Enter a caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button var="primary" onClick={handleUpload}>
        Upload
      </Button>
      <progress value={progress} max="100" />
    </div>
  );
}

export default Imageupload;
