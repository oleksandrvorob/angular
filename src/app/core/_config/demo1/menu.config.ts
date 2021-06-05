export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			'items': [
				{
					'title': 'Pages',
					'root': true,
					'icon-': 'flaticon-add',
					'toggle': 'click',
					'custom-class': 'kt-menu__item--active',
					'alignment': 'left',
					'translate': 'MENU.PAGES',
					'submenu': {
						'type': 'classic',
						'alignment': 'left',
						'items': [
							{
								'title': 'My Account',
								'icon': 'flaticon-file',
								'page': 'index'
							},
							{
								'title': 'Task Manager',
								'icon': 'flaticon-diagram',
								'badge': {
									'type': 'kt-badge--success',
									'value': '2'
								}
							},
							{
								'title': 'Team Manager',
								'icon': 'flaticon-business',
								'submenu': {
									'type': 'classic',
									'alignment': 'right',
									'bullet': 'line',
									'items': [
										{
											'title': 'Add Team Member',
											'icon': ''
										},
										{
											'title': 'Edit Team Member',
											'icon': ''
										},
										{
											'title': 'Delete Team Member',
											'icon': ''
										},
										{
											'title': 'Team Member Reports',
											'icon': ''
										},
										{
											'title': 'Assign Tasks',
											'icon': ''
										},
										{
											'title': 'Promote Team Member',
											'icon': ''
										}
									]
								}
							},
							{
								'title': 'Projects Manager',
								'page': '#',
								'icon': 'flaticon-chat-1',
								'submenu': {
									'type': 'classic',
									'alignment': 'right',
									'bullet': 'dot',
									'items': [
										{
											'title': 'Latest Projects',
											'icon': ''
										},
										{
											'title': 'Ongoing Projects',
											'icon': ''
										},
										{
											'title': 'Urgent Projects',
											'icon': ''
										},
										{
											'title': 'Completed Projects',
											'icon': ''
										},
										{
											'title': 'Dropped Projects',
											'icon': ''
										}
									]
								}
							},
							{
								'title': 'Create New Project',
								'icon': 'flaticon-users'
							}
						]
					}
				},
				{
					'title': 'Features',
					'root': true,
					'icon-': 'flaticon-line-graph',
					'toggle': 'click',
					'alignment': 'left',
					'translate': 'MENU.FEATURES',
					'submenu': {
						'type': 'mega',
						'width': '1000px',
						'alignment': 'left',
						'columns': [
							{
								'heading': {
									'heading': true,
									'title': 'Task Reports',
									'bullet': 'dot'
								},
								'items': [
									{
										'title': 'Latest Tasks',
										'icon': 'flaticon-map'
									},
									{
										'title': 'Pending Tasks',
										'icon': 'flaticon-user'
									},
									{
										'title': 'Urgent Tasks',
										'icon': 'flaticon-clipboard'
									},
									{
										'title': 'Completed Tasks',
										'icon': 'flaticon-graphic-1'
									},
									{
										'title': 'Failed Tasks',
										'icon': 'flaticon-graphic-2'
									}
								]
							},
							{
								'bullet': 'line',
								'heading': {
									'heading': true,
									'title': 'Profit Margins',
									'bullet': 'dot'
								},
								'items': [
									{
										'title': 'Overall Profits',
										'icon': ''
									},
									{
										'title': 'Gross Profits',
										'icon': ''
									},
									{
										'title': 'Nett Profits',
										'icon': ''
									},
									{
										'title': 'Year to Date Reports',
										'icon': ''
									},
									{
										'title': 'Quarterly Profits',
										'icon': ''
									},
									{
										'title': 'Monthly Profits',
										'icon': ''
									}
								]
							},
							{
								'bullet': 'dot',
								'heading': {
									'heading': true,
									'title': 'Staff Management',
									'bullet': 'dot'
								},
								'items': [
									{
										'title': 'Top Management',
										'icon': ''
									},
									{
										'title': 'Project Managers',
										'icon': ''
									},
									{
										'title': 'Development Staff',
										'icon': ''
									},
									{
										'title': 'Customer Service',
										'icon': ''
									},
									{
										'title': 'Sales and Marketing',
										'icon': ''
									},
									{
										'title': 'Executives',
										'icon': ''
									}
								]
							},
							{
								'heading': {
									'heading': true,
									'title': 'Tools',
									'icon': '',
									'bullet': 'dot'
								},
								'items': [
									{
										'title': 'Analytical Reports',
										'icon': ''
									},
									{
										'title': 'Customer CRM',
										'icon': ''
									},
									{
										'title': 'Operational Growth',
										'icon': ''
									},
									{
										'title': 'Social Media Presence',
										'icon': ''
									},
									{
										'title': 'Files and Directories',
										'icon': ''
									},
									{
										'title': 'Audit & Logs',
										'icon': ''
									}
								]
							}
						]
					}
				},
				{
					'title': 'Apps',
					'root': true,
					'icon-': 'flaticon-paper-plane',
					'toggle': 'click',
					'alignment': 'left',
					'translate': 'MENU.APPS',
					'submenu': {
						'type': 'classic',
						'alignment': 'left',
						'items': [
							{
								'title': 'Reporting',
								'icon': 'flaticon-business'
							},
							{
								'title': 'Social Presence',
								'page': 'components/datatable_v1',
								'icon': 'flaticon-computer',
								'submenu': {
									'type': 'classic',
									'alignment': 'right',
									'items': [
										{
											'title': 'Reached Users',
											'icon': 'flaticon-users'
										},
										{
											'title': 'SEO Ranking',
											'icon': 'flaticon-interface-1'
										},
										{
											'title': 'User Dropout Points',
											'icon': 'flaticon-lifebuoy'
										},
										{
											'title': 'Market Segments',
											'icon': 'flaticon-graphic-1'
										},
										{
											'title': 'Opportunity Growth',
											'icon': 'flaticon-graphic'
										}
									]
								}
							},
							{
								'title': 'Sales & Marketing',
								'icon': 'flaticon-map'
							},
							{
								'title': 'Campaigns',
								'icon': 'flaticon-graphic-2',
								'badge': {
									'type': 'kt-badge--success',
									'value': '3'
								}
							},
							{
								'title': 'Deployment Center',
								'page': '',
								'icon': 'flaticon-infinity',
								'submenu': {
									'type': 'classic',
									'alignment': 'right',
									'items': [
										{
											'title': 'Merge Branch',
											'icon': 'flaticon-add',
											'badge': {
												'type': 'kt-badge--danger',
												'value': '3'
											}
										},
										{
											'title': 'Version Controls',
											'icon': 'flaticon-signs-1'
										},
										{
											'title': 'Database Manager',
											'icon': 'flaticon-folder'
										},
										{
											'title': 'System Settings',
											'icon': 'flaticon-cogwheel-2'
										}
									]
								}
							}
						]
					}
				}
			]
		},
		aside: {
			self: {},
			items: [
				// {
				// 	title: 'Dashboard',
				// 	root: false,
				// 	icon: 'flaticon2-architecture-and-city',
				// 	page: 'dashboard',
				// 	translate: 'DASHBOARD',
				// 	bullet: 'dot',
				// },
				{
					title: 'Client',
					root: false,
					icon: 'flaticon2-architecture-and-city',
					svg_icon : 'icon-client',
					page: '/clients',
					translate: 'client',
					bullet: 'dot',
				},
				{
					title: 'Contractors',
					root: true,
					icon: 'flaticon2-lorry',
					svg_icon : 'icon-contractor',
					page: '/contractors',
					translate: 'contractors',
					bullet: 'dot',
				},
				{
					title: 'Article',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-article',
					page: '/article',
					translate: 'article',
					bullet: 'dot',
				},
				{
					title: 'Person',
					root: true,
					icon: 'flaticon2-user',
					svg_icon : 'icon-person',
					page: '/persons',
					translate: 'person',
					bullet: 'dot',
				},
				{
					title: 'Orders',
					root: true,
					icon: 'flaticon2-map',
					svg_icon : 'icon-tour',
					page: '/orders',
					translate: 'orders',
					bullet: 'dot',
				},
				{
					title: 'Bill Run',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-bill',
					translate: 'bill_run',
					page: '/bill-run',
					bullet: 'dot',
					isAdmin: 'SUPERADMIN',
					separator: 'myaccount'
				},
				{
					title: 'Payment Run',
					root: true,
					icon: 'flaticon2-map',
					svg_icon : 'icon-payment',
					page: '/payment-run',
					translate: 'payment_run',
					bullet: 'dot',
					isAdmin: 'SUPERADMIN',
				},
				{
					title: 'Account Books',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-account',
					page: '/account-books',
					translate: 'account_books',
					bullet: 'dot',
					isAdmin: 'SUPERADMIN',
				},
				{

					title: 'Open Positions',
					root: true,
					icon: 'fa fa-building',
					svg_icon : 'icon-position',
					page: '/open-positions',
					translate: 'open-positions',
					bullet: 'dot',
					isAdmin: 'SUPERADMIN',
				},
				{
					title: 'System',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-system',
					page: '/system',
					translate: 'system',
					bullet: 'dot',
					separator: 'management',
					// isAdmin: 'SUPERADMIN',
				},
				{
					title: 'Companies',
					root: true,
					icon: 'fa fa-building',
					svg_icon : 'icon-company',
					page: '/companies',
					translate: 'companies',
					bullet: 'dot',
				},
				{
					title: 'Banks',
					root: true,
					icon: 'fa fa-building',
					svg_icon : 'icon-bank',
					page: '/banks',
					translate: 'banks',
					bullet: 'dot',
				},
				{
					title: 'User Management',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-user',
					page: '/user-manage',
					translate: 'user-manage',
					bullet: 'dot',
					// isAdmin: 'SUPERADMIN',
				},
				{
					title: 'Maps',
					root: true,
					icon: 'flaticon2-note',
					svg_icon : 'icon-maps',
					page: '/maps',
					translate: 'maps',
					bullet: 'dot',
				},
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
