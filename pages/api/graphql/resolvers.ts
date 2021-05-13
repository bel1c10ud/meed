import { Resolvers } from '@apollo/client';
import axios from 'axios';
import { GraphQLArgs, GraphQLArgument, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { GraphQLRequestContext } from 'graphql-request/dist/types';
import { GraphQLParseOptions, IResolvers } from 'graphql-tools';

export const resolvers: IResolvers = {
  Query: {
    getTrack: async (parent: GraphQLParseOptions, args: GraphQLFieldConfigArgumentMap, context: GraphQLRequestContext, info: GraphQLResolveInfo) => {
      const response = await axios.get("http://localhost:3000/api/spotify/getAccessToken");
      
      const { data } = await axios({
        method: 'get',
        url: "https://api.spotify.com/v1/tracks/" + args.id + "?market=KR",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${response.data.access_token}`
        },
        params: {
          market: "KR"
        },
      });
      // console.log(data);
      return data;
    },
    getPlaylist: async (parent: GraphQLParseOptions, args: GraphQLFieldConfigArgumentMap, context: GraphQLRequestContext, info: GraphQLResolveInfo) => {
      const response = await axios.get("http://localhost:3000/api/spotify/getAccessToken");
      
      const { data } = await axios({
        method: 'get',
        url: "https://api.spotify.com/v1/playlists/" + args.id + "?market=KR",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${response.data.access_token}`
        },
        params: {
          market: "KR"
        },
      });
      console.log(data);
      return data;
    },
    getAlbum: async (parent: GraphQLParseOptions, args: GraphQLFieldConfigArgumentMap, context: GraphQLRequestContext, info: GraphQLResolveInfo) => {
      const response = await axios.get("http://localhost:3000/api/spotify/getAccessToken");
      
      const { data } = await axios({
        method: 'get',
        url: "https://api.spotify.com/v1/albums/" + args.id + "?market=KR",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${response.data.access_token}`
        },
        params: {
          market: "KR"
        },
      });
      console.log(data);
      return data;
    }
  }
};