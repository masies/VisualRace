<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RaceListTest extends TestCase
{


    public function testStructure()
    {
        $response = $this->get('/api/racesList');

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    public function testTypes()
    {
        $response = $this->get('/api/racesList');
        $response->assertOk();
        $content = (array)json_decode($response->content());
        foreach ($content as $item) {
            $this->assertTrue(is_string($item));
        }        
    }
}
