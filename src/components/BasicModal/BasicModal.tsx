import React, { PropsWithChildren, ReactNode } from 'react';

import { Modal, Box, Typography, Grid, ModalProps, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ModalContextType = {
	isOpen: boolean;
	setIsOpen: (action: boolean) => void;
};

interface CallBack<Params extends any[]> {
	(...args: Params): void;
}

export const callAll =
	<Params extends any[]>(...fns: Array<CallBack<Params> | undefined>) =>
	(...args: Params) =>
		fns.forEach(fn => typeof fn === 'function' && fn(...args));

const ModalContext = React.createContext<ModalContextType>({
	isOpen: false,
	setIsOpen: action => void 0
});

function ModalProvider(props: PropsWithChildren<JSX.IntrinsicAttributes>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const value = React.useMemo(
		() => ({
			isOpen,
			setIsOpen
		}),
		[isOpen]
	);
	return <ModalContext.Provider value={value}>{props?.children ?? null}</ModalContext.Provider>;
}

function ModalBase(props: Omit<ModalProps, 'open'>): JSX.Element {
	const { isOpen, setIsOpen } = React.useContext(ModalContext);
	return <Modal open={isOpen} onClose={() => setIsOpen(false)} {...props} />;
}

function ModalCloseButton({ children: child }: { children: JSX.Element }) {
	const { setIsOpen } = React.useContext(ModalContext);
	return React.cloneElement(child, {
		onClick: callAll(() => {
			return setIsOpen(false);
		}, child?.props?.onClick)
	});
}

function ModalOpenButton({ children: child }: { children: JSX.Element }): JSX.Element {
	const { setIsOpen } = React.useContext(ModalContext);
	return React.cloneElement(child, {
		onClick: callAll(() => {
			return setIsOpen(true);
		}, child?.props?.onClick)
	});
}

function BasicModal({
	title,
	children,
	closeBtn,
	...props
}: {
	title: string;
	children?: ReactNode;
	props?: Omit<ModalProps, 'open'>;
	closeBtn?: ReactNode;
}): JSX.Element {
	return (
		<ModalBase {...props} aria-labelledby="modal-title">
			<Box
				sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4
				}}>
				<Grid
					item
					xs={12}
					sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
					<Typography
						id="modal-title"
						variant="h2"
						sx={{ fontSize: '1.85rem', fontWeight: 700, width: '75%' }}>
						{title}
					</Typography>
					{closeBtn || (
						<ModalCloseButton>
							<IconButton type="button" aria-label="Fermer">
								<CloseIcon />
							</IconButton>
						</ModalCloseButton>
					)}
				</Grid>
				{children}
			</Box>
		</ModalBase>
	);
}

function useModalToggle() {
	const context = React.useContext(ModalContext);

	if (context === undefined) {
		throw new Error('useOpen must be within a ModalProvider');
	}
	return context;
}

export { ModalProvider, BasicModal, ModalCloseButton, ModalOpenButton, useModalToggle };
