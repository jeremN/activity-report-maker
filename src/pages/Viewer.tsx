import { Box, Grid, Paper } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';

import { PDFDocument } from '../components/PDF/PDFDocument';

import { getWeekdaysInMonth } from '../utils/dates';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useParams } from 'react-router-dom';

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
type PDFList = {
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
}[];

export default function Viewer() {
	let { id } = useParams();
	const [storedPDF, __] = useLocalStorage<PDFList>('cra-pdf', []);

	return (
		<Box sx={{ backgroundColor: '#f5f6fb', minHeight: '100vh' }}>
			<Grid container spacing={2} columnSpacing={2} direction="column">
				<Grid item xs={12} spacing={2} sx={{ height: '100%' }}>
					<Paper sx={{ p: 2, margin: '12px auto' }}>
						<PDFViewer
							style={{
								margin: 'auto',
								width: parent.innerWidth - 50,
								height: window.innerHeight
							}}>
							<PDFDocument {...storedPDF.filter(pdf => pdf.id === id)?.[0]} />
						</PDFViewer>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
