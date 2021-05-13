import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const getRefreshToken = async (code: string|string[]) => {
  const { data } = await axios({
    url: TOKEN_ENDPOINT,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirect_uri
    }
  });

  return data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req && req.query.code) {
    const token = await getRefreshToken(req.query.code);
    res.status(200).json(token);
  } else {
    res.status(200).send("authorize code is required");
  }
}