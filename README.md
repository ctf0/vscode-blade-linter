# Blade Linter

simple linters rules for blade via regex rules.

## Usage

- open `blade` file and run `Blade Linter: Lint`

## Rules

- remove trailing `,` in array
    > ex.`['one','two',]`

- add space before directive round brace `@..(`
    > ex.`@if (), @push ()`

- add new line after directive end
    > ex.`@endphp`

- add one space to each side of curly braces
    > ex.`{!! !!}, {{ }}, {{-- --}}`

- add space after `,` when followed by `0-9` / `[` / `$`
    > ex.`, ['one', $two]`

- surround `||` / `&&` / `??` / `=>` / `?:` with one space
    > ex.`$one || $two, $one && $two, $one ?? $two, ['k' => 'v'], $one ?: $two`

## Notes

- rules works as expected for my own needs, if u faced any issues plz open a ticket.
- this is not a formatter, this is basically a search and replace.
