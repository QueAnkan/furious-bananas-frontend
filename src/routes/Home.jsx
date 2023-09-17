import { useState, useEffect } from "react";
import AWS from 'aws-sdk';

//obs ta bort information
AWS.config.update({
	accessKeyId: "",
	secretAccessKey: "",
	region: 'eu-north-1',
	bucket: 'nutestarjaglitebara'
});

const s3 = new AWS.S3();

const Home = () => {
	// statevariabler för att hantera: 
	//1. file är vilken fil som är vald
	//2. images är en array med filnamn(för att kunna ta fram rätt url till img-taggen längre ner.
	//3. textMessage sätter en time:at meddelande när man laddat upp en fil)
	const [file, setFile] = useState('')
	const [images, setImages] = useState([]);
	const [textMessage, setTextMessage] = useState(null)

	useEffect(() => {
		getImages()
	}, []);



	const uploadfile = () => {
		const postUrl = 'https://8a7hysrefd.execute-api.eu-north-1.amazonaws.com/dev/upload'

		//Skickar först ett POST för att få ut "presigned url"(be chatGPT förklara) som man sedan kan använda för att skicka PUT request som jag fattat det.

 // Logga filnamn och filtyp här för att inspektera dem
 console.log('File name:', file.name);
 console.log('File type:', file.type);

 // Skapa en JSON-sträng för att skicka till servern
//  const requestBody = { key: `${encodeURIComponent(file.type)}/${encodeURIComponent(file.name)}` };

// >>>>>>TESTA ATT LOGGA:<<<<<<
console.log('Vad vi skickar in i body till servern',JSON.stringify({ key: `${encodeURIComponent(file.name)}` }));
// För att se exakt vad vi skickar in i body


		fetch(postUrl, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			  },
			body: JSON.stringify({ key: `${encodeURIComponent(file.name)}` })
		})

			.then((res) => res.json()) //ser ut såhär {"URL": url} i res
			.then((res) => {
				console.log('Vårt response från post är: ', res.body);
				
				const response = res.body.replace('\"', '"')
				const jsonResponse = JSON.parse(response)
		
				fetch(jsonResponse.URL, {
					method: 'PUT',
					mode: 'cors',
					headers: {
						'Content-Type': file.type,
					  },
					body: file
				})
					.then((res) => {
						console.log(res);
						getImages(); //<-- för att få updaterad image-array
					})
					.catch((err) => console.log(err))
			})
			.catch((err) => console.log(err))
			console.log('Detta är body-innehållet i loggat efter PUT', file);
		const visible = setTimeout(() => {
			setTextMessage("Hurra! Din fil har blivit uppladdad!")
		}, 500)

		const hidden = setTimeout(() => {
			setTextMessage(null)
		}, 4000)

		return () => {
			clearTimeout(visible)
			clearTimeout(hidden)
		}
	}
	

	function getImages() {

		const params = {
			Bucket: 'nutestarjaglitebara',
		};

		s3.listObjectsV2(params, (err, data) => {
			if (err) {
				console.error('Fel vid hämtning av bilder:', err);
			} else {

				const imageList = data.Contents.map((obj) => obj.Key); //<-- listar alla filnamn
				return setImages(imageList);
			}
		});

	};

	const updateFile = (fileInfo) => {
		console.log("fileinfo is: " + JSON.stringify(fileInfo));

		setFile(fileInfo);
	}



	return (
		<>
			<div className="div-add-picture">
				<label htmlFor="input-add-picture">Lägg upp en bild här</label>
				<input id="input-add-picture" type="file" accept="image/*" onChange={(event) => updateFile(event.target.files[0])} />
				<button className="button-add-picture" type="button" onClick={() => { uploadfile(); getImages() }}>Lägg till bild</button>
			</div>
			<div>
				<p>{textMessage}</p>
				<ul className="image-container">
					{images.map((image, index) => (
						<li key={index}><img className="image-box" src={`http://nutestarjaglitebara.s3-website.eu-north-1.amazonaws.com/${image}`}></img></li>
					))}
				</ul>
			</div>

		</>
	)

}

export default Home


"{\"URL\":\"https://nutestarjaglitebara.s3.eu-north-1.amazonaws.com/20200725_094033.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUX3D4XEXBYUOBQTR%2F20230917%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20230917T173442Z&X-Amz-Expires=60&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiAFVcr8enaQGjNQmFTxZGNzbTwIYsRV6IofETa320pTUwIgWCIPfXkNpSXzBk0JzYWmCt%2BSh%2BDJz43fdmmDGthVBI8qlQMIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwzMjYwOTAxNDQwNDYiDFXZrDndczbT8yXNmSrpAjjBXyHUPhLwsXlJZgDm2vPJTLqLizl2AqBiekKl1U5xFzGkuZVQHf0bCYQ5lVSCGwOhXPJVsVPVqBYj406LXIArJ9d90B8HZNC5R7ddp3ZYSA4NoeUH%2FQrwtJzpWM5GqOmmE6QH8JDKcc0T6DeQJUPwPx3g%2FYBUZpLjxDOqse6IZZ4Gqq7F8MoucnLcO7uJkyJElnZjQMCzRipI5rF7GrmWdqiAUmLSSavXXLLvhQUrkSiHDJUeGAx%2FR7%2BSxkOojxoxZ2846qdHqcJbmMATnA9FJADeweTQ%2Fo1G%2BTlz2h0qf2e0MSt7EFL%2BucNyDFPQevj%2Fe%2FULKjqvlf5y9xeSMny8TqRt9rmN8FXOwYdW82vsb%2Bv6RIBBVf2iNGjzBc6Ku3EOTjE%2Fb8KTcB6wOKDz8Ix6u7a7sxBKyyGiEzLbr%2BLYKlSEQxIzYL33Gsz2dIdTdfndMCahCIK1FBXDTqFN2ynNxWIWMR1S6SEwsfGcqAY6ngGlPeelzkdRx4moHUQZDzRBWfD0paU3%2BH%2B%2FjorMoJN4%2Fpg2fZZcjt5wsdKBhJo%2BZ6bEHZe1On10tFg%2ByADmz6Q8yKVuuxRXJvfxeuzY7SH13PVgHXHxKyf%2FqVdHylSeppB6xdEXpPEj91HJnCLO%2BxJht5lgTIUknwy67FKCsqG4%2BXp0rwZRbE87Tv14%2BFhL5pJr46n8NfUplejo9AapqQ%3D%3D&X-Amz-Signature=93b677edecb3e896a4d32a55051340236c765d4678e161ef131772e15b0767e2&X-Amz-SignedHeaders=host&x-id=PutObject\"}"



