import { type RouteObject } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../pages/Error';
import RootPage from

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,

	}
] as const;
