const { PROD, DEV, VITE_API } = import.meta.env;

export const appConfig = {
	debug: DEV,
	isProd: PROD,
	isDev: DEV,
	baseAPI: VITE_API
}
