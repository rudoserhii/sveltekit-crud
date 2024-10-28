import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	if (event.url.pathname === '/login') {
	} else {
		if (!event.locals.auth?.token) {
			return redirect(301, '/login');
		}
	}

	return event.locals.auth;
};
