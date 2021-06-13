# Race Visualization

An interactive web application to visualize live data about a race such as the position of pilots, different stats about different metrics over time such as speed, throttle, etc. 
The user has the possibility to select between different races, what metrics he wants to see in the charts, and for which pilots.

### Installation

You should already have PHP 7.2 installaed on your machines, check if you have it by typing `php -v` in the terminal.

I used PHP 7.4.5 for this project, it should work also with 7.2 but if you have problem install the new one with brew.

Install packages with composer (equivalent to NPM but for PHP)

```
cd Laravel
composer install
npm install && npm run dev
```

You should also have elasticsearch installed, up and running, and you need to ingest the data about the race. To do that simply run `./ingest.sh` inside /Data/ directory.


### Running the server
Laravel offers a quick way to run a HTTP server

` php artisan serve`

will run a server accessible at localhost:8000


### API Routes

In `routes/api.php` the API routes are defined. The endpoint is `/api` so you need to make requests to `localhost:8000/api/<route>`


### API Endpoints

##### rows in time windows
to search results within a time window : 
http://127.0.0.1:8000/api/timeWindow?field={LIST_OF_WANTED_FIELD}&start={START_TIME}&end={END_TIME}&driver={DRIVER_NAME}

http://127.0.0.1:8000/api/timeWindow?field=Driver,RPM,GPS_Speed&start=4&end=5&driver=kiarash,simone

#### Run react 

`npm run watch` in a separate terminal windows

#### Run react tests

`npm tests` also in a separate terminal windows


### Logs

Logs files are your friends, if something is broken go to `./storage/logs`, here you can find all the logs.




## Built With

* [Laravel](https://laravel.com) - Backend Framework
* [ReactJs](https://reactjs.org) - Frontend Framework
* [ApexCharts](https://apexcharts.com) - Visualization Library



## Authors

* **Simone Masiero**  
* **Gregory Wullimann**  
* **Armend Azizi**  
* **Kiarash Jamshidi**  


