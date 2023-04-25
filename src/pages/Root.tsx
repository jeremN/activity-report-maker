import React from 'react';
import dayjs from 'dayjs';

import {
	Box,
	Grid,
	Typography,
	Paper,
	Button,
	List,
	ListItemButton,
	IconButton,
	ListItem,
	Snackbar,
	Alert,
	type AlertProps
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { CustomCalendar } from '../components/Calendar/Calendar';
import {
	BasicModal,
	ModalCloseButton,
	ModalOpenButton,
	ModalProvider
} from '../components/BasicModal/BasicModal';

import { getBankHolidaysInMonth, getWeekdaysInMonth } from '../utils/dates';
import { Form } from '../components/Form/Form';
import { ListCard } from '../components/ListCard/ListCard';
import { CraTable } from '../components/CraTable/CraTable';
import { CraContext } from '../contexts/craContext';
import { filterStoredList, updateStoredList } from '../utils/mapsAndFilters';
import { getBankHolidays, bankHolidaysUrl } from '../config/requests';

export default function Root() {
	const {
		storedClient,
		setStoredClient,
		storedCompany,
		setStoredCompany,
		storedPDF,
		setStoredPDF,
		storedBankHolidays,
		setStoredBankHolidays,
		dispatch,
		...state
	} = React.useContext(CraContext);

	const [whichForm, setWhichForm] = React.useState<{ form: string; type: string }>({
		form: 'none',
		type: 'idle'
	});

	const calcSelectedDays = () =>
		state.selectedDays.reduce((accum, val) => accum + Number(val.selection), 0);

	const [toast, setToast] = React.useState<{
		open: boolean;
		severity: AlertProps['severity'];
		message: string;
	}>({
		open: false,
		severity: 'info',
		message: ''
	});

	const handleSelect = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		index: number,
		type: string = 'company'
	) => {
		if (type === 'company') {
			if (state.user === index) dispatch({ type: 'SET_USER', ...state, user: null });
			dispatch({ type: 'SET_USER', ...state, user: index });
		} else {
			if (state.client === index) dispatch({ type: 'SET_CLIENT', ...state, client: null });
			dispatch({ type: 'SET_CLIENT', ...state, client: index });
		}
	};

	const handleDelete = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		index: number,
		name: string,
		type: string = 'company'
	) => {
		if (type === 'company') {
			if (state.user === index) dispatch({ type: 'SET_USER', ...state, user: null });
			const updatedCompanies = filterStoredList(storedCompany, (item, i) => {
				const el = item as Company;
				return i !== index && el.name.toLowerCase() !== name.toLowerCase();
			});

			setStoredCompany([...(updatedCompanies as UserCompanyList)]);
		} else {
			if (state.client === index) dispatch({ type: 'SET_CLIENT', ...state, client: null });
			const updatedClients = filterStoredList(storedClient, (item, i) => {
				const el = item as Client;
				return i !== index && el.name.toLowerCase() !== name.toLowerCase();
			});

			setStoredClient([...(updatedClients as ClientsList)]);
		}
	};

	const handeModify = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		index: number,
		type: string = 'company'
	) => {
		handleSelect(event, index, type);
		setWhichForm({ form: 'modify', type });
	};

	const handleDeletePdf = (id: string) => {
		const updatedPdfs = filterStoredList(storedPDF, (item, i) => {
			const el = item as PDF;
			return el.id !== id;
		});

		setStoredPDF([...(updatedPdfs as PDFList)]);
	};

	const handleSubmitNewForm = (payload: Company | Client) => {
		if (whichForm.type === 'company') {
			setStoredCompany([...storedCompany, { ...payload }]);
		} else {
			setStoredClient([...storedClient, { ...payload }]);
		}
	};

	const handleSubmitModifyForm = (payload: Company | Client) => {
		if (whichForm.type === 'company') {
			const updatedCompany = updateStoredList(storedCompany, (item: unknown, i: number) => {
				if (i === state.user) {
					const updateCompany = { ...(item as Company), ...payload };
					return updateCompany;
				}
				return item;
			});
			setStoredCompany([...(updatedCompany as UserCompanyList)]);
			dispatch({ type: 'SET_USER', ...state, user: null });
		} else if (whichForm.type === 'client') {
			const updatedClient = updateStoredList(storedClient, (item: unknown, i: number) => {
				if (i === state.client) {
					const updateClient = { ...(item as Client), ...payload };
					return updateClient;
				}
				return item;
			});
			setStoredClient([...(updatedClient as ClientsList)]);
			dispatch({ type: 'SET_CLIENT', ...state, client: null });
		}
	};

	const handleToastClose = () => {
		setToast({ ...toast, open: false });
	};

	const handleCreateCra = () => {
		if (state.client === null || state.user === null) {
			setToast({
				open: true,
				message: 'Vous devez sélectionner un client et une société pour pouvoir créer un document.',
				severity: 'error'
			});
			return;
		}

		const updatedPDFs = [
			...storedPDF,
			{
				id: crypto.randomUUID(),
				client: storedClient[state.client],
				user: storedCompany[state.user],
				payload: {
					month: new Date(state.month)?.getMonth(),
					year: new Date(state.month).getFullYear(),
					selectedDays: state.selectedDays,
					totalSelected: calcSelectedDays(),
					totalWorkDays: getWeekdaysInMonth(
						new Date(state.month)?.getMonth(),
						new Date().getFullYear()
					)
				}
			}
		];
		setStoredPDF(updatedPDFs);
		setToast({ open: true, message: 'PDF créer', severity: 'success' });
		dispatch({ type: 'SET_EMPTY', ...state });
	};

	const setFormValues = React.useCallback(() => {
		if (whichForm.form !== 'modify') return undefined;

		return whichForm.type === 'company' && state?.user
			? storedCompany[state?.user]
			: whichForm.type === 'client' && state?.client
			? storedClient[state?.client]
			: undefined;
	}, [whichForm]);

	const setFormTitle = () => {
		return `${whichForm.form === 'new' ? 'Créer ' : 'Modifier '}${
			whichForm.type === 'company' ? 'une compagnie' : 'un client'
		}`;
	};

	return (
		<main
			style={{
				padding: '32px 32px',
				flexBasis: 'calc(100% - 240px)',
				minHeight: '100%',
				overflow: 'hidden',
				backgroundColor: '#f5f6fb'
			}}>
			<ModalProvider>
				<Box sx={{ minHeight: '100vh' }}>
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
								CRAs
							</Typography>
						</Grid>
						<Grid item xs={12} container spacing={2}>
							<Grid item xs={12} md={6} container>
								<ListCard
									title="Sélectionner une société"
									withModalBtn={true}
									modalBtnWording="Ajouter ma société"
									onModalBtnClick={() => setWhichForm({ form: 'new', type: 'company' })}>
									{storedCompany.length > 0 ? (
										<List>
											{storedCompany.map((company, index) => (
												<ListItem
													key={index}
													secondaryAction={
														<>
															<ModalOpenButton>
																<IconButton
																	edge="start"
																	aria-label="Modifier"
																	onClick={evt => handeModify(evt, index, 'company')}>
																	<EditIcon />
																</IconButton>
															</ModalOpenButton>
															<IconButton
																edge="end"
																aria-label="Supprimer"
																onClick={evt => handleDelete(evt, index, company.name, 'company')}>
																<DeleteIcon />
															</IconButton>
														</>
													}>
													<ListItemButton
														key={index}
														selected={state.user === index}
														onClick={evt => handleSelect(evt, index, 'company')}>
														{company.name}
													</ListItemButton>
												</ListItem>
											))}
										</List>
									) : (
										<p>Vous n'avez pas encore enregistrer de société</p>
									)}
								</ListCard>
								<ListCard
									title="Sélectionner un client"
									withModalBtn={true}
									modalBtnWording="Ajouter un client"
									onModalBtnClick={() => setWhichForm({ form: 'new', type: 'client' })}>
									{storedClient.length > 0 ? (
										<List>
											{storedClient.map((client, index) => (
												<ListItem
													key={index}
													secondaryAction={
														<>
															<ModalOpenButton>
																<IconButton
																	edge="start"
																	aria-label="Modifier"
																	onClick={evt => handeModify(evt, index, 'client')}>
																	<EditIcon />
																</IconButton>
															</ModalOpenButton>
															<IconButton
																edge="end"
																aria-label="Supprimer"
																onClick={evt => handleDelete(evt, index, client.name, 'client')}>
																<DeleteIcon />
															</IconButton>
														</>
													}>
													<ListItemButton
														selected={state.client === index}
														onClick={evt => handleSelect(evt, index, 'client')}>
														{client.name}
													</ListItemButton>
												</ListItem>
											))}
										</List>
									) : (
										<p>Vous n'avez pas encore enregistrer de client</p>
									)}
								</ListCard>
							</Grid>

							<Grid item xs={12} md={6}>
								<Paper sx={{ p: 0, margin: 'auto' }}>
									<Grid
										item
										xs={12}
										sx={{
											p: 1,
											background: 'linear-gradient(90deg, #0A7BC4 0%, #05A7D0 100%)',
											borderRadius: '4px 4px 0 0 ',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}>
										<Typography
											paragraph={true}
											p={1}
											sx={{
												textAlign: 'center',
												fontSize: '0.875rem',
												color: 'white',
												margin: 0
											}}>
											<span style={{ fontSize: '1.125rem', fontWeight: 700, marginRight: '6px' }}>
												{calcSelectedDays()}
											</span>
											<span>
												sur{' '}
												{getWeekdaysInMonth(
													new Date(state.month)?.getMonth(),
													new Date().getFullYear()
												) -
													getBankHolidaysInMonth(
														new Date(state.month)?.getMonth(),
														storedBankHolidays?.dates
													)}{' '}
												jours
											</span>
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<CustomCalendar
											disabledDates={storedBankHolidays.dates}
											onSelectionCb={arg =>
												dispatch({ type: 'SET_DAYS', ...state, selectedDays: arg })
											}
											onMonthChange={arg => {
												if (dayjs(arg).year() !== storedBankHolidays.year) {
													getBankHolidays(bankHolidaysUrl(dayjs(arg).year(), 'metropole')).then(
														res => {
															setStoredBankHolidays({
																year: dayjs(arg).year(),
																dates: Object.keys(res)
															});
														}
													);
												}
												dispatch({ type: 'SET_MONTH', ...state, month: arg });
											}}
										/>
									</Grid>
									<Grid item xs={12} padding={2}>
										<Button variant="contained" type="button" fullWidth onClick={handleCreateCra}>
											Valider ma sélection
										</Button>
										<Grid item xs={12} textAlign={'center'} marginTop={1}>
											<Typography variant="caption" gutterBottom>
												1 clic pour une journée entière, double-clic pour une demi-journée
											</Typography>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					<Grid container marginTop={2}>
						<ListCard title="PDFs" withModalBtn={false}>
							<CraTable list={storedPDF} onDeleteCb={handleDeletePdf} />
						</ListCard>
					</Grid>
				</Box>
				<Snackbar open={toast.open} autoHideDuration={7000} onClose={handleToastClose}>
					<Alert onClose={handleToastClose} severity={toast.severity}>
						{toast.message}
					</Alert>
				</Snackbar>
				<BasicModal
					title={setFormTitle()}
					closeBtn={
						<ModalCloseButton>
							<Button
								variant="outlined"
								type="button"
								aria-label="Fermer"
								onClick={() => setWhichForm({ form: 'none', type: 'idle' })}>
								<CloseIcon />
							</Button>
						</ModalCloseButton>
					}>
					<Form
						values={setFormValues()}
						withLogo={false}
						onCancelClick={() => setWhichForm({ form: 'none', type: 'idle' })}
						onSubmitClick={payload => {
							if (whichForm.form === 'new') {
								handleSubmitNewForm(payload);
							} else if (whichForm.form === 'modify') {
								handleSubmitModifyForm(payload);
							}

							setWhichForm({ form: 'none', type: 'idle' });
						}}
					/>
				</BasicModal>
			</ModalProvider>
		</main>
	);
}
