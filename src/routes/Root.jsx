import { useState } from "react"
import Home from "./Home.jsx"


const Root = () => {
	const [pictureMode, setPictureMode] = useState(true)

	return (
		<div className="root-container">
			<h1>Vår minnessida</h1>
			<nav>
				<button className={pictureMode ? 'mode-button active' : 'mode-button'} onClick={() => setPictureMode(true)}> Bilder </button>
				<button className={!pictureMode ? 'mode-button active' : 'mode-button'} onClick={() => setPictureMode(false)}> Hälsningar </button>

			</nav>
			<main className="main">
				<Home pictureMode={pictureMode} />
			</main>

		</div>

	)
}
console.log('root')

export default Root