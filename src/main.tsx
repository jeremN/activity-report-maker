import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import ErrorPage from './pages/Error';
import Root from './pages/Root';
import Viewer from './pages/Viewer';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />
	},
	{
		path: '/:id',
		element: <Viewer />
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ScopedCssBaseline>
			<RouterProvider router={router} />
		</ScopedCssBaseline>
	</React.StrictMode>
);
