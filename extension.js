const vscode = require('vscode')
const escapeStringRegexp = require('escape-string-regexp')
const PACKAGE_NAME = 'bladeLinter'

let config = {}
let drb = ''
let dnl = ''
let sws = ''
let to = ''
let sac = ''

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
                .replace(new RegExp(/,\n([\t ]+)?\]/, 'g'), '\n$1]')
                // add space before '@..('
                .replace(new RegExp(`@(${drb})\\(`, 'g'), '@$1 (')
                // add new line after '@..'
                .replace(new RegExp(`@(${dnl})\n(.)`, 'g'), '@$1\n\n$2')
                // '{{ | {!!' not followed by '\n'
                .replace(new RegExp(/({({|!!)(--)?)([\t ]+)?(?!(-+)?\n)/, 'g'), '$1 ')
                // '}} | !!}' not preceded by '\n'
                .replace(new RegExp(/(?<!\n((\t|-| )+)?)((--)?(!!|})})/, 'g'), ' $3')
                // space after ','
                .replace(new RegExp(`(['"])?,([\t ]+)?([0-9]|${sac})`, 'g'), '$1, $3')
                // surround with spaces
                .replace(new RegExp(`([\t ]+)?(${sws})([\t ]+)?(?!\n)`, '\g'), ' $2 ')
                // surround '..?..:..' with spaces when not on its own line
                .replace(new RegExp(`(?<!\n((\t| )+)?)([\t ]+)?(?<!\\?)(\\?)(?![\n:])([\t ]+)?([0-9]|${to})`, 'g'), ' $4 $6')
                .replace(new RegExp(`(?<!\n((\t| )+)?)([\t ]+)?(?<!\\?)(:)(?!\n)([\t ]+)?([0-9]|${to})`, 'g'), ' $4 $6')
                // space after `? / :' when on new line
                .replace(new RegExp(`^([\t ]+)(\\?)([\t ]+)?([0-9]|${to})`, 'gm'), '$1$2 $4')
                .replace(new RegExp(`^([\t ]+)(:)([\t ]+)?([0-9]|${to})`, 'gm'), '$1$2 $4')

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
    drb = prepareArray(config.spaceBeforeDirectiveCondition)
    dnl = prepareArray(config.newLineAfterDirectiveEnd)
    sws = prepareArray(config.surroundWithSpace)
    to = prepareArray(config.ternaryOperator)
    sac = prepareArray(config.spaceAfterComma)
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
