const isProd = import.meta.env.NODE_ENV === 'production';
const isDev = !isProd;
export const appConfig = {
	environment: 'development',
	debug: isDev,
	isProd,
	isDev,
	baseAPI: ''
}

if(appConfig.isProd) {
	appConfig.baseAPI = 'http://207.246.75.75:8100';
	
}
if(appConfig.isDev) {
	appConfig.baseAPI = 'http://localhost:8100';
}
