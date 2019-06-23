/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Response, Request } from 'express';
import request from 'request';
import {
  IpLocation,
  SimpleCoordinates,
  OpenWeatherApiResponse,
  WeatherDataParams,
} from '../models/weather';

const app = express();
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiData = '&appid=dd38ea8bc2ba3a1e81d195a9d4a7be24&lang=es&units=metric';

const getWeatherData = (positionData: WeatherDataParams, res: Response) => {
  let requestUrl;

  if (positionData.coordinates) {
    const { latitude, longitude } = positionData.coordinates;
    requestUrl = {
      url: `${apiUrl}lat=${latitude}&lon=${longitude}${apiData}`,
    };
  } else {
    const country = positionData.country;
    requestUrl = {
      url: `${apiUrl}q=${country}${apiData}`,
    };
  }

  request(
    requestUrl,
    (error: Error, response: request.Response, body: string) => {
      const parsedBody: OpenWeatherApiResponse = JSON.parse(body);

      if (error || +parsedBody.cod !== 200) {
        res
          .status(500)
          .json({ ok: false, err: error ? error.message : parsedBody.message });
      } else {
        res.status(200).json({ ok: true, weather: parsedBody });
      }
    }
  );
};

const searchLocationByIp = (res: Response) => {
  request(
    { url: 'https://json.geoiplookup.io' },
    (error: Error, response: request.Response, body: string) => {
      if (error) return res.status(500).json({ ok: false, err: error.message });

      const parsedBody: IpLocation = JSON.parse(body);

      if (parsedBody.latitude) {
        const coordinates: SimpleCoordinates = {
          latitude: +parsedBody.latitude,
          longitude: +parsedBody.longitude,
        };
        getWeatherData({ coordinates }, res);
      } else {
        const country = parsedBody.country_name;
        getWeatherData({ country }, res);
      }
    }
  );
};

app.post('/weather', (req: Request, res: Response) => {
  if (!req.body.position) {
    searchLocationByIp(res);
  } else {
    getWeatherData({ coordinates: req.body.position }, res);
  }
});

module.exports = app;
