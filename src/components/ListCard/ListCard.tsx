import { Button, Grid, Box, ListItemButton, Paper, Typography } from '@mui/material';

import { ModalOpenButton } from '../BasicModal/BasicModal';

export function ListCard(
	props: React.PropsWithChildren<JSX.IntrinsicAttributes> & {
		onModalBtnClick?: () => void;
		modalBtnWording?: string;
		title: string | JSX.Element;
		withModalBtn: boolean;
	}
) {
	return (
		<Box sx={{ width: '100%' }}>
			<Grid item xs={12}>
				<Paper sx={{ p: 2 }}>
					<Grid item xs={12}>
						<Typography variant="h2" sx={{ fontSize: '1.85rem', fontWeight: 700 }}>
							{props.title}
						</Typography>
						{props.children}
						{props?.withModalBtn ? (
							<ModalOpenButton>
								<Button
									variant="contained"
									type="button"
									fullWidth
									onClick={() => {
										props?.onModalBtnClick?.();
									}}>
									{props.modalBtnWording}
								</Button>
							</ModalOpenButton>
						) : null}
					</Grid>
				</Paper>
			</Grid>
		</Box>
	);
}
