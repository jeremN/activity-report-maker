import * as React from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Date> {}

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: prop => prop !== 'selected'
})<CustomPickerDayProps>(({ theme, selected }) => ({
	...(selected && {
		borderRadius: 0,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		'&:hover, &:focus': {
			backgroundColor: theme.palette.primary.dark
		},
		borderTopLeftRadius: '50%',
		borderBottomLeftRadius: '50%',
		borderTopRightRadius: '50%',
		borderBottomRightRadius: '50%'
	})
})) as React.ComponentType<CustomPickerDayProps>;

// TODO: refactor
export function CustomCalendar({
	onSelectionCb,
	onMonthChange
}: React.PropsWithChildren<JSX.IntrinsicAttributes> & {
	onMonthChange?: (arg: Date) => void;
	onSelectionCb?: (arg: Date[]) => void;
}) {
	const [values, setValues] = React.useState<Date[]>([]);

	const handleSelection = (newValue: Date) => {
		const array = [...values];
		const date = dayjs(newValue).startOf('day').toDate();
		const index = findIndexDate(array, date);

		if (index >= 0) {
			array.splice(index, 1);
		} else {
			array.push(dayjs(date).toDate());
		}

		setValues(array);

		// TODO: check function is function
		if (onSelectionCb) {
			console.log('Cb calendar', array);
			onSelectionCb(array);
		}
	};

	const findDate = (dates: Date[], date: Date) => {
		const dateTime = date.getTime();
		return dates.find(item => item.getTime() === dateTime);
	};

	const findIndexDate = (dates: Date[], date: Date) => {
		const dateTime = date.getTime();
		return dates.findIndex(item => item.getTime() === dateTime);
	};

	const renderWeekPickerDay = (
		date: Date,
		selectedDates: Date[],
		pickersDayProps: PickersDayProps<Date>
	) => {
		if (!values) {
			return <PickersDay {...pickersDayProps} />;
		}

		const selected = findDate(values, dayjs(date).toDate());

		const shouldBeDisabled = (date: Date) => [6, 0].includes(dayjs(date).day());

		return (
			<CustomPickersDay
				{...pickersDayProps}
				disableMargin
				selected={!!selected}
				disabled={shouldBeDisabled(date)}
				onDaySelect={date => {
					handleSelection(date);
				}}
			/>
		);
	};

	const defaultMonth = dayjs(new Date()) as unknown as Date;

	React.useEffect(() => {
		if (onMonthChange) onMonthChange(defaultMonth);
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<StaticDatePicker
				displayStaticWrapperAs="desktop"
				label="Week picker"
				value={values}
				disableFuture={true}
				onYearChange={year => {
					console.log({ year });
				}}
				onViewChange={view => {
					console.log({ view });
				}}
				onMonthChange={month => {
					console.log({ month });
					setValues([]);
					if (onMonthChange) onMonthChange(month);
					if (onSelectionCb) onSelectionCb([]);
				}}
				onChange={() => {}}
				renderDay={renderWeekPickerDay}
				inputFormat="MMM DD"
				renderInput={params => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
}
