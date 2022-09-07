export const appConfig = {
	environment: 'development',
	debug: false,
	isProd: import.meta.env.NODE_ENV === 'production',
	isDev: true,
	baseAPI: ''
}

if(appConfig.isProd) throw new Error('Production parameters undefined');
if(appConfig.isDev) {
	appConfig.baseAPI = 'https://server';
	appConfig.debug = true;
}
