import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { getAlbumById, getAlbumTracks } from "$lib/server/db";

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
        tracks
    }

}) satisfies PageServerLoad;
