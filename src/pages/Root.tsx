import React from 'react';

import {
	Box,
	Grid,
	Typography,
	Paper,
	Button,
	List,
	ListItemButton,
	ListItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PDFViewer } from '@react-pdf/renderer';

import { CustomCalendar } from '../components/Calendar/Calendar';
import {
	BasicModal,
	ModalCloseButton,
	ModalOpenButton,
	ModalProvider
} from '../components/BasicModal/BasicModal';
import { AddUserCompanyForm } from '../components/AddUserCompanyForm/AddUserCompanyForm';
import { AddClientForm } from '../components/AddClientForm/AddClientForm';
import { PDFDocument } from '../components/PDF/PDFDocument';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { getWeekdaysInMonth } from '../utils/dates';
import { Link } from 'react-router-dom';
import { Form } from '../components/Form/Form';

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
type ClientsList = Client[];
type UserCompanyList = Company[];
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

export default function Root() {
	// TODO: useReducer + context
	const [selectedClient, setSelectedClient] = React.useState<number | null>(null);
	const [selectedCompany, setSelectedCompany] = React.useState<number | null>(null);
	const [whichForm, setWhichForm] = React.useState<string>('idle');
	const [daysSelected, setDaysSelected] = React.useState<Date[]>([]);
	const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date(new Date().setDate(0)));

	const [storedClient, setStoredClient] = useLocalStorage<ClientsList>('cra-clients', []);
	const [storedCompany, setStoredCompany] = useLocalStorage<UserCompanyList>('cra-companies', []);
	const [storedPDF, setStoredPDF] = useLocalStorage<PDFList>('cra-pdf', []);

	const handleSelectCompanyOrClient = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
		type: string = 'company'
	) => {
		if (type === 'company') {
			if (selectedCompany === index) setSelectedCompany(null);
			setSelectedCompany(index);
		} else {
			if (selectedClient === index) setSelectedClient(null);
			setSelectedClient(index);
		}
	};

	return (
		<>
			<ModalProvider>
				<Box sx={{ backgroundColor: '#f5f6fb', minHeight: '100vh' }}>
					<Grid container spacing={2} columnSpacing={2} direction="column">
						<Grid item xs={12}>
							<Typography
								variant="h1"
								sx={{
									fontSize: 'clamp(1.5rem, 2.333vw + 1.5rem, 2.375rem)',
									fontWeight: 700,
									lineHeight: 'clamp(1.815rem, 1.008vw + 1.815rem, 2.193rem)'
								}}>
								CRAs
							</Typography>
						</Grid>
						<Grid item xs={12} container spacing={2}>
							<Grid item xs={12} md={6} container>
								<Grid item xs={12}>
									<Paper sx={{ p: 2, margin: 'auto' }}>
										<Grid item xs={12}>
											<Typography variant="h2" sx={{ fontSize: '1.85rem', fontWeight: 700 }}>
												Votre société
											</Typography>
											{storedCompany.length > 0 ? (
												<List>
													{storedCompany.map((company, index) => (
														<ListItemButton
															key={index}
															selected={selectedCompany === index}
															onClick={evt => handleSelectCompanyOrClient(evt, index, 'company')}>
															{company.name}
														</ListItemButton>
													))}
												</List>
											) : (
												<p>Vous n'avez pas encore enregistrer de société</p>
											)}

											<ModalOpenButton>
												<Button
													variant="contained"
													type="button"
													fullWidth
													onClick={() => setWhichForm('new-company')}>
													Ajouter ma société
												</Button>
											</ModalOpenButton>
										</Grid>
									</Paper>
								</Grid>
								<Grid item xs={12}>
									<Paper sx={{ p: 2, margin: 'auto' }}>
										<Grid item xs={12}>
											<Typography variant="h2" sx={{ fontSize: '1.85rem', fontWeight: 700 }}>
												Sélectionner un client
											</Typography>
											{storedClient.length > 0 ? (
												<List>
													{storedClient.map((company, index) => (
														<ListItemButton
															key={index}
															selected={selectedClient === index}
															onClick={evt => handleSelectCompanyOrClient(evt, index, 'client')}>
															{company.name}
														</ListItemButton>
													))}
												</List>
											) : (
												<p>Vous n'avez pas encore enregistrer de client</p>
											)}

											<ModalOpenButton>
												<Button
													variant="contained"
													type="button"
													fullWidth
													onClick={() => setWhichForm('new-client')}>
													Ajouter un client
												</Button>
											</ModalOpenButton>
										</Grid>
									</Paper>
								</Grid>
							</Grid>

							<Grid item xs={12} md={6}>
								<Paper sx={{ p: 0, margin: 'auto' }}>
									<Grid item xs={12} sx={{ backgroundColor: '#f2faf2', p: 1 }}>
										<Typography paragraph={true} sx={{}}>
											{daysSelected.length} jour(s) sur{' '}
											{getWeekdaysInMonth(
												new Date(currentMonth)?.getMonth(),
												new Date().getFullYear()
											)}{' '}
											jours
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<CustomCalendar
											onSelectionCb={arg => setDaysSelected(arg)}
											onMonthChange={arg => setCurrentMonth(arg)}
										/>
									</Grid>
									<Grid item xs={12} padding={2}>
										<Button
											variant="contained"
											type="button"
											fullWidth
											onClick={() => {
												// TODO: validate client and company are selected
												// TODO: generate PDF and show link (or PDF directly ? both ??)
												if (selectedClient === null || selectedCompany === null) return; // TODO: show error notif

												const updatedPDFs = [
													...storedPDF,
													{
														id: crypto.randomUUID(),
														client: storedClient[selectedClient],
														user: storedCompany[selectedCompany],
														payload: {
															month: new Date(currentMonth)?.getMonth(),
															year: new Date(currentMonth).getFullYear(),
															selectedDays: daysSelected,
															totalSelected: daysSelected.length,
															totalWorkDays: getWeekdaysInMonth(
																new Date(currentMonth)?.getMonth(),
																new Date().getFullYear()
															)
														}
													}
												];
												setStoredPDF(updatedPDFs);
											}}>
											Valider ma sélection
										</Button>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{ height: '100%' }}>
						<Paper sx={{ p: 2, margin: '12px auto' }}>
							<Grid item xs={12}>
								<Typography variant="h2" sx={{ fontSize: '1.85rem', fontWeight: 700 }}>
									PDFs
								</Typography>
							</Grid>
							{storedPDF.length > 0 ? (
								<List>
									{storedPDF.map((pdf, index) => (
										<ListItem key={pdf?.id ?? index}>
											<Link to={`/${pdf.id}`}>
												{new Date(pdf?.payload?.year, pdf?.payload?.month).toLocaleDateString(
													'fr-FR',
													{
														year: 'numeric',
														month: 'long'
													}
												)}
											</Link>
										</ListItem>
									))}
								</List>
							) : (
								<p>Vous n'avez pas encore enregistrer de PDF</p>
							)}
						</Paper>
					</Grid>
				</Box>
				<BasicModal
					title={
						whichForm === 'new-company'
							? 'Ajouter une société'
							: whichForm === 'new-client'
							? ' Ajouter un client'
							: ''
					}
					closeBtn={
						<ModalCloseButton>
							<Button
								variant="outlined"
								type="button"
								aria-label="Fermer"
								onClick={() => setWhichForm('idle')}>
								<CloseIcon />
							</Button>
						</ModalCloseButton>
					}>
					<Form
						withLogo={false}
						onCancelClick={() => setWhichForm('idle')}
						onSubmitClick={payload => {
							if (whichForm === 'new-company') {
								setStoredCompany([...storedCompany, { ...payload }]);
							} else {
								setStoredClient([...storedClient, { ...payload }]);
							}
							setWhichForm('idle');
						}}
					/>
				</BasicModal>
			</ModalProvider>
		</>
	);
}
