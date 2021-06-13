<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NotFoundTest extends TestCase
{
	use WithFaker;
	public function testNotFound()
	{
		$randomPath = $this->faker->lexify('****************************************');
		$response = $this->get($randomPath);
		$response->assertNotFound();

	}
}
