
import { Component, useEffect, useState } from 'react'
import { API_URL } from './constants'


import './app.css'

import AWS from 'aws-sdk';

//obs ta bort information
AWS.config.update({ 
  accessKeyId: "", 
  secretAccessKey: "", 
  region: 'eu-north-1', 
  bucket: 's3buckergrupp5'
  }); 

const s3 = new AWS.S3();



function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [textMessage, setTextMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getImages()
  }, []);


  console.log(images);

  function onFileChange(event) {
   setSelectedImage(event.target.files[0])
  }  

  async function onFileUpload() {
    const url = `${API_URL}`
  
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({key: `${selectedImage.type}/${selectedImage.name}`})
     })
  
     .then((res) => res.json())
     .then((res) => {
      console.log(res);
      fetch(res.URL, {
        method: 'PUT',
        mode: 'cors',
        body: selectedImage
      })
      .then((res) => {
        console.log(res);
        getImages(); // Kalla på getImages efter lyckad uppladdning
      })
      .catch((err) => console.log(err))
     })
     .catch((err) => console.log(err))

     const visible =   setTimeout(() => {
      setTextMessage("Din fil har blivit uppladad!")
    }, 500)

    const hidden =   setTimeout(() => {
      setTextMessage(null)
    }, 4000)

     return () => {
       clearTimeout(visible)
       clearTimeout(hidden)
      }
  }
  
  function getImages() {
    getImages = () => {
      const params = {
        Bucket: 's3buckergrupp5',
      };
  
      s3.listObjectsV2(params, (err, data) => {
        if (err) {
          console.error('Fel vid hämtning av bilder:', err);
        } else {
  
          const imageList = data.Contents.map((obj) => obj.Key);
          return setImages(imageList);
        }
      });
    };
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };


  const filteredImages = images.filter(image =>
    image.toLowerCase().includes(searchTerm.toLowerCase()));


  // Render
    return (
      <div className="center-box">
      <header className="header-container">
          <label htmlFor="input-file" className='btn-file' > Välj fil</label>
          <input id='input-file' className='file' type="file" onChange={onFileChange} accept='image/*' />
          <button className='btn-loading' onClick={() => {onFileUpload(); getImages()}}>Ladda upp</button>

        <h1 className='heading'>Bildvisare</h1>

          <input className='sort-item' type="text" placeholder="Söka efter bilder" value={searchTerm} onChange={handleSearchChange}
      />
      </header>
  
      <div>
          <p>{textMessage}</p>
      <ul className="image-container">
          {filteredImages.map((image, index) => (
            <li key={index}><img className="image-box" src={`http://s3buckergrupp5.s3-website.eu-north-1.amazonaws.com/${image}`}></img></li>
          ))}
      </ul>
      </div>
    </div>
    )
}

export default App
