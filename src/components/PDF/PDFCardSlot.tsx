import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
	link: {
		color: 'black'
	}
});
export function PDFCardSlot({
	name,
	address,
	city,
	zipCode,
	email,
	phone,
	website,
	logo,
	cardStyle = {}
}: {
	name?: string;
	address?: string;
	city?: string;
	zipCode?: string;
	email?: string;
	phone?: string;
	website?: string;
	cardStyle?: object;
	logo?: string;
}) {
	return (
		<View style={{ ...styles.card, width: '50%', ...cardStyle }}>
			<View>
				<Text style={styles.mainText}>{name}</Text>
				<Text style={styles.secondText}>{address}</Text>
				<Text style={styles.secondText}>
					{zipCode} {city}
				</Text>
			</View>
			<View style={{ marginTop: 14 }}>
				{phone ? <Text style={styles.secondText}>Tél.: {phone}</Text> : null}

				{email ? <Text style={styles.secondText}>Email: {email}</Text> : null}
				{website ? (
					<Text style={styles.secondText}>
						Web:{' '}
						<Link style={styles.link} src={website}>
							{website}
						</Link>
					</Text>
				) : null}
			</View>
		</View>
	);
}
