import { PropsWithChildren } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { Button, Stack, TextField } from '@mui/material';

import { ModalCloseButton, useModalToggle } from '../BasicModal/BasicModal';

type FormValues = {
	name: string;
	address: string;
	phone: string;
	zipCode: string;
	city: string;
	email: string;
	website: string;
	logo?: string;
};

const defaultValues: FormValues = {
	name: '',
	address: '',
	phone: '',
	zipCode: '',
	city: '',
	email: '',
	website: ''
};

export function Form(
	props: PropsWithChildren<JSX.IntrinsicAttributes> & {
		withLogo: boolean;
		onCancelClick?: () => void | undefined;
		onSubmitClick?: (payload: FormValues) => void | undefined;
	}
) {
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues,
		...(props?.withLogo && { image: '' })
	});
	const { setIsOpen } = useModalToggle();

	const onSubmit: SubmitHandler<FormValues> = (data: any) => {
		setIsOpen(false);
		props?.onSubmitClick?.(data);
	};

	const onError = (errors: any, e: any) => console.info(errors, e);

	return (
		<form onSubmit={handleSubmit(onSubmit, onError)}>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						id="name"
						label="Dénomination / Raison Sociale"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			{props?.withLogo ? (
				<Controller
					name="logo"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextField
							id="logo"
							label="Logo"
							variant="outlined"
							type="file"
							/*accept="image/png, image/jpeg"*/
							fullWidth
							sx={{ margin: '8px 0' }}
							{...field}
						/>
					)}
				/>
			) : null}
			<Controller
				control={control}
				name="address"
				rules={{ required: true }}
				render={({ field }) => (
					<TextField
						id="address"
						label="Adresse"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="zipCode"
				rules={{ required: true }}
				render={({ field }) => (
					<TextField
						id="zipcode"
						label="Code Postal"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="city"
				rules={{ required: true }}
				render={({ field }) => (
					<TextField
						id="client-city"
						label="Ville"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="phone"
				rules={{ required: false, maxLength: 12 }}
				render={({ field }) => (
					<TextField
						id="phone"
						label="Téléphone"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="email"
				rules={{ required: false, maxLength: 12 }}
				render={({ field }) => (
					<TextField
						id="email"
						label="Email"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="website"
				rules={{ required: false, maxLength: 12 }}
				render={({ field }) => (
					<TextField
						id="website"
						label="Addresse web"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						{...field}
					/>
				)}
			/>
			<Stack spacing={2} direction="row" marginTop={5}>
				<ModalCloseButton>
					<Button
						variant="outlined"
						type="button"
						fullWidth
						onClick={() => {
							props?.onCancelClick?.();
							reset({ ...defaultValues });
						}}>
						Annuler
					</Button>
				</ModalCloseButton>
				<Button variant="contained" type="submit" fullWidth>
					Ajouter
				</Button>
			</Stack>
		</form>
	);
}
