import * as React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { PDFCalendar } from './PDFCalendar';
import { PDFCardSlot } from './PDFCardSlot';
import { PDFSignatureCard } from './PDFSignatureCard';

const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
		backgroundColor: '#FFF'
	},
	section: {
		margin: 10,
		padding: 10,
		height: 'auto'
	},
	card: {
		borderColor: 'black',
		borderWidth: '1px',
		margin: 0,
		padding: 8,
		width: '100%'
	},
	mainText: {
		fontSize: 16,
		fontWeight: 'heavy'
	},
	secondText: {
		fontSize: 10,
		marginTop: 2
	},
	logo: {
		width: 80,
		height: 80
	},
	img: { width: '100%', height: 'auto' }
});

type User = {
	name: string;
	address: string;
	zipCode: string;
	city: string;
	phone: string;
	email: string;
	website: string;
	logo?: string;
};

export function PDFDocument(
	props: React.PropsWithChildren<JSX.IntrinsicAttributes> & {
		user: User | null;
		client: User | null;
		payload: {
			month: number;
			year: number;
			selectedDays: DayObject[];
			totalSelected: number;
			totalWorkDays: number;
		};
	}
) {
	return (
		<Document>
			<Page size="A4" style={styles.body}>
				<View
					style={{
						...styles.section,
						width: '100%',
						margin: 0,
						padding: 0,
						marginBottom: 50,
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}>
					{props?.user?.logo ? (
						<View style={styles.logo}>
							<Image src={props.user.logo} style={styles.img} />
						</View>
					) : null}
					<View>
						<Text style={styles.mainText}>Fiche CRA </Text>
						<Text style={styles.secondText}>
							Date :{' '}
							{new Date(
								new Date(props?.payload?.year, props?.payload?.month + 1, 0)
							).toLocaleDateString('fr-FR')}
						</Text>
					</View>
				</View>
				<View
					style={{
						...styles.section,
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						margin: 0,
						marginBottom: 14,
						padding: 0
					}}>
					{props?.user ? <PDFCardSlot cardStyle={{ marginRight: 10 }} {...props.user} /> : null}
					{props?.client ? <PDFCardSlot cardStyle={{ marginLeft: 10 }} {...props.client} /> : null}
				</View>
				<View
					style={{
						...styles.card,
						width: '100%',
						display: 'flex',
						flexDirection: 'column'
					}}>
					<Text style={styles.mainText}>
						Rapport d'activité de la période:{' '}
						{new Date(props?.payload?.year, props?.payload?.month).toLocaleDateString('fr-FR', {
							year: 'numeric',
							month: 'long'
						})}
					</Text>
					<View style={{ marginTop: 12 }}>
						<PDFCalendar {...props?.payload} />
					</View>
					<View style={{ marginTop: 12 }}>
						<Text style={styles.secondText}>
							Nombre de jour ouvrés : {props?.payload?.totalWorkDays}
						</Text>
						<Text style={styles.secondText}>
							Absence: {props?.payload?.totalWorkDays - props?.payload?.totalSelected}
						</Text>
						<Text style={{ fontSize: 14, marginTop: 2, fontWeight: 'black' }}>
							TOTAL à Facturer : {props?.payload?.totalSelected}
						</Text>
					</View>
				</View>

				<View style={{ marginTop: 12, display: 'flex', flexDirection: 'row' }}>
					<PDFSignatureCard name={props?.user?.name} />
					<PDFSignatureCard name={props?.client?.name} />
				</View>
			</Page>
		</Document>
	);
}
