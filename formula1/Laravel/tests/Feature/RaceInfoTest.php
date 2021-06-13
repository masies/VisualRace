<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RaceInfoTest extends TestCase
{

    public function testEmptyRaceId()
    {
        $response = $this->get('/api/raceInfo');
        $response->assertOk();

        $response = $this->get('/api/raceInfo?race_id=');
        $response->assertOk();
    }

    public function testStructure()
    {
        $response = $this->get('/api/raceInfo');

        $response->assertOk();
        $response->assertJsonStructure([]);

        $race_id = "Varano";
        $response = $this->get('/api/raceInfo?race_id='.$race_id);

        $response->assertOk();
        $response->assertJsonStructure([["_source"=> ["Race","Start","Drivers"]]]);
    }


    public function testValues()
    {
        $race_id = "Varano";
        $response = $this->get('/api/raceInfo?race_id='.$race_id);
        $response->assertOk();
        $this->assertTrue(is_string($response[0]['_source']['Race']));
        $this->assertTrue($response[0]['_source']['Start'] >= 0);
        $this->assertTrue(is_array($response[0]['_source']['Drivers']));
        
    }
}
