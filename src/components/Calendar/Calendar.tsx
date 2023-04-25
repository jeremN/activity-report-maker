import * as React from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Stack } from '@mui/material';
import { isFunction } from '../../utils';
import { rgba } from '../../utils/colors';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Date> {}

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: prop => prop !== 'selected'
})<CustomPickerDayProps>(({ theme, selected }) => ({
	'&:hover, &:focus': {
		borderRadius: 0
	},
	'&[aria-current="date"]': {
		borderRadius: 0,
		border: 'none'
	},
	...(selected && {
		borderRadius: 0,
		backgroundColor: `${rgba(theme.palette.primary.main, 0.2)}`,
		color: theme.palette.common.black,
		'&:hover, &:focus': {
			backgroundColor: theme.palette.primary.dark
		},
		'&.half-day': {
			background: `linear-gradient(45deg, transparent 0%, transparent 50%, ${rgba(
				theme.palette.primary.main,
				0.2
			)} 50%, ${rgba(theme.palette.primary.main, 0.2)} 100%)`
		}
	})
})) as React.ComponentType<CustomPickerDayProps>;

// TODO: refactor
export function CustomCalendar({
	onSelectionCb,
	onMonthChange,
	disabledDates
}: React.PropsWithChildren<JSX.IntrinsicAttributes> & {
	onMonthChange?: (arg: Date) => void;
	onSelectionCb?: (arg: DayObject[]) => void;
	disabledDates?: string[];
}) {
	const [values, setValues] = React.useState<DayObject[]>([]);

	const handleSelection = (newValue: Date) => {
		const array = [...values];
		const date = dayjs(newValue).startOf('day').toDate();
		const index = findIndexDate(array, date);

		if (index >= 0) {
			const selectionValue = getSelectionValue(array, index);

			if (selectionValue !== 0.5) {
				array[index].selection = 0.5;
			} else {
				array.splice(index, 1);
			}
		} else {
			array.push({ date: dayjs(date).toDate(), selection: 1 });
		}
		setValues(array);

		if (onSelectionCb && isFunction(onSelectionCb)) {
			onSelectionCb(array);
		}
	};

	const findDate = (dates: DayObject[], date: Date) => {
		const dateTime = date.getTime();
		return dates.find(item => item.date.getTime() === dateTime);
	};

	const findIndexDate = (dates: DayObject[], date: Date) => {
		const dateTime = date.getTime();
		return dates.findIndex(item => item?.date.getTime() === dateTime);
	};

	const getSelectionValue = (dates: DayObject[], index: number) => dates[index].selection;

	const renderWeekPickerDay = (
		date: Date,
		selectedDates: Date[],
		pickersDayProps: PickersDayProps<Date>
	) => {
		if (!values) {
			return <PickersDay {...pickersDayProps} sx={{ width: '36px', height: '36px' }} />;
		}

		const selected = findDate(values, dayjs(date).toDate());

		const shouldBeDisabled = (date: Date) => {
			const isDisabled =
				Boolean(
					disabledDates?.find(day => dayjs(day).valueOf() === Number(dayjs(date).valueOf()))
				) || [6, 0].includes(dayjs(date).day());

			return isDisabled;
		};

		const toggleClasse = () => {
			const selectedDate = selected;

			return {
				selected: Boolean(selectedDate),
				className:
					typeof selectedDate !== undefined && selected?.selection === 0.5 ? 'half-day' : undefined
			};
		};

		return (
			<CustomPickersDay
				{...pickersDayProps}
				sx={{ displayt: 'flex', width: '36px', height: '36px' }}
				{...toggleClasse()}
				disabled={shouldBeDisabled(date)}
				onDaySelect={date => {
					handleSelection(date);
				}}
			/>
		);
	};

	const defaultMonth = dayjs(new Date()) as unknown as Date;

	React.useEffect(() => {
		if (onMonthChange && isFunction(onMonthChange)) onMonthChange(defaultMonth);
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Stack sx={{ width: '100%', minWidth: '90%' }}>
				<StaticDatePicker
					displayStaticWrapperAs="desktop"
					label="Week picker"
					value={values}
					disableFuture={true}
					onMonthChange={month => {
						setValues([]);
						if (onMonthChange && isFunction(onMonthChange)) onMonthChange(month);
						if (onSelectionCb && isFunction(onSelectionCb)) onSelectionCb([]);
					}}
					onChange={() => {}}
					renderDay={renderWeekPickerDay}
					inputFormat="MMM DD"
					orientation="landscape"
					renderInput={params => <TextField {...params} sx={{ width: '100%', minWidth: '100%' }} />}
				/>
			</Stack>
		</LocalizationProvider>
	);
}
