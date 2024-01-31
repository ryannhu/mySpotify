export interface UserData {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

export interface ImageObject {
    url: string,
    height: number,
    width: number,
}

export interface ArtistObject {
    external_urls: object,
    followers: Followers,
    genres: string[],
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    popularity: number,
    type: string,
    uri: string
}

interface Followers {
    href: string,
    total: number
}

interface SimplifiedArtistObject {
    external_urls: object,
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

export interface AlbumObject {
    album_type: string,
    total_tracks: number,
    available_markets: string[],
    external_urls: object,
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    release_date: string,
    release_date_precision: string,
    restrictions: object,
    type: string,
    uri: string
    artists: SimplifiedArtistObject[]
    tracks: object, // properly type later
    copyrights: object[],
    external_ids: object,
    genres: string[],
    label: string,
    popularity: number
}

export interface PlaylistObject {
    collaborative: boolean,
    description: string,
    external_urls: object,
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    owner: object,
    primary_color: string,
    public: boolean,
    snapshot_id: string,
    tracks: object, // properly type later
    type: string,
    uri: string
}

enum MusicalKey {
    C = "C",
    CSharp_DFlat = "C♯/D♭",
    D = "D",
    DSharp_EFlat = "D♯/E♭",
    E = "E",
    F = "F",
    FSharp_GFlat = "F♯/G♭",
    G = "G",
    GSharp_AFlat = "G♯/A♭",
    A = "A",
    ASharp_BFlat = "A♯/B♭",
    B = "B"
}

export class MusicalNote {
    private note: MusicalKey;

    constructor(noteNumber: number) {
        this.note = this.numberToMusicalKey(noteNumber);
    }

    private numberToMusicalKey(noteNumber: number): MusicalKey {
        return Object.values(MusicalKey)[noteNumber] || "Unknown";
    }

    getNoteName(): string {
        return this.note;
    }
}

