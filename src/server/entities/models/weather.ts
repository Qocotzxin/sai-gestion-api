/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

export interface IPInfoResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  hostname: string;
  postal: string;
  org: string;
}

export interface SimpleCoordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherDataParams {
  coordinates?: SimpleCoordinates;
  city?: string;
}

export interface OpenWeatherApiResponse {
  coord: { lon: number; lat: number };
  weather: [{ id: number; main: string; description: string; icon: string }];
  base: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  rain: { [id: string]: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  id: number;
  name: string;
  cod: number;
  message?: string;
}
