import { deleteAlbum, getAlbumById, getAlbumTracks, updateAlbumTitle } from "$lib/server/db";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (({params, locals}) => {
    const albumId = parseInt(params.albumId);
    if(!albumId){
        throw error(404, 'Album not found');
    }

    const album = getAlbumById(albumId);
    if(!album){
        throw error(404, 'Album not found');
    }


    const tracks = getAlbumTracks(albumId);

    return {
        album,
        tracks,
        isAdmin: locals?.roles?.includes('admin')
    }

}) satisfies PageServerLoad;


export const actions: Actions = {
    updateAlbumTitle: async ({request, locals}) => {

        if(!locals.username || !locals?.roles?.includes('admin')){
            throw error(401, { message: 'Unauthorized'});
        }

        const data = await request.formData();
        const albumIdStr = data.get('albumId')?.toString();
        const albumId = albumIdStr ? parseInt(albumIdStr) : null;

        const albumTitle = data.get('albumTitle')?.toString();

        if(!(albumId && albumTitle)){
            throw error(400, 'AlbumId or AlbumTitle missing');
        }

        updateAlbumTitle(albumId, albumTitle);

    }, 
    deleteAlbum: async ({request}) => {
        const data = await request.formData();
        const albumIdStr = data.get('albumId')?.toString();
        const albumId = albumIdStr ? parseInt(albumIdStr) : null;

        if(!albumId ){
            throw error(400, 'AlbumId is missing');
        }

        deleteAlbum(albumId);

    }
};
