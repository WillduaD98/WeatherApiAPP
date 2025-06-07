import { Router, type Request, type Response } from 'express';
const router = Router();

import { City, HistoryService } from '../../service/historyService.js';
import { WeatherObject, WeatherService } from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  // TODO: GET weather data from city name
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  //Here we create a weather service object to fetch forecast
  const currentWeather : WeatherService = new WeatherService(cityName);
  let data : WeatherObject | null = await currentWeather.getWeatherForCity();
  const arr_data : Array<WeatherObject> | null = await currentWeather.getWeatherForecast();

  //Declare our target_data as an array
  if (data && arr_data) {
    // TODO: save city to search history
    const history_service : HistoryService = new HistoryService();
    const city_ : City = {
      name : cityName,
      id: String(arr_data[0].id)
    }

    history_service.addCity(city_);
    const city_arr : Array<WeatherObject> = [data];
    city_arr.push(...arr_data.slice(1));
    return res.status(200).json(city_arr);
  } else {
    return res.status(500).json('Data fetching was not executed.');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {

  try {
    const history_service : HistoryService = new HistoryService();
    const city_history = await history_service.getCities();
    return res.status(200).json(city_history);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err)
  }
});

// * BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const history_service : HistoryService = new HistoryService();
    await history_service.removeCity(id);
    return res.status(200).json('City Removed');
  } catch (err) {
    console.log(err);
    return res.status(500).json(err)
  }

 });

export default router;
