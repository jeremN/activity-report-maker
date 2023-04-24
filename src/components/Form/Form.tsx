import { PropsWithChildren } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { Button, Stack, TextField } from '@mui/material';

import { ModalCloseButton, useModalToggle } from '../BasicModal/BasicModal';

// TODO: later, implement image field

type FormValues = Company;

const initialValues: Company = {
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
		values?: FormValues;
	}
) {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<FormValues>({
		defaultValues: props?.values || initialValues,
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
				defaultValue=""
				rules={{ required: 'Champs obligatoire' }}
				render={({ field }) => (
					<TextField
						id="name"
						label="Dénomination / Raison Sociale"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.name}
						helperText={errors.name?.message}
						{...field}
					/>
				)}
			/>
			{props?.withLogo ? (
				<Controller
					name="logo"
					control={control}
					rules={{ required: 'Champs obligatoire' }}
					render={({ field }) => (
						<TextField
							id="logo"
							label="Logo"
							variant="outlined"
							type="file"
							/*accept="image/png, image/jpeg"*/
							fullWidth
							sx={{ margin: '8px 0' }}
							error={!!errors.logo}
							helperText={errors.logo?.message}
							{...field}
						/>
					)}
				/>
			) : null}
			<Controller
				control={control}
				name="address"
				rules={{ required: 'Champs obligatoire' }}
				render={({ field }) => (
					<TextField
						id="address"
						label="Adresse"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.address}
						helperText={errors.address?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="zipCode"
				rules={{
					required: 'Champs obligatoire',
					pattern: {
						value: /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/,
						message: 'Format du code postal incorrect (ex: 75015)'
					}
				}}
				render={({ field }) => (
					<TextField
						id="zipcode"
						label="Code Postal"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.zipCode}
						helperText={errors.zipCode?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="city"
				rules={{ required: 'Champs obligatoire' }}
				render={({ field }) => (
					<TextField
						id="client-city"
						label="Ville"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.city}
						helperText={errors.city?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="phone"
				rules={{ required: false, maxLength: { value: 15, message: '15 caractères maximum' } }}
				render={({ field }) => (
					<TextField
						id="phone"
						label="Téléphone"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.phone}
						helperText={errors.phone?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="email"
				rules={{
					required: false,
					pattern: {
						value:
							/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
						message: 'Adresse email incorrecte (ex: dupont@email.fr)'
					}
				}}
				render={({ field }) => (
					<TextField
						id="email"
						label="Email"
						variant="outlined"
						fullWidth
						sx={{ margin: '8px 0' }}
						error={!!errors.email}
						helperText={errors.email?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				control={control}
				name="website"
				rules={{ required: false }}
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
							reset({ ...initialValues });
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
