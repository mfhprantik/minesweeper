<?php

namespace App\Http\Controllers;
use Session;
use Illuminate\Http\Request;

define('WIDTH', 30);
define('HEIGHT', 20);
define('MINE_COUNT', 150);

class FrontendController extends Controller
{
    public function index() {
        return view('index', compact('WIDTH', 'HEIGHT', 'MINE_COUNT'));
    }
}
