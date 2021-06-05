export interface LayoutConfigModel {
	demo: string;
	self: {
		layout?: string;
		body?: {
			'background-image'?: string,
			'class'?: string,
			'background-position'?: string,
			'background-size'?: string
		};
		logo: any | string;
	};
	portlet?: {
		sticky: {
			offset: number
		}
	};
	loader: {
		enabled: boolean;
		type?: string | 'default' | 'spinner-message' | 'spinner-logo';
		logo?: string;
		message?: string;
	};
	colors: {
		state?: any;
		base: {
			label: string[];
			shape: string[]
		}
	};
	width?: string;
	header: {
		self: {
			skin?: string;
			layout?: string;
			fixed: {
				desktop: any;
				mobile: boolean
			}
		};
		topbar?: {
			search: {
				display: boolean;
				layout: 'offcanvas' | 'dropdown';
				dropdown?: {
					style: 'light' | 'dark';
				}
			};
			notifications: {
				display: boolean;
				layout: 'offcanvas' | 'dropdown';
				dropdown: {
					style: 'light' | 'dark';
				}
			};
			'quick-actions': {
				display: boolean;
				layout: 'offcanvas' | 'dropdown';
				dropdown: {
					style: 'light' | 'dark';
				}
			};
			user: {
				display: boolean;
				layout: 'offcanvas' | 'dropdown';
				dropdown: {
					style: 'light' | 'dark';
				}
			};
			languages: {
				display: boolean
			};
			cart?: {
				display: boolean
			};
			'my-cart'?: any
			'quick-panel': {
				display: boolean
			}
		};
		search?: {
			display: boolean
		};
		menu?: {
			self: {
				display: boolean;
				layout?: string;
				'root-arrow'?: boolean;
			};
			desktop: {
				arrow: boolean;
				toggle: string;
				submenu: {
					skin?: string;
					arrow: boolean
				}
			};
			mobile: {
				submenu: {
					skin: string;
					accordion: boolean
				}
			}
		}
	};
	brand?: {
		self: {
			skin: string
		}
	};
	aside?: {
		self: {
			skin?: string;
			display: boolean;
			fixed?: boolean | any;
			minimize?: {
				toggle: boolean;
				default: boolean
			}
		};
		footer?: {
			self: {
				display: boolean
			}
		};
		menu: {
			dropdown: boolean;
			scroll: boolean;
			submenu: {
				accordion: boolean;
				dropdown: {
					arrow: boolean;
					'hover-timeout': number
				}
			}
		}
	};
	'aside-secondary'?: {
		self: {
			display: boolean;
			layout: string
		}
	};
	subheader?: {
		display: boolean;
		fixed?: boolean;
		layout?: 'subheader-v1' | 'subheader-v2' | 'subheader-v3' | 'subheader-v4' | 'subheader-v5' | 'subheader-v6';
		style?: 'light' | 'solid' | 'transparent';
		daterangepicker?: {
			display: boolean
		}
	};
	content?: any;
	footer?: {
		self?: any;
	};
	'quick-panel'?: {
		display?: boolean
	};
}
