@extends('layout')
@section('title', 'Minesweeper')
@section('content')

<div class="container vhcenter" oncontextmenu="return false;">
    <div class="row mt-1 justify-content-center animate-move-center-left difficulty">
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-4  bordered">
            <label class="counter" onclick="init(12, 17, 50)">Beginner</label>
        </div>
    </div>
    <div class="row mt-1 justify-content-center animate-move-center-left difficulty">
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-4  bordered">
            <label class="counter" onclick="init(16, 25, 100)">Intermediate</label>
        </div>
    </div>
    <div class="row mt-1 justify-content-center animate-move-center-left difficulty">
        <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4 col-4  bordered">
            <label class="counter" onclick="init(20, 30, 150)">Expert</label>
        </div>
    </div>

    <div class="row full-width" style="display: none;" id="topbar">
        <div class="col-5 bordered">
            <label id="time_count" class="counter float-left">0</label>
        </div>
        <div class="col-2 bordered" onclick="newGame()">
            <label class="counter" id="play">New Game</label>
        </div>
        <div class="col-5 bordered">
            <label id="mine_count" class="counter float-right"></label>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script src="{{ asset('minesweeper.js') }}"></script>
@endsection