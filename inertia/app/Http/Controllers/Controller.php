<?php

namespace App\Http\Controllers;

use App\Exceptions\CustomException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function errorAPI(string|\Exception|null $message = null, $statusCode = null, $errors = [], $data = [])
    {
        $allowedStatus = [100, 101, 200, 201, 202, 203, 204, 205, 206, 300, 301, 302, 303, 304, 305, 306, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 500, 501, 502, 503, 504, 505];

        $finalStatusCode = 500;

        $msg = null;
        if ($message instanceof CustomException) {
            $msg = $message->getMessage();
            $finalStatusCode = in_array($message->getStatusCode(), $allowedStatus) ? $message->getStatusCode() : $finalStatusCode;
        } else if ($message instanceof \Exception) {
            $msg = $message->getMessage();
            $finalStatusCode = in_array($message->getCode(), $allowedStatus) ? $message->getCode() : $finalStatusCode;
        } else {
            $msg = $message;
        }

        if ($statusCode && $statusCode !== $finalStatusCode) {
            $finalStatusCode = $statusCode;
        }

        return response()->json([
            'success' => false,
            'message' => $msg,
            'errors' => $errors,
            "data" => $data,
        ], $finalStatusCode);
    }

    public function successAPI($data, $message = null, $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'errors' => null,
            "data" => $data,
        ], $statusCode);
    }
}
