import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { getDay } from '../../utils/dates';

const styles = StyleSheet.create({
	headRow: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#1A1A1A',
		color: 'white'
	},
	rows: {
		display: 'flex',
		flexDirection: 'row'
	},
	calendarBlock: {
		borderColor: 'black',
		borderWidth: '1px',
		padding: 8,
		minWidth: `${(1 / 7) * 100}%`,
		fontSize: 12
	},
	emptyBlock: {
		backgroundColor: '#F0F0F0'
	},
	weekendBlock: {
		backgroundColor: '#F0F0F0'
	}
});

const daysName: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function PDFCalendar({
	year,
	month,
	selectedDays = []
}: {
	year: number;
	month: number;
	selectedDays: Date[];
}) {
	const date = new Date(year, month);

	let slots: JSX.Element[] = [];

	// spaces for the first row
	// from Monday till the first day of the month
	// * * * 1  2  3  4
	for (let i = 0; i < getDay(date); i++) {
		slots.push(
			<View style={{ ...styles.calendarBlock, ...styles.emptyBlock }}>
				<Text></Text>
			</View>
		);
	}

	// <View><Text>{actual date}</Text><Text>{absence or not}</Text></View>
	while (date.getMonth() === month) {
		slots.push(
			<View
				key={date.getTime()}
				style={{
					...styles.calendarBlock,
					...([6, 5].includes(getDay(date) % 7) && styles.weekendBlock)
				}}>
				<Text>{date.getDate()}</Text>
				<Text>
					{!!selectedDays.find(d => new Date(d).getTime() === new Date(date).getTime()) ? 1 : 0}
				</Text>
			</View>
		);

		date.setDate(date.getDate() + 1);
	}

	// add spaces after last days of month for the last row
	// 29 30 31 * * * *
	if (getDay(date) != 0) {
		for (let i = getDay(date); i < 7; i++) {
			slots.push(
				<View style={{ ...styles.calendarBlock, ...styles.emptyBlock }}>
					<Text></Text>
				</View>
			);
		}
	}

	let cells: JSX.Element[] = [];
	const rows: JSX.Element[][] = [];

	slots.forEach((row, i) => {
		if (i % 7 !== 0) {
			cells.push(row);
		} else {
			rows.push(cells);
			cells = [];
			cells.push(row);
		}

		if (i === slots.length - 1) {
			rows.push(cells);
		}
	});

	return (
		<View>
			<View style={styles.headRow}>
				{daysName.map(day => (
					<Text key={day} style={styles.calendarBlock}>
						{day}
					</Text>
				))}
			</View>
			{rows.map((row, i) => (
				<View style={styles.rows} key={`row-${i}`}>
					{row}
				</View>
			))}
		</View>
	);
}
