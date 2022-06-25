export const appConfig = {
	environment: import.meta.env.NODE_ENV,
	isProd: import.meta.env.NODE_ENV === 'production',
	isDev: import.meta.env.NODE_ENV === 'development',
	baseAPI: ''
}

if(appConfig.isProd) throw new Error('Production parameters undefined');
if(appConfig.isDev) appConfig.baseAPI = 'https://server';
