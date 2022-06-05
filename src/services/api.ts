import {appConfig} from "../configs/app";

export const server = {
	login: async (email: string): Promise<Response> => {
		return fetch(`${appConfig.baseAPI}/login`).then((resp) => {
			debugger;
			return resp;
		})
	}
}