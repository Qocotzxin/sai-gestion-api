/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import request from 'request';
import { IPINFO_TOKEN, IPINFO_URL, OW_BASEPATH, OW_PARAMS } from '../config/config';
import { IPInfoResponse, OpenWeatherApiResponse, SimpleCoordinates, WeatherDataParams } from '../entities/models/weather';

const app = express();

/**
 * Gets current weather using lat/long or city.
 * @param positionData: WeatherDataParams
 * @param res: Response
 */
function getWeatherData(positionData: WeatherDataParams, res: Response) {
  let requestUrl;

  if (positionData.coordinates) {
    const { latitude, longitude } = positionData.coordinates;
    requestUrl = {
      url: `${OW_BASEPATH}lat=${latitude}&lon=${longitude}${OW_PARAMS}`,
    };
  } else {
    const city = positionData.city;
    requestUrl = {
      url: `${OW_BASEPATH}q=${city}${OW_PARAMS}`,
    };
  }

  request(
    requestUrl,
    (error: Error, _response: request.Response, body: string) => {
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

/**
 * Gets coordinates or city by ip (in case geolocation fails or get blocked).
 * @param req: Request
 * @param res: Response
 * @returns void
 */
function searchLocationByIp(req: Request, res: Response) {
  request(
    {
      // Get IP from request inly in production to avoid proxy from Heroku.
      url:
        process.env.NODE_ENV !== 'dev'
          ? `${IPINFO_URL}/${req.headers['x-forwarded-for']}${IPINFO_TOKEN}`
          : `${IPINFO_URL}${IPINFO_TOKEN}`,
    },
    (error: Error, _response: request.Response, body: string) => {
      if (error) return res.status(500).json({ ok: false, err: error.message });
      const parsedBody: IPInfoResponse = JSON.parse(body);

      if (parsedBody.loc) {
        const coordinates: SimpleCoordinates = {
          latitude: +parsedBody.loc.split(',')[0],
          longitude: +parsedBody.loc.split(',')[1],
        };

        getWeatherData({ coordinates }, res);
      } else {
        const city = parsedBody.city;
        getWeatherData({ city }, res);
      }
    }
  );
};

/**
 * Endpoint: /v1/weather/current
 * Retrieves current weather based on location.
 */
app.post('/v1/weather/current', (req: Request, res: Response) => {
  if (!req.body.position) {
    searchLocationByIp(req, res);
  } else {
    getWeatherData({ coordinates: req.body.position }, res);
  }
});

module.exports = app;
