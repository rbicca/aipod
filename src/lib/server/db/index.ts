import { DB_PATH } from "$env/static/private";
import Database from "better-sqlite3";
import type { Track, Album, AlbumTrack } from "./types";
import bcrypt from 'bcrypt';

const db = new Database(DB_PATH, { verbose: console.log });

export function getInitialTracks(limit = 50) : Track[]{
    const sql = `
    select 
	    t.TrackId as trackId,
        t.Name as trackName,
        a.AlbumId as albumId,
        a.Title as albumTitle,
        at.ArtistId as artistId,
        at.Name as artistName,
        g.Name as genre
    from 
        tracks t
        join albums a on t.AlbumId = a.AlbumId
        join artists at on a.ArtistId = at.ArtistId
        join genres g on t.GenreId = g.GenreId
    limit
        $limit    
    `;

    const cmd = db.prepare(sql);
    const rows = cmd.all({ limit });

    return rows as Track[];
}


export function getAlbumById(albumId: number) : Album {
    const sql = `
    select
	    a.AlbumId as albumId,
        a.Title as albumTitle,
        at.Name as artistName
    from
	    albums a  
        join artists at on a.ArtistId = at.ArtistId
    where
 	    a.AlbumId = $albumId
    `;

    const cmd = db.prepare(sql);
    const row = cmd.get({albumId});

    return row as Album;
}


export function getAlbumTracks(albumId: number) : AlbumTrack[] {
    const sql = `
    select
	    t.TrackId as trackID,
        t.Name as trackName,
        t.Milliseconds as trackMs
    from
	    tracks t
    where
 	    t.AlbumId = $albumId
    order by
	    t.TrackId    
    `;

    const cmd = db.prepare(sql);
    const rows = cmd.all({albumId});

    return rows as AlbumTrack[];
}

export function updateAlbumTitle(albumId: number, albumTitle:string){
    const sql = `
        update albums set Title = $albumTitle where AlbumId = $albumId
    `;

    const cmd = db.prepare(sql);
    cmd.run({albumId, albumTitle});

}

export function deleteAlbum(albumId: number){
    const sql = `
        delete from albums where AlbumId = $albumId
    `;

    const cmd = db.prepare(sql);
    cmd.run({albumId});

}

export function searchTracks(searchTerm: string, limit = 50) : Track[]{
    const sql = `
    select 
	    t.TrackId as trackId,
        t.Name as trackName,
        a.AlbumId as albumId,
        a.Title as albumTitle,
        at.ArtistId as artistId,
        at.Name as artistName,
        g.Name as genre
    from 
        tracks t
        join albums a on t.AlbumId = a.AlbumId
        join artists at on a.ArtistId = at.ArtistId
        join genres g on t.GenreId = g.GenreId
    where
        lower(t.Name) like lower('%' || $searchTerm || '%')
    limit
        $limit    
    `;

    const cmd = db.prepare(sql);
    const rows = cmd.all({ searchTerm, limit });

    return rows as Track[];
}


export async function createUser(username: string, password: string): Promise<void>{

    const sql = `
        insert into users (username, password, roles)
        values ($username, $password, 'admin:moderator')
    `;

    const hash = await bcrypt.hash(password, 12);
    const cmd = db.prepare(sql);
    cmd.run({username, password: hash});

}

export async function checkUserCredentials(username: string, password: string): Promise<boolean> {

    const sql = `
        select password from users where username = $username
    `;

    const cmd = db.prepare(sql);
    const row = cmd.get({ username });
    if(row){
        return bcrypt.compare(password, row.password);
    } else {
        //Operação fake para simular tempo gasto e o usuário não saber que o usuário não existe
        //dã
        await bcrypt.hash(password,12);
        return false;
    }

}