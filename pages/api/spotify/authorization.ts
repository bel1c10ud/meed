import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if(req && req.query.code) {
    const GET_REFRESHTOKEN_URL = "/api/spotify/getRefreshToken?code=" + req.query.code;

    res.status(200).send('<a href="' + GET_REFRESHTOKEN_URL + '">' + "Get refresh token" + '</a>');
  }

  const AUTHORIZE_URL = "https://accounts.spotify.com/authorize" 
  + '?response_type=code' 
  + '&client_id=' + process.env.SPOTIFY_CLIENT_ID 
  + '&redirect_uri=' + encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI?? "")

  res.status(200).send('<a href="' + AUTHORIZE_URL + '">' + "Authorize" + '</a>');
}