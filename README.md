# Blade Linter

simple linters rules for blade via regex rules.

## Usage

- open `blade` file and run `Blade Linter: Lint`

## Rules

- remove trailing `,` in array
    > ex.`['one','two',]`

- add space before directive round brace `@..(`
    > ex.`@if (), @push (), etc..`

- add new line after directive end
    > ex.`@endphp, @endif, etc..`

- add one space to each side of curly braces
    > ex.`{!! $one !!}, {{ $one }}, {{-- $one --}}`

- add space after `,`
    > ex.`, ['one', $two]`

- surround `||` / `&&` / `??` / `=>` / `?:` with one space
    > ex.`$one || $two, $one && $two, $one ?? $two, ['k' => 'v'], $one ?: $two`

- surround `..?..:..` with one space
    > ex.`isset($one) ? 'yes' : 'no'`

## Notes

- rules works as expected for my own needs, if u've any issues plz open a ticket.
- this is more of a search and replace, not a global formatter.
- u can test with [the demo file](demo/index.blade.php)
