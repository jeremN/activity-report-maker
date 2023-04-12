import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import ErrorPage from './pages/Error';
import Viewer from './pages/Viewer';
import Root from './pages/Root';
import { CraContextProvider } from './contexts/craContext';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<CraContextProvider>
				<Root />
			</CraContextProvider>
		),
		errorElement: <ErrorPage />
	},
	{
		path: '/:id',
		element: <Viewer />,
		errorElement: <ErrorPage />
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<CssBaseline>
			<RouterProvider router={router} />
		</CssBaseline>
	</React.StrictMode>
);
