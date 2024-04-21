import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Password from "./Password";
import { AuthProvider } from "./AuthProvider";

const router = createBrowserRouter([
    {
       	path: "/",
		element: <Home />
    },

    {
      	path: "/login",
      	element: <Login />
    },

	{
		path: "/register",
		element: <Register />
  	},

	{
		path: "/password",
		element: <Password />
  	}
]);
  
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
    </React.StrictMode>
);