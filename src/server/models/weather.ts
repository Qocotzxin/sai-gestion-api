/*!
 * SAI - Copyright 2019
 *  Cristian Etchebarne
 */

export interface IpLocation {
  ip: string;
  isp: string;
  org: string;
  hostname: string;
  longitude: string;
  latitude: string;
  postal_code: string;
  city: string;
  country_code: string;
  country_name: string;
  continent_code: string;
  region: string;
  district: string;
  timezone_name: string;
  connection_type: string;
  asn_number: string;
  asn_org: string;
  asn: string;
  currency_code: string;
  currency_name: string;
  success: string;
  cached: string;
}

export interface SimpleCoordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherDataParams {
  coordinates?: SimpleCoordinates | IpLocation;
  country?: string;
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
