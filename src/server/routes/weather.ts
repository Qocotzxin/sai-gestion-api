/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

import express, { Request, Response } from 'express';
import request from 'request';
import {
  IPINFO_TOKEN,
  IPINFO_URL,
  OW_BASEPATH,
  OW_PARAMS,
} from '../config/config';
import {
  IPInfoResponse,
  OpenWeatherApiResponse,
  SimpleCoordinates,
  WeatherDataParams,
} from '../models/weather';

const app = express();

/**
 * Obtiene el clima del momento mediante latitud/longitud
 * o mediante la ciudad.
 * @param positionData: WeatherDataParams
 * @param res: Response
 */
const getWeatherData = (positionData: WeatherDataParams, res: Response) => {
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
 * Si el usuario bloque el gps, este metodo busca las coordenadas
 * o la ciudad mediante la ip.
 * @param req: Request
 * @param res: Response
 * @returns void
 */
const searchLocationByIp = (req: Request, res: Response): void => {
  request(
    {
      // Se busca la ip en el request solo en produccion para evitar que tome la IP del proxy de Heroku
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
 * Endpoint del tipo POST que devuelve el clima actual basado en la ubicacion del usuario.
 * Se le puede enviar un body con las coordenadas.
 */
app.post('/v1/weather/current', (req: Request, res: Response): void => {
  if (!req.body.position) {
    searchLocationByIp(req, res);
  } else {
    getWeatherData({ coordinates: req.body.position }, res);
  }
});

module.exports = app;
