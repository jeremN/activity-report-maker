import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
	container: {
		width: '50%',
		marginRight: 10
	},
	card: {
		borderColor: 'black',
		borderWidth: '1px',
		margin: 0,
		padding: 8,
		width: '100%',
		height: '60px'
	},
	text: {
		fontSize: 10,
		marginTop: 2,
		marginBottom: 6
	}
});

export function PDFSignatureCard({ name }: { name?: string }) {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Pour {name}, signature</Text>
			<View style={styles.card}></View>
		</View>
	);
}
