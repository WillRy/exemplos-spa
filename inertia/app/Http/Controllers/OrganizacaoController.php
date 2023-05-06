<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrganizacaoController extends Controller
{
    public function index()
    {
        return inertia("painel/Organizacoes");
    }
}
