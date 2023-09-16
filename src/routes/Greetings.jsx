/* import { useEffect, useState } from "react";
import axios from "axios"; 

const Greetings = () => {
	const [text, setText] = useState(''); 
	const [eventData, setEventData] = useState(null); 
	const [updatedData, setUpdatedData] = useState(0); 

	useEffect(() => {
		// Gör en GET-förfrågan till ditt API
		axios.get('https://51wbggo35m.execute-api.eu-north-1.amazonaws.com/dev/furious-bananas-bucket')
		  .then((response) => {
			// Hämta event-objektet från svaret
			const eventObject = response.data;
			//if(eventObject) {
			//Filtera ut alla filer med content typ "text/plain"
			//const filteredFiles = eventObject.filter((file) => file.contentType === 'text/plain'); 
			//	setEventData(filteredFiles); 
			//}
		  })
		  .catch((error) => {
			console.error('Error fetching data:', error);
		  });
	  }, [updatedData]);

	return (
			<div className="div-add-text">
				<label htmlFor="input-add-text"> Lägg upp en text här</label>
				<textarea 
					name="text-input" 
					id="input-add-text" 
					cols="30" 
					rows="3" 
					wrap="soft"
					//value={text}
					></textarea>
				<button className="button-add-text" type="button" onClick={() => setUpdatedData(updatedData + 1)}>Lägg till text</button>
			</div>

)
}

export default Greetings */