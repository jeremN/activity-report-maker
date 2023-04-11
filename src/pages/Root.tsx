import React from 'react';

import { Box, Grid, Typography, Paper, Button, List, ListItemButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CustomCalendar } from '../components/Calendar/Calendar';
import { BasicModal, ModalCloseButton, ModalProvider } from '../components/BasicModal/BasicModal';

import { getWeekdaysInMonth } from '../utils/dates';
import { Form } from '../components/Form/Form';
import { ListCard } from '../components/ListCard/ListCard';
import { CraTable } from '../components/CraTable/CraTable';
import { CraContext } from '../contexts/craContext';

export default function Root() {
	// TODO: useReducer + context
	const {
		storedClient,
		setStoredClient,
		storedCompany,
		setStoredCompany,
		storedPDF,
		setStoredPDF,
		dispatch,
		...state
	} = React.useContext(CraContext);

	const [whichForm, setWhichForm] = React.useState<string>('idle');

	const handleSelectCompanyOrClient = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
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
									onModalBtnClick={() => setWhichForm('new-company')}>
									{storedCompany.length > 0 ? (
										<List>
											{storedCompany.map((company, index) => (
												<ListItemButton
													key={index}
													selected={state.user === index}
													onClick={evt => handleSelectCompanyOrClient(evt, index, 'company')}>
													{company.name}
												</ListItemButton>
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
									onModalBtnClick={() => setWhichForm('new-client')}>
									{storedClient.length > 0 ? (
										<List>
											{storedClient.map((company, index) => (
												<ListItemButton
													key={index}
													selected={state.client === index}
													onClick={evt => handleSelectCompanyOrClient(evt, index, 'client')}>
													{company.name}
												</ListItemButton>
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
												{state.selectedDays.length}
											</span>
											<span>
												sur{' '}
												{getWeekdaysInMonth(
													new Date(state.month)?.getMonth(),
													new Date().getFullYear()
												)}{' '}
												jours
											</span>
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<CustomCalendar
											onSelectionCb={arg =>
												dispatch({ type: 'SET_DAYS', ...state, selectedDays: arg })
											}
											onMonthChange={arg => dispatch({ type: 'SET_MONTH', ...state, month: arg })}
										/>
									</Grid>
									<Grid item xs={12} padding={2}>
										<Button
											variant="contained"
											type="button"
											fullWidth
											onClick={() => {
												if (state.client === null || state.user === null) return; // TODO: show error notif

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
															totalSelected: state.selectedDays.length,
															totalWorkDays: getWeekdaysInMonth(
																new Date(state.month)?.getMonth(),
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
					<Grid container marginTop={2}>
						<ListCard title="PDFs" withModalBtn={false}>
							<CraTable list={storedPDF} />
						</ListCard>
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
		</main>
	);
}
