<?php

namespace App\Service;

class HelperArray
{
    public static function removerChavesNumericas(array &$array)
    {

        if (empty($array)) {
            return $array;
        }

        foreach ($array as $key => &$value) {
            if (is_array($value)) {
                self::removerChavesNumericas($value);
                $array[$key] = $value;
            }
        }

        $keys = array_keys($array);

        if (is_numeric($keys[0])) {
            $array = array_values($array);
        }

        return $array;
    }
}
