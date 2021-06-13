<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TimeWindowTest extends TestCase
{
    public function testEmptyRaceId()
    {
        $response = $this->get('/api/timeWindow');
        $response->assertOk();

        $response = $this->get('/api/timeWindow?race_id=');
        $response->assertOk();
    }

    public function testStructure()
    {
        $response = $this->get('/api/timeWindow?race_id');

        $response->assertOk();
        $response->assertJsonStructure(['hits' => ['hits' => []]]);

        $race_id = "Varano";
        $response = $this->get('/api/timeWindow?race_id='.$race_id);

        $response->assertOk();
        $response->assertJsonStructure(['hits' => ['hits' => [['_source']]]]);


        $race_id = "Varano";
        $fields = ['Race','Coolant','InlineAcc','LateralAcc','coordinates','Driver','RPM','Throttle','TimeStamp','GPS_Speed'];
        $response = $this->get('/api/timeWindow?race_id='.$race_id.'&field='.implode(',',$fields));

        $response->assertOk();
        $response->assertJsonStructure(['hits' => ['hits' => [['_source' => $fields]]]]);
    }

    public function testTypes()
    {
        $race_id = "Varano";
        $fields = ['Race','Coolant','InlineAcc','LateralAcc','coordinates','Driver','RPM','Throttle','TimeStamp','GPS_Speed'];
        $response = $this->get('/api/timeWindow?race_id='.$race_id.'&field='.implode(',',$fields));

        $response->assertOk();
        $content = (array)json_decode($response->content());

        foreach ($content['hits']->hits as $item) {
            $this->assertTrue(is_string($item->_source->Driver));
            $this->assertTrue(is_string($item->_source->Race));
            $this->assertTrue(is_array($item->_source->coordinates));
            $this->assertTrue(is_numeric($item->_source->Coolant));
            $this->assertTrue(is_numeric($item->_source->InlineAcc));
            $this->assertTrue(is_numeric($item->_source->LateralAcc));
            $this->assertTrue(is_numeric($item->_source->RPM));
            $this->assertTrue(is_numeric($item->_source->Throttle));
            $this->assertTrue(is_numeric($item->_source->TimeStamp));
            $this->assertTrue(is_numeric($item->_source->GPS_Speed));
        }       
    }


    public function testValues()
    {
        $race_id = "Varano";
        $fields = ['Race','Coolant','InlineAcc','LateralAcc','coordinates','Driver','RPM','Throttle','TimeStamp','GPS_Speed'];
        $response = $this->get('/api/timeWindow?race_id='.$race_id.'&field='.implode(',',$fields));

        $response->assertOk();
        $content = (array)json_decode($response->content());

        foreach ($content['hits']->hits as $item) {
            $this->assertTrue($item->_source->Coolant >= 0);
            $this->assertTrue($item->_source->RPM >= 0);
            $this->assertTrue($item->_source->Throttle >= 0);
            $this->assertTrue($item->_source->TimeStamp >= 0);
            $this->assertTrue($item->_source->GPS_Speed >= 0);
        }       
    }
}
