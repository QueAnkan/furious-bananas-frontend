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

		fetch(postUrl, {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify({ key: `${file.type}/${file.name}` })
		})

			.then((res) => res.json()) //ser ut såhär {"URL": url} i res
			.then((res) => {
				console.log(res);
				fetch(res.URL, {
					method: 'PUT',
					mode: 'cors',
					body: file
				})
					.then((res) => {
						console.log(res);
						getImages(); //<-- för att få updaterad image-array
					})
					.catch((err) => console.log(err))
			})
			.catch((err) => console.log(err))

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
		console.log(fileInfo);

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