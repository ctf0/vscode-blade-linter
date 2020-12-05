{{--test--}}

{{'one'}}
{!!'one'!!}

@if(true)
    hello
@endif

@php
    $one = 'test';
    $two = [
        'one',
        'two',
    ];

    $thr = $one||$two;
    $four = $one&&$two;
    $five = $one?:$two;
    $five = $one??$two;
@endphp
<hr>

@include('',['var'=>['one','two']])