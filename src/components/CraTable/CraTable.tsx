import * as React from 'react';
import { Link } from 'react-router-dom';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// TODO: sorting (by date ?)
export function CraTable(props: { list: PDFList; onDeleteCb?: (id: string) => void }) {
	const formatDate = React.useCallback((year: number, month: number) => {
		if (Number.isNaN(year) || Number.isNaN(month)) return null;
		return new Date(year, month).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long'
		});
	}, []);

	return (
		<>
			{props?.list.length > 0 ? (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Lien</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{props.list.map((pdf, index) => (
								<TableRow key={pdf?.id ?? index}>
									<TableCell>
										<Link to={`/${pdf.id}`}>
											CRA {formatDate(pdf?.payload?.year, pdf?.payload?.month)}
										</Link>
									</TableCell>
									<TableCell>{formatDate(pdf?.payload?.year, pdf?.payload?.month)}</TableCell>
									<TableCell>
										<IconButton
											edge="end"
											aria-label="Supprimer"
											onClick={() => props?.onDeleteCb && props.onDeleteCb(pdf.id)}>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<p>Vous n'avez pas encore enregistrer de PDF</p>
			)}
		</>
	);
}
