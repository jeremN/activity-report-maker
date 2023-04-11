declare global {
	export type Company = {
		name: string;
		address: string;
		zipCode: string;
		city: string;
		phone: string;
		email: string;
		website: string;
		logo?: string;
	};
	export type Client = Omit<Company, 'logo'>;
	export type ClientsList = Client[];
	export type UserCompanyList = Company[];
	export type PDFList = {
		id: string;
		client: Client;
		user: Company;
		payload: {
			month: number;
			year: number;
			selectedDays: Date[];
			totalSelected: number;
			totalWorkDays: number;
		};
	}[];
}
