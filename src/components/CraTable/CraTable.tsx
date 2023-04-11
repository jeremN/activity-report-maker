import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Link } from 'react-router-dom';

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

// TODO: sorting (by date ?)
export function CraTable(props: { list: PDFList }) {
	return (
		<>
			{props?.list.length > 0 ? (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Lien</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{props.list.map((pdf, index) => (
								<TableRow key={pdf?.id ?? index}>
									<TableCell>
										<Link to={`/${pdf.id}`}>
											CRA{' '}
											{new Date(pdf?.payload?.year, pdf?.payload?.month).toLocaleDateString(
												'fr-FR',
												{
													year: 'numeric',
													month: 'long'
												}
											)}
										</Link>
									</TableCell>
									<TableCell>
										{new Date(pdf?.payload?.year, pdf?.payload?.month).toLocaleDateString('fr-FR', {
											year: 'numeric',
											month: 'long'
										})}
									</TableCell>
									<TableCell>A venir</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<p>Vous n'avez pas encore enregistrer de PDF</p>
			)}
		</>
	);
}
