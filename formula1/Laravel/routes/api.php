<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/




Route::get('/timeWindow', function (Request $request) {

	$params = [
		'index' => 'race',  
		'size' => 5000,
		'body'  => [
			"_source" => explode (',',$request->input('field') ),
			'query' => [
				'bool' => [
					'filter' => [
						'range' =>[
							'TimeStamp' => [
								'gte' => $request->input('start'),
								'lte' => $request->input('end')
							]
						]
					],
					'must' => [
						'match' => [ 
							'Driver' => $request->input('driver') 
						],
						"match" => [
							"Race" => $request->input('race_id','')
						]
					],

				]
			]
		]
	];

	return Elasticsearch::search($params);
});


Route::get('/circuit', function (Request $request) {

	$params = [
		"size" => 0, 
		"index" => 'race', 
		'body'  => [
			"query" => [
				"bool" => [
					"must" => [
						"match" => [
							"Race" => $request->input('race_id', '')
						]
					]
				]
			],
			"aggs"  => [
				"centroid"  => [
					"geo_centroid"  => [
						"field" => "coordinates" 
					]
				],
				"max_lat" => [ "max" => [ "field" => "GPS_Latitude" ] ],
				"min_lat" => [ "min" => [ "field" => "GPS_Latitude" ] ],
				"max_lon" => [ "max" => [ "field" => "GPS_Longitude" ] ],
				"min_lon" => [ "min" => [ "field" => "GPS_Longitude" ] ]
			]
		]
	];

	return Elasticsearch::search($params)['aggregations'];
}); 


Route::get('/raceInfo', function (Request $request) {


	$params = [
		"size" => 1, 
		"index" => 'race-info', 
		'body'  => [
			"query" => [
				"bool" => [
					"must" => [
						"match" => [
							"Race" => $request->query('race_id', '')
						]
					]
				]
			]
		]
	];

	return Elasticsearch::search($params)['hits']['hits'];
});

Route::get('/racesList', function (Request $request) {
	$params = [
		"size" => 1000, 
		"index" => 'race-info', 
		"_source" => ["Race"],
	];

	$data = Elasticsearch::search($params);

	$names = [];
	foreach ($data['hits']['hits'] as $hit) {
		array_push($names, $hit['_source']['Race']);
	}

	return $names;
});



