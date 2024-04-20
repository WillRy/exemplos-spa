<?php

namespace App\Exceptions;

class CustomException extends \Exception
{
    protected $statusCode = 500;

    public function getStatusCode()
    {
        return $this->statusCode;
    }
}
