// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { createWorker } from "tesseract.js";
// import "./App.css";
// function App() {
//   const [ocr, setOcr] = useState("");
//   const [imageData, setImageData] = useState(null);
//   const [progress, setProgress] = useState(0)
//   const worker = createWorker({
//     logger: (m) => {
//       // console.log(m);
//       setProgress(parseInt(m.progress * 100));

//     },
//   });
//   const convertImageToText = async () => {
//     console.log("reached")
//     if (!imageData) return;
//     await worker.load();
//     await worker.loadLanguage("eng");
//     await worker.initialize("eng");
//     const data=await worker.recognize(imageData);
//     // console.log("data -----",data);
//     const {
//       data: { text },
//     } = await worker.recognize(imageData);
//     if(text!=undefined)
//      setOcr(text);
//   };

//   useEffect(() => {
//     convertImageToText();
//   }, [imageData]);

//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     // console.log("file name is =>",file);
//     if(!file)return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const imageDataUri = reader.result;
//       // console.log({ imageDataUri });

//     // console.log("imageDataUri is =>",imageDataUri);
//       setImageData(imageDataUri);
//       console.log("image uploaded");
//     };

//     reader.readAsDataURL(file);
//   }
//   return (
//     <div className="App">
//       <div>
//         <p>Choose an Image</p>
//         <input
//           type="file"
//           name=""
//           id=""
//           capture="environment"
//           onChange={handleImageChange}
//           accept="image/*"
//         />
//       </div>
//       {progress < 100 && progress > 0 && <div>
//         <div className="progress-label">Progress ({progress}%)</div>
//         <div className="progress-bar">
//           <div className="progress" style={{width: `${progress}%`}} ></div>
//         </div>
//       </div>}
//       <div className="display-flex">
//         <img src={imageData}  style={{width:"300px",height:"300px"}}alt="" srcset="" />
//         <p>{ocr}</p>
//       </div>
//     </div>
//   );
// }
// export default App;

import heic2any from "heic2any";
import React from "react";
import Tesseract from "tesseract.js";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [text, setText] = React.useState("");
  const [progress, setProgress] = React.useState(0);

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        // console.log(m);
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        console.log(result.data);
        setText(result.data.text);
        setIsLoading(false);
      });
  };

  const handleImageClick = (e) => {
 
    const files = e.target.files;
    if (files?.length) {
      const file = files[0];
      console.log("uploaded file: ", file);
      if (
        file.type.toLowerCase() === "image/heic" ||
        file.name.toLowerCase().includes(".heic")
      ) {
        // toggleWaiting();
        heic2any({ blob: file, toType: "image/jpg", quality: 1 }).then(
          (newImage) => {
            console.log("new image:", newImage);
            const url = URL.createObjectURL(newImage);
            console.log("new image after:", url);
            // toggleWaiting();
            setImage(newImage);
          }
        );
      }else{
        setImage(URL.createObjectURL(e.target.files[0]))
      }
    } else {
      console.error("No file specified");
    }

    // setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <h1 className="text-center py-5 mc-5">Image To Text</h1>
          )}
          {isLoading && (
            <>
              <progress className="form-control" value={progress} max="100">
                {progress}%{" "}
              </progress>{" "}
              <p className="text-center py-0 my-0">Converting:- {progress} %</p>
            </>
          )}
          {!isLoading && !text && (
            <>
              <input
                type="file"
                onChange={(e) => handleImageClick(e)}
                className="form-control mt-5 mb-2"
              />
              <input
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-5"
                value="Convert"
              />
            </>
          )}
          {!isLoading && text && (
            <>
              <textarea
                className="form-control w-100 mt-5"
                rows="30"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

// if (
//   file.type.toLowerCase() === "image/heic" ||
//   file.name.toLowerCase().includes(".heic")
// ) {
//   toggleWaiting();
//   heic2any({ blob: file, toType: "image/jpg", quality: 1 }).then(
//     (newImage) => {
//       console.log("new image:", newImage);
//       const url = URL.createObjectURL(newImage);
//       toggleWaiting();
//       addNewImage(url);
//     }
//   );
// }
