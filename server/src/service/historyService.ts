// TODO: Define a City class with name and id properties
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDbPath = path.join(__dirname, '../../db', 'searchHistory.json');

export interface City {
  name: string;
  id: string;
};

// TODO: Complete the HistoryService class
export class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const historyFile = await fs.readFile(tempDbPath, 'utf8');
    console.log("Info: searchHistory.json file has been read successfully");
    return historyFile;
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[] | City) {
    const updatedCities = JSON.stringify(cities);
    await fs.writeFile(tempDbPath, updatedCities);
    console.log("Info: searchHistory.json file has been edited successfully");
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // Método para obtener las ciudades desde el archivo
  async getCities() {
    const string_ = await this.read();

    if (string_ == "") {
      return null;
    }

    const parseHistory = JSON.parse(string_);
    return parseHistory;
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(_city: City) {
    const cities: any = await this.getCities();
    let city_registered : boolean = false;
    if (cities === null) {
      // Si no hay ciudades, escribimos la nueva ciudad en un array
      await this.write([_city]);
      return true;
    } else {
      cities.forEach((city: City) => {
        if(_city.name == city.name){
          city_registered = true;
        }
      });

      if (city_registered) {
        return false;
      } else {
        cities.push(_city); 
        await this.write(cities); 
        return true;
      }      
    }
  }

  async removeCity(id: string) {
    const cities: any = await this.getCities();
    const index = cities.findIndex((city : City) => city.id === id);
    if (index !== -1) {
      cities.splice(index, 1);
    }
    await this.write(cities);
  }
}
