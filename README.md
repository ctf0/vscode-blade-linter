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

- surround `--.--.--` with one space
    > ex.`one.'|'.$two`

## Notes

- rules works as expected for my own needs, if u've any issues plz open a ticket.
- this is more of a search and replace, not a global formatter.
- u can test with [the demo file](demo/index.blade.php)

## Issues

- if u have inline styles/javascript & u have setup the extension to auto-run on save, it might become incorrectly formatted, so to get around that u can use `File: Save Without Formatting`
- the regex is dump, its not a true linter, so inline styles or font declaration might break, so watch out.
