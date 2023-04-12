export declare global {
	type Company = {
		name: string;
		address: string;
		zipCode: string;
		city: string;
		phone: string;
		email: string;
		website: string;
		logo?: string;
	};
	type Client = Omit<Company, 'logo'>;
	type ClientsList = Client[];
	type UserCompanyList = Company[];
	type PDF = {
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
	};
	type PDFList = PDF[];
}
