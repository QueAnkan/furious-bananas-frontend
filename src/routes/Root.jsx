import { Outlet, NavLink } from "react-router-dom"



const Root = () => {

	return (
		<div className="root-container">
			<h1>Vår minnessida</h1>
			<nav>
                <NavLink to="/" className="navlink"> Bilder </NavLink>
                <NavLink to="/greetings" className="navlink"> Hälsningar </NavLink>

            </nav>
			<main className="main">
				<Outlet/>
			</main>
		
		</div>
		
	)
}
console.log('root')

export default Root