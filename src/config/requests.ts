type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestProps = {
	body?: Body;
	headers?: Headers | any;
	method?: Methods;
	[k: string]: any;
};

type PublicHolidaysTerritories =
	| 'alsace-moselle'
	| 'guadeloupe'
	| 'la-reunion'
	| 'guyane'
	| 'martinique'
	| 'metropole'
	| 'mayotte'
	| 'nouvelle-caledonie'
	| 'polynesie-francaise'
	| 'saint-barthelemy'
	| 'saint-martin'
	| 'saint-pierre-et-miquelon'
	| 'wallis-et-futuna';

export async function client(
	endpoint: string | URL,
	{ body, ...options }: RequestProps = {}
): Promise<Response> {
	const config = {
		method: body ? 'POST' : 'GET',
		...options,
		headers: {
			...options?.headers
		}
	};

	const response: Response = await fetch(endpoint as RequestInfo, config);

	if (response.ok || response.status >= 200) {
		return response.json();
	} else {
		return Promise.reject(response);
	}
}

export const bankHolidaysUrl = (
	year: number | string,
	territory: PublicHolidaysTerritories = 'metropole'
): string => `https://calendrier.api.gouv.fr/jours-feries/${territory}/${year}.json`;

export const getBankHolidays = (url: string) => client(url);
