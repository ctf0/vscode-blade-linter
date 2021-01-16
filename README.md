# Blade Linter

simple linters rules for blade via regex.

## Usage

- open `blade` file and run `Blade Linter: Lint`

## Rules

- remove trailing `,` in array
    > `['one','two',]`

- add space before directive round brace `@..(`
    > `@if (), @push (), ...`

- add new line after directive end
    > `@endphp, @endif, ...`

- add one space to each side of curly braces
    > `{!! $one !!}, {{ $one }}, {{-- $one --}}`

- add space after `,`
    > `, ['one', $two]`

- surround `||` / `&&` / `??` / `=>` / `?:` with one space
    > `$one || $two, $one && $two, $one ?? $two, ['k' => 'v'], $one ?: $two`

- surround `..?..:..` with one space
    > `isset($one) ? 'yes' : 'no'`

- surround `--.--.--` with one space
    > `$one . '|' . $two`

## Notes

- rules works as expected for my own needs, if u had any issues plz open a ticket.
- this is more of a search and replace, not a global formatter.
- u can test with [the demo file](demo/index.blade.php)

## Issues

- inline styles/javascript or font declaration might break, so watch out.
