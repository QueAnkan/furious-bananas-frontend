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


const Home = ({ pictureMode }) => {
	const [file, setFile] = useState('')
	const [images, setImages] = useState([]);
	const [textMessage, setTextMessage] = useState(null)
	const [name, setName] = useState('')
	const [greeting, setGreeting] = useState('')
	const [greetingList, setGreetingList] = useState([])
	const [count, setCount] = useState(0)


	useEffect(() => {

		async function fetchFileContent(fileName) {
			return new Promise((resolve, reject) => {
				s3.getObject({ Bucket: 'nutestarjaglitebara', Key: fileName }, (error, data) => {
					if (error) {
						reject(error);
					} else {
						const fileContent = data.Body.toString('utf-8');
						const jsonBody = JSON.parse(fileContent)
						// console.log('jsonBody: ', jsonBody);
						resolve({ fileName: fileName.replace('greetings/', '').replace('.txt', ''), content: jsonBody.fileContent });
					}
				});
			});
		}

		async function getImages() {
			const params = {
				Bucket: 'nutestarjaglitebara',
			};

			try {
				const data = await new Promise((resolve, reject) => {
					s3.listObjectsV2(params, (err, data) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				});

				const validExtensions = ['.jpg', '.jpeg', '.png'];
				const imageList = data.Contents
					.map((obj) => obj.Key)
					.filter((key) => {
						const lowerCaseKey = key.toLowerCase();
						return validExtensions.some((ext) => lowerCaseKey.endsWith(ext));
					});
				const textFileList = data.Contents.map((obj) => obj.Key).filter((key) => key.endsWith('.txt'));

				const greetingsObjects = await Promise.all(textFileList.map((name) => fetchFileContent(name)));
				// console.log('greetingsObjects: ', greetingsObjects);
				setImages(imageList);
				setGreetingList(greetingsObjects)
			} catch (error) {
				console.error('Fel vid hämtning av bilder:', error);
			}
		}

		getImages()
	}, [count]);

	// console.log('pictureMode är: ', pictureMode);

	const uploadfile = (type) => {
		const postUrl = 'https://8a7hysrefd.execute-api.eu-north-1.amazonaws.com/dev/upload'

		let fileName = null
		let fileType = null
		let uploadBody = null
		let folderName = null

		//Skickar först ett POST för att få ut "presigned url"(be chatGPT förklara) som man sedan kan använda för att skicka PUT request som jag fattat det.
		if (pictureMode && type === 'image') {
			fileName = file.name
			fileType = file.type
			uploadBody = file
			folderName = 'pictures/'
		} else if (!pictureMode && type === 'text') {
			fileName = `${name}.txt`
			fileType = 'text/plain'
			folderName = 'greetings/'
			const body = {
				// key: name + fileName,
				fileContent: greeting,
			}
			uploadBody = JSON.stringify(body);
		}

		const objectKey = folderName + fileName;

		// Logga filnamn och filtyp här för att inspektera dem
		// console.log('File name:', fileName);
		// console.log('File type:', fileType);
		// console.log('uploadBody:', uploadBody);


		// Skapa en JSON-sträng för att skicka till servern
		//  const requestBody = { key: `${encodeURIComponent(file.type)}/${encodeURIComponent(file.name)}` };

		// console.log('Vad vi skickar in i body till servern', JSON.stringify({ key: `${encodeURIComponent(fileName)}` }));


		fetch(postUrl, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ key: `${(folderName)}${(fileName)}` })
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
						'Content-Type': fileType,
					},
					body: uploadBody,
					key: objectKey
				})
					.then((res) => {
						console.log(res);
						setCount(count + 1)
					})
					.catch((err) => console.log(err))
			})
			.catch((err) => console.log(err))
		console.log('Detta är body-innehållet i loggat efter PUT', file);
		setFile(null)
		setGreeting('')
		setName('')
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


	const updateFile = (fileInfo) => {
		// console.log("fileinfo is: " + JSON.stringify(fileInfo));

		setFile(fileInfo);
	}


	if (pictureMode) {
		return (
			<>
				<div className="div-add-picture">
					<label htmlFor="input-add-picture">Lägg upp en bild här</label>
					<input id="input-add-picture" type="file" accept="image/*" onChange={(event) => updateFile(event.target.files[0])} />
					<button className="button-add-picture" type="button" onClick={() => { uploadfile('image') }}>Lägg till bild</button>
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
	} else {
		return (
			<>
				<div className="div-add-picture">
					<label htmlFor="input-name">Skriv ditt namn här</label>
					<input type="text" id="input-name" value={name} onChange={(event) => setName(event.target.value)} />
					<label htmlFor="input-add-greeting">Lägg upp din hälsning här</label>
					<textarea name="name" cols="30" rows="10" id="input-add-greeting" value={greeting} onChange={(event) => setGreeting(event.target.value)}></textarea>
					<button className="button-add-greeting" type="button" onClick={() => { uploadfile('text') }}>Lägg till hälsning</button>
				</div>
				<div>
					<p>{textMessage}</p>
					<ul className="greeting-container">
						{greetingList.map((greetingObject, index) => (
							<li key={index} className="greeting">
								<h3>{greetingObject.fileName}</h3>
								<p>{greetingObject.content}</p>
							</li>
						))}
					</ul>
				</div>
			</>
		)
	}
}

export default Home




