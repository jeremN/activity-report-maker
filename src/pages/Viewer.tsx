import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';

import { PDFDocument } from '../components/PDF/PDFDocument';

import { useLocalStorage } from '../hooks/useLocalStorage';

type Company = {
	name: string;
	address: string;
	zipCode: string;
	city: string;
	phone: string;
	email: string;
	website: string;
	logo?: string;
};
type Client = Omit<Company, 'logo'>;
type Cra = {
	id: string;
	client: Client;
	user: Company;
	payload: {
		month: number;
		year: number;
		selectedDays: Date[];
		totalSelected: number;
		totalWorkDays: number;
	};
};
type PDFList = Cra[];

export default function Viewer() {
	let { id } = useParams();
	const [storedPDF, __] = useLocalStorage<PDFList>('cra-pdf', []);
	const [cra, setCra] = React.useState<Cra | undefined>(
		() => storedPDF.filter(pdf => pdf.id === id)?.[0] || undefined
	);

	React.useEffect(() => {
		const currentCra = storedPDF.filter(pdf => pdf.id === id)?.[0];
		setCra(currentCra);
	}, []);

	return (
		<main
			style={{
				padding: '32px 32px',
				flexBasis: 'calc(100% - 240px)',
				minHeight: '100%',
				overflow: 'hidden',
				backgroundColor: '#f5f6fb'
			}}>
			<Box sx={{ backgroundColor: '#f5f6fb', minHeight: '100vh' }}>
				<Grid container spacing={1} columnSpacing={1}>
					<Grid item xs={12}>
						<Typography
							variant="h1"
							p={1}
							sx={{
								fontSize: 'clamp(1.5rem, 2.333vw + 1.5rem, 2.125rem)',
								fontWeight: 700,
								lineHeight: 'clamp(1.815rem, 1.008vw + 1.815rem, 2.193rem)'
							}}>
							Votre CRA{' '}
							{cra
								? `de ${new Date(cra?.payload?.year, cra?.payload?.month).toLocaleDateString(
										'fr-FR',
										{
											year: 'numeric',
											month: 'long'
										}
								  )} `
								: null}
						</Typography>
					</Grid>

					<Grid item xs={12}>
						<Button variant="contained" component={RouterLink} to={'/'}>
							Retourner à l'accueil
						</Button>
					</Grid>

					<Grid item xs={12} container spacing={2} columnSpacing={2} direction="column">
						<Grid item xs={12} spacing={2} sx={{ height: '100%' }}>
							<Paper sx={{ p: 2, margin: '12px auto' }}>
								{cra ? (
									<PDFViewer
										style={{
											margin: 'auto',
											width: parent.innerWidth - 50,
											height: window.innerHeight
										}}>
										<PDFDocument {...cra} />
									</PDFViewer>
								) : null}
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</main>
	);
}
