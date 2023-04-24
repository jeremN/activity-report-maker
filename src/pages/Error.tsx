import { Button } from '@mui/material';
import { useRouteError, Link as RouterLink } from 'react-router-dom';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Une erreur inconnue s'est produite, veuillez revenir en arrière ou recharger la page.</p>
			<Button variant="contained" component={RouterLink} to={'/'}>
				Retourner à l'accueil
			</Button>
		</div>
	);
}
