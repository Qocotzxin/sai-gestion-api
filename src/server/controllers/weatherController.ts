/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import { Request, Response } from 'express';
import request from 'request';
import {
  IPINFO_TOKEN,
  IPINFO_URL,
  OW_BASEPATH,
  OW_PARAMS,
} from '../config/config';
import { ERROR_TYPE, setErrorResponse } from '../config/error';
import {
  IPInfoResponse,
  OpenWeatherApiResponse,
  SimpleCoordinates,
  WeatherDataParams,
} from '../schemas/models/weather';

/**
 * Gets coordinates or city by ip (in case geolocation fails or get blocked).
 */
function searchLocationByIp(req: Request, res: Response) {
  request(
    {
      // Get IP from request only in production to avoid proxy from Heroku.
      url:
        process.env.NODE_ENV !== 'dev'
          ? `${IPINFO_URL}/${req.headers['x-forwarded-for']}${IPINFO_TOKEN}`
          : `${IPINFO_URL}${IPINFO_TOKEN}`,
    },
    (error: Error, _response: request.Response, body: string) => {
      if (error)
        return setErrorResponse(res, ERROR_TYPE.INTERNAL, error.message);
      const parsedBody: IPInfoResponse = JSON.parse(body);

      if (parsedBody.loc) {
        const locSplit = parsedBody.loc.split(',');
        const coordinates: SimpleCoordinates = {
          latitude: +locSplit[0],
          longitude: +locSplit[1],
        };

        getWeatherData({ coordinates }, res);
      } else {
        const city = parsedBody.city;
        getWeatherData({ city }, res);
      }
    }
  );
}

/**
 * Gets current weather using lat/long or city.
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
        return setErrorResponse(
          res,
          ERROR_TYPE.INTERNAL,
          error ? error.message : parsedBody.message
        );
      } else {
        res.status(200).json({
          ok: true,
          data: parsedBody,
          message: 'Weather information succesfully retrieved.',
        });
      }
    }
  );
}

/**
 * Retrieves weather information for the current coordinates.
 */
export function weatherData(req: Request, res: Response) {
  if (!req.body.position) {
    searchLocationByIp(req, res);
  } else {
    getWeatherData({ coordinates: req.body.position }, res);
  }
}
