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
    trackID: number,
    trackName: string,
    trackMs: number
};