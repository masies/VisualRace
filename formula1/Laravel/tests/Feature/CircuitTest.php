<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

class CircuitTest extends TestCase
{

    public function testEmptyRaceId()
    {
        $response = $this->get('/api/circuit');
        $response->assertOk();

        $response = $this->get('/api/circuit?race_id=');
        $response->assertOk();
    }

    public function testStructure()
    {
        $response = $this->get('/api/circuit');

        $response->assertOk()->assertJsonStructure([
           'min_lon',
           'min_lat',
           'max_lon',
           'max_lon',
           'centroid',
       ]);
    }


    public function testValues()
    {
        $race_id = "Varano";
        $response = $this->get('/api/circuit?race_id='.$race_id);
        $response->assertOk();
        $this->assertTrue($response['min_lon'] <= $response['max_lon']);
        $this->assertTrue($response['min_lat'] <= $response['max_lat']);
        
    }
}
