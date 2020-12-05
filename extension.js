const vscode = require('vscode')
const escapeStringRegexp = require('escape-string-regexp')
const PACKAGE_NAME = 'blade_linter'

let config = {}
let drb = ''
let dnl = ''
let sws = ''

async function activate(context) {
    await readConfig()

    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration(PACKAGE_NAME)) {
            await readConfig()
        }
    })

    context.subscriptions.push(vscode.commands.registerCommand('bl.lint', async () => {
        let editor = vscode.window.activeTextEditor

        if (editor) {
            let {document} = editor
            let txt = document.getText()

            txt = txt
                // remove trailing ',' in array
                .replace(new RegExp(/,\n( +)?\]/g), '\n$1]')
                // add space before '@..('
                .replace(new RegExp(`@(${drb})\\(`, 'g'), '@$1 (')
                // add new line after '@..'
                .replace(new RegExp(`@(${dnl})\n(.)`, 'g'), '@$1\n\n$2')
                // '{{ | {!!' not followed by '\n'
                .replace(new RegExp(/{({|!!|)(--)?(?!(\n))( +)?/g), '{$1$2 ')
                // '}} | !!}' not preceded by '\s' aka.not on its own line
                .replace(new RegExp(/(?<!(\s+))( +)?(--)?(!!|})}/g), ' $3$4}')
                // space after ','
                .replace(new RegExp(/(['"]),( +)?([\d\$\[])/g), '$1, $3')
                // surround with spaces
                .replace(new RegExp(`( +)?(${sws})( +)?(?!\n)`, 'g'), ' $2 ')

            await editor.edit(
                (edit) => edit.replace(
                    new vscode.Range(0, 0, document.lineCount, 0),
                    txt
                ),
                {undoStopBefore: false, undoStopAfter: false}
            )
        }
    }))
}

async function readConfig() {
    config = await vscode.workspace.getConfiguration(PACKAGE_NAME)
    drb = prepareArray(config.drb)
    dnl = prepareArray(config.dnl)
    sws = prepareArray(config.sws)
}

function prepareArray(arr) {
    return arr.map((e) => escapeStringRegexp(e)).join('|')
}

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
