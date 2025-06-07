import dotenv from 'dotenv';
dotenv.config();

// TODO: Define a class for the Weather object
export interface WeatherObject {
  city?: string;
  id? : number;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number,
}
// TODO: Complete the WeatherService class

export class WeatherService {

  baseURL: string;
  apiKEY: string;
  cityName: string;

  constructor(cityName: string) {

    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKEY = process.env.API_KEY || '';
    this.cityName = cityName;
  }

    async getWeatherForCity(): Promise<WeatherObject | null>{
     try {
       const url_string = `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKEY}&units=imperial`;
       const response = await fetch(url_string);
       
       if (!response.ok) {
         throw new Error(`Error: ${response.status} ${response.statusText}`);
       }
 
       const data: any = await response.json();
 
       const weather_object : WeatherObject  = {
         city: data.name,
         date: new Date(data.dt * 1000).toLocaleDateString('es-ES'),
         icon: data.weather[0].icon,
         iconDescription: data.weather[0].description,
         tempF: data.main.temp,
         windSpeed: data.wind.speed,
         humidity: data.main.humidity
       };
 
       return weather_object;
 
     } catch (error) {
       console.error(`Error obtaining weather: ${(error as Error).message}`);
       return null;
     }
   }

  async getWeatherForecast(): Promise<Array<WeatherObject> | null> {

    const url_string = `${this.baseURL}/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKEY}&units=imperial`;
    const response = await fetch(url_string);
    const forecast_arr : Array<WeatherObject> =  [];

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    let curr_day : string = "start";

    data.list.forEach((element : any) => {
      const format_day : string = new Date(element.dt * 1000).toLocaleDateString('es-ES');
      if (format_day != curr_day) {
        curr_day = format_day;

        const curr_day_weather : WeatherObject = {
          city : this.cityName,
          id: element.weather[0].id,
          date : format_day,
          icon: element.weather[0].icon,
          iconDescription: element.weather[0].description,
          tempF: element.main.temp,
          windSpeed: element.wind.speed,
          humidity: element.main.humidity
        };

        forecast_arr.push(curr_day_weather);
      }
    });

    return forecast_arr;
  }
}