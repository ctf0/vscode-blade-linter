{{--test--}}
{{--
    test
    --}}
{{'one'}}
{{
'one'
    }}
{!!'one'!!}
{!!
'one'
    !!}

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
    $six = $one??$two;
    $svn = $one?'yes':$two;
    $svn = $one ? 'yes' : $two;
    $svn = $one
    ?'yes'
    :$two;
@endphp
<hr>

@include('',['var'=>['one',1,$two]])