export interface Artist {
  "id": string;
  "type": string;
  "name": string;
  "uri": string;
  "href": string;
  "external_urls": object;
}

export interface Track {
  "id": string;
  "type": string;
  "name": string;
  "artists": Artist[];
  "album": Album;
  "duration_ms": number;
  "preview_url": string;
  "is_local": boolean;
  "is_playable": boolean;
  "explicit" : boolean;
  "href": string;
  "external_ids": object;
  "external_urls": object;
}

export interface Album {
  "id": string;
  "album_type": string;
  "name": string;
  "images": Image[];
  "artists": Artist[];
  "external_urls": object;
  "href": string;
  "uri": string;
}

export interface Image {
  "width": number|null;
  "height": number|null;
  "url": string;
}

export interface PlayerState {
  status: string;
  volume: number;
  currentTime: number;
  previewDuration: number;
  isLoop: boolean;
}

export interface Playlist {
  playingId: number;
  tracks: string[];
}