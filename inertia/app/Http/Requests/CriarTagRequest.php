<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CriarTagRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function attributes()
    {
        return [
            'nome' => __('custom.nome'),
            'cor_fundo' => __('custom.cor_fundo'),
            'cor_texto' => __('custom.cor_texto'),
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'nome' => 'required|max:255|unique:tags,nome',
            'cor_fundo' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_fundo_invalida'));
                }
            }],
            'cor_texto' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_texto_invalida'));
                }
            }],
        ];
    }
}
