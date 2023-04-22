import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { getAlbumById, getAlbumTracks } from "$lib/server/db";

export const load = (({params, locals}) => {

    if(!locals?.roles?.includes('admin')){
        throw error(401, 'Sem autorização');
    }

    const albumId = parseInt(params.albumId);
    if(!albumId){
        throw error(404, 'Disco não encontrado');
    }

    const album = getAlbumById(albumId);
    if(!album){
        throw error(404, 'Disco não encontrado');
    }

    const tracks = getAlbumTracks(albumId);

    return {
        album,
        tracks
    }

}) satisfies PageServerLoad;
