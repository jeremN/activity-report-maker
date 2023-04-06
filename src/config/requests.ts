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

export const API = {
	publicHolidays: (
		year: number | string,
		territory: PublicHolidaysTerritories = 'metropole'
	): string => `https://calendrier.api.gouv.fr/jours-feries/${territory}/${year}.json`
};
