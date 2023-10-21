<?php

namespace App\Service;


class ResponseJSON {

    protected bool $success = true;

    protected $data = [];

    protected ?string $message = null;

    protected ?array $errors = [];

    protected int $statusCode = 200;

    protected array $allowedStatus = [100, 101, 200, 201, 202, 203, 204, 205, 206, 300, 301, 302, 303, 304, 305, 306, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 500, 501, 502, 503, 504, 505];

    public function setData(mixed $data = null)
    {
        $this->data = !empty($data) ? $data : [];
        return $this;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setMessage(string|\Exception|null $message = null)
    {
        if ($message instanceof \Exception) {
            $this->message = $message->getMessage();
        } else {
            $this->message = $message;
        }

        return $this;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function setStatusCode(int $statusCode)
    {
        $this->statusCode = in_array($statusCode, $this->allowedStatus) ? $statusCode : 500;

        return $this;
    }

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setError(string|\Exception|null $error = null)
    {
        $this->success = false;
        $this->statusCode = 500;

        if ($error instanceof \App\Exceptions\CustomException) {
            $this->message = $error->getMessage();
            $this->statusCode = in_array($error->getStatusCode(), $this->allowedStatus) ? $error->getStatusCode() : 500;
        } else if ($error instanceof \Exception) {
            $this->message = $error->getMessage();
            $this->statusCode = in_array($error->getCode(), $this->allowedStatus) ? $error->getCode() : 500;
        } else {
            $this->message = $error;
        }

        return $this;
    }


    public function render()
    {
        return response()->json([
            'success' => $this->success,
            'message' => $this->message,
            'errors' => $this->errors,
            "data" => $this->data,
        ], $this->statusCode);
    }
}
