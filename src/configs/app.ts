export const appConfig = {
	environment: process.env.NODE_ENV,
	isProd: process.env.NODE_ENV === 'production',
	isDev: process.env.NODE_ENV === 'development',
	baseAPI: ''
}

if(appConfig.isProd) throw new Error('Production parameters undefined');
if(appConfig.isDev) appConfig.baseAPI = 'https://server';