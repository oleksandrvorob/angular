export interface DatatableColumnModel {

	data?: number;
	name?: string;
	searchable?: boolean;
	orderable?: boolean;
	search?: {
		value?: string;
		regex?: boolean;
	};
}
