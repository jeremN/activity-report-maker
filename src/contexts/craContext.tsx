import * as React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { constants } from '../constants';

type CraContext = {
	client: number | null;
	user: number | null;
	month: Date;
	selectedDays: DayObject[];
	storedClient: ClientsList;
	setStoredClient: (value: ClientsList | ((val: ClientsList) => ClientsList)) => void;
	storedCompany: UserCompanyList;
	setStoredCompany: (value: UserCompanyList | ((val: UserCompanyList) => UserCompanyList)) => void;
	storedPDF: PDF[];
	setStoredPDF: (value: PDFList | ((val: PDFList) => PDFList)) => void;
	dispatch: React.Dispatch<{ type: string } & CraState>;
};
type CraState = {
	client: number | null;
	user: number | null;
	month: Date;
	selectedDays: DayObject[];
};

const initialtReducerState: CraState = {
	client: null,
	user: null,
	month: new Date(new Date().setDate(0)),
	selectedDays: [] as DayObject[]
};

const defaultCraContext: CraContext = {
	client: null,
	user: null,
	month: new Date(new Date().setDate(0)),
	selectedDays: [] as DayObject[],
	storedClient: [] as ClientsList,
	setStoredClient: (value: any) => void 0,
	storedCompany: [],
	setStoredCompany: (value: any) => void 0,
	storedPDF: [],
	setStoredPDF: (value: any) => void 0,
	dispatch: (value: any) => void 0
};

const CraContext = React.createContext<CraContext>(defaultCraContext);

function CraReducer(state: CraState, action: { type: string } & CraState) {
	switch (action.type) {
		case 'SET_CLIENT': {
			return { ...state, client: action.client };
		}
		case 'SET_USER': {
			return { ...state, user: action.user };
		}
		case 'SET_MONTH': {
			return { ...state, month: action.month };
		}
		case 'SET_DAYS': {
			return { ...state, selectedDays: action.selectedDays };
		}
		case 'SET_EMPTY': {
			return { ...initialtReducerState };
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}

function CraContextProvider(props: React.PropsWithChildren<JSX.IntrinsicAttributes>) {
	const [state, dispatch] = React.useReducer(CraReducer, initialtReducerState);

	const [storedClient, setStoredClient] = useLocalStorage<ClientsList>(
		constants.STORAGE_CLIENT_KEY,
		[]
	);
	const [storedCompany, setStoredCompany] = useLocalStorage<UserCompanyList>(
		constants.STORAGE_COMPANY_KEY,
		[]
	);
	const [storedPDF, setStoredPDF] = useLocalStorage<PDFList>(constants.STORAGE_PDF_KEY, []);

	// ? useMemo ?
	const values = {
		storedClient,
		setStoredClient,
		storedCompany,
		setStoredCompany,
		storedPDF,
		setStoredPDF,
		dispatch,
		...state
	};

	return <CraContext.Provider value={values}>{props?.children}</CraContext.Provider>;
}

export { CraContext, CraContextProvider };
