//import { DB_PATH } from "$env/static/private";
import Database from "better-sqlite3";
import type { Track, Album, AlbumTrack, AlbumLov, DbTrack } from "./types";
import bcrypt from 'bcrypt';

//const db = new Database(DB_PATH, { verbose: console.log });
const db = new Database('./data/chinook.db', { verbose: console.log });

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

export function insertTrack(track: DbTrack): void {
	const sql = `
        insert into tracks 
            (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
        values 
            ($name, $albumId, 1, $genreId, $composer, $milliseconds, 8679940, 0.99)
    `;
	    const cmd = db.prepare(sql);
	    cmd.run(track);
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

export function getUsersRoles(username: string): string[]{

    const sql = `
        select roles from users where username = $username
    `;

    const cmd = db.prepare(sql);
    const row = cmd.get({username})
    if(row){
        return row.roles.split(':');
    }

    return [];
}


export function getLovAlbums(searchTerm: string | null = null) {
	const sql = `
        select a.AlbumId as id, 
            a.Title as title, 
            ar.Name as artist
        from 
            albums a
            join artists ar on a.ArtistId = ar.ArtistId
        where 
            $searchTerm is null
            or (
                lower(a.Title) like lower('%' || $searchTerm || '%')
                or lower(ar.Name) like lower('%' || $searchTerm || '%')
            )
        limit 25`;

	const cmd = db.prepare(sql);
	const rows = cmd.all({ searchTerm }) as AlbumLov[];
	return rows;
}

export function getLovGenres(searchTerm: string | null = null) {
	const sql = `
                select g.GenreId as id
                    , g.Name as genre
                from genres g
                where $searchTerm is null
                or lower(g.Name) like lower('%' || $searchTerm || '%')
    limit 25
  `;

	const cmd = db.prepare(sql);
	const rows = cmd.all({ searchTerm }) as AlbumLov[];
	return rows;
}