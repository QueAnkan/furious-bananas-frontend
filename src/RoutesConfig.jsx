import { createHashRouter } from "react-router-dom";
import Root from "./routes/Root.jsx";
import Home from "./routes/Home.jsx";
// import Greetings from "./routes/Greetings.jsx";
// import ErrorPage from "./routes/ErrorPage";

const router = createHashRouter ([

	{
		path: '/',
		element: <Root/>,
	
		children: [
			{
				path: '/',
				element: <Home/>,
			}/* , 

			{
				path: 'greetings',
				element: <Greetings/>
			} */
		]
			
				// errorElement: <ErrorPage/>
	}

])

export {router}
