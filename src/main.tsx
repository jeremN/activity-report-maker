import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import ErrorPage from './pages/Error';
import Root from './pages/Root';
import { CraContextProvider } from './contexts/craContext';

const Viewer = React.lazy(() => import('./pages/Viewer'));

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
		element: <Viewer />
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<CssBaseline>
			<RouterProvider router={router} />
		</CssBaseline>
	</React.StrictMode>
);
