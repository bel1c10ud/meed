import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const getAccessToken = async () => {
  const { data } = await axios({
    url: TOKEN_ENDPOINT,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      'grant_type': 'refresh_token',
      'refresh_token': refresh_token,
    }
  });

  return data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getAccessToken();

  res.status(200).json(token);
}