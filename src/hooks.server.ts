import { getSession } from "$lib/server/sessionStore";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({event, resolve})=> {
    const { cookies } = event;
    const sid = cookies.get('sid');
    if(sid){
        const session = getSession(sid);
        if(session){
            event.locals.username = session.username;
            event.locals.roles = session.roles;
        }
    }

    const response = await resolve(event);

    // Apply CORS header for API routes
    if (event.url.pathname.startsWith('/api')) {
        // Required for CORS to work
        if(event.request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
                'Access-Control-Allow-Origin': '*',
                }
            });
        }

        response.headers.append('Access-Control-Allow-Origin', `*`);
    }

    return response;
    
}) satisfies Handle;