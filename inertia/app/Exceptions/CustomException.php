<?php

namespace App\Exceptions;

use Throwable;

class CustomException extends \Exception
{
    protected $statusCode = 500;

    public function getStatusCode()
    {
        return $this->statusCode;
    }
}
