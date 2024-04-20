<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CriarContatoRequest extends FormRequest
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
            'endereco' => 'endereço',
            'numero' => 'número',
            'organizacao_id' => 'organização',
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
            'nome' => 'required|max:255|min:3',
            'email' => 'required|email|max:255|unique:contatos,email',
            'telefone' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (! preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/', $value)) {
                    $fail(__('custom.validacao_telefone_valido'));
                }
            }],
            'cep' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (! preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/', $value)) {
                    $fail(__('custom.validacao_cep_valido'));
                }
            }],
            'endereco' => 'nullable|max:255',
            'bairro' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO',
            'organizacao_id' => 'nullable|exists:organizacoes,id',
        ];
    }
}
