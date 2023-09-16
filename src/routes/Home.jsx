import { useState, useEffect } from "react";
import axios from "axios";
// import { parseString } from "xml2js";

const getfiles = (query) => {
	const url = 'https://8a7hysrefd.execute-api.eu-north-1.amazonaws.com/dev/s3?key=' + query
	axios.get(url, { responseType: 'blob' }) //<-- ändrat här
	.then((response) => {
		// Hämta event-objektet från svaret
		console.log('här är responset', response);
		// const eventObject = response.data;
		// console.log('Här är vår data', eventObject);
	  
		// const fileNames = eventObject.body
		// console.log(fileNames);

		const binaryData = response.data;
console.log('binaryData:', binaryData);
		// Anta att content type är 'image/jpeg' som ett exempel
		const contentType = response.headers['content-type'];
		// const contentType = 'image/jpeg';
		console.log('contentType är: ', contentType);
  
		// Skapa en blob från binärdatan
		const blob = new Blob([binaryData], { type: contentType });
  console.log("blob",blob);
		// Skapa en objekt-URL från blobben för att visa bilden (eller använd FileReader för andra filtyper)
		const imageUrl = URL.createObjectURL(blob);
		console.log('bild-url:en är: ', imageUrl);
  
		// Visa bilden i en <img> tag
		const imgElement = document.createElement('img');
		imgElement.src = imageUrl;
		document.body.appendChild(imgElement);
  console.log(imgElement);
		// Alternativt, om du vill tolka binärdata som text, använd FileReader
		// const textDecoder = new TextDecoder('utf-8'); // Ange teckenkodning
		// const textData = textDecoder.decode(binaryData);
		// console.log(textData);


	  })
	  .catch((error) => {
		console.error('Error fetching data:', error);
	  });
}


const uploadfiles = (query, file) => {
	const url = 'https://8a7hysrefd.execute-api.eu-north-1.amazonaws.com/dev/s3?key=' + query

  // Skapa ett FormData-objekt
  const formData = new FormData();

  // Lägg till filen i FormData
  formData.append('file', file);

	axios.put(url, formData, {
		headers: {
			'Content-Type': file.type
		},
	})
	.then((response) => {
		console.log(response);
		return {
			statusCode: '200',
			message: 'Upload success!'
		}
	})
	.catch((error) => {
		console.error('Error uploading data:', error);
	})
}

const showFile = (fileInfo, setFile) => {
	console.log(fileInfo);
	
    setFile(fileInfo);
}


const Home = () => {
	const [eventData, setEventData] = useState(null);
	const [updatedData, setUpdatedData] = useState(0)
	const [file, setFile] = useState('')

	
	useEffect(() => {
	  // Gör en GET-förfrågan till ditt API
	  getfiles('nutestarjaglitebara/buzzlightyear.jpeg')
	//   setEventData(allFiles)
	
	}, [updatedData]);

	// console.log('Här är vår eventData', eventData);

	return(
		<>
			<div className="div-add-picture">
				<label htmlFor="input-add-picture">Lägg upp en bild här</label>
				<input id="input-add-picture" type="file" accept="image/*"  onChange={(event) => showFile(event.target.files[0], setFile)}/>
				<button className="button-add-picture" type="button" onClick={() => uploadfiles(`nutestarjaglitebara/${file.name}`, file)}>Lägg till bild</button>
				
			</div>
			{/* {eventData.map(file => (
				<div>
					<p>{file.Key}</p>
				</div>
			)) } */}
		
		</>		
	)
	
}

export default Home