import { useState, useEffect } from "react";
import axios from "axios";
// import { parseString } from "xml2js";

const Home = () => {
	const [eventData, setEventData] = useState(null);
	const [updatedData, setUpdatedData] = useState(0)

	useEffect(() => {
	  // Gör en GET-förfrågan till ditt API
	  axios.get('https://51wbggo35m.execute-api.eu-north-1.amazonaws.com/dev/furious-bananas-bucket'
	  )
	  .then((response) => {
		  // Hämta event-objektet från svaret
		  const eventObject = response.data;
		  //   const parsedObject = JSON.stringify(eventObject, null, 2)
		  console.log('Här är vårt eventObject', eventObject);
		//   parseString(eventObject, function (err, result) {
		// 	console.log(result);
		// });
		//   if (eventObject) {
		// 	// Filtrera ut alla filer med content typ "image/jpeg"
		// 	const filteredFiles = eventObject.filter((file) => file.contentType === 'image/jpeg');
		//   }
		
		// const filteredFiles = Object.keys(eventObject).filter((fileName) => {
		// 	return eventObject[fileName].contentType === 'image/jpeg';
		// });
		// 	setEventData(filteredFiles);
		})
		.catch((error) => {
		  console.error('Error fetching data:', error);
		});
	
	}, [updatedData]);

	// console.log('Här är vår eventData', eventData);

	return(
		<>
			<div className="div-add-picture">
				<label htmlFor="input-add-picture">Lägg upp en bild här</label>
				<input id="input-add-picture" type="file" accept="image/*"/>
				<button className="button-add-picture" type="button" onClick={() => setUpdatedData(updatedData + 1)}>Lägg till bild</button>
				
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