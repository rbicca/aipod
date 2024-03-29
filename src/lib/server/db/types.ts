export type Track = {
    trackId: number,
    trackName: string,
    albumId: number,
    albumTitle: string,
    artistId: number,
    artistName: string,
    genre: string
};

export type Album = {
    albumId: number,
    albumTitle: string,
    artistName: string
}

export type AlbumTrack = {
    trackID: number;
    trackName: string;
    trackMs: number;
    composer: string;
    genre: string;
};

export type DbTrack = {
	name: string;
	albumId: number;
	genreId: number;
	composer: string;
	milliseconds: number;
};

export type AlbumLov = {
	id: number;
	title: string;
	artist: string;
};

export type GenreLov = {
	id: number;
	genre: string;
};

export type Genre = {
    genreId: number;
    genreName: string;
}