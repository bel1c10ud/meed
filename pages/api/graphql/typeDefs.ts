import { DocumentNode } from "apollo-link";
import { gql } from "apollo-server-micro";

export const typeDefs: DocumentNode = gql`
  type Image {
    width: Int
    height: Int
    url: String
  }

  type Artist {
    id: String
    type: String
    name: String
  }
  
  type Album {
    id: String
    type: String
    name: String
    artists: [Artist]
    images: [Image]
    tracks: AlbumTracks
  }

  type Track {
    id: String
    type: String
    name: String
    artists: [Artist]
    album: Album
    duration_ms: Int
    preview_url: String
    explicit: Boolean
  }

  type AlbumTracks {
    items: [Track]
  }

  type PlaylistItem {
    track: Track
  }

  type PlaylistTracks {
    items: [PlaylistItem]
  }

  type Playlist {
    id: String
    name: String
    tracks: PlaylistTracks
  }

  type Query {
    getTrack(id: String!): Track
    getPlaylist(id: String!): Playlist
    getAlbum(id: String!): Album
}`