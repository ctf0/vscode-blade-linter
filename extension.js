const vscode             = require('vscode')
const escapeStringRegexp = require('escape-string-regexp')
const PACKAGE_NAME       = 'bladeLinter'

let config  = {}
let ignored = []
let drb     = ''
let dnl     = ''
let sws     = ''
let to      = ''
let sac     = ''
let sdws    = ''

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
            let txt        = document.getText()

            if (!checkForExclusions(document.fileName)) {
                txt = txt
                    // remove trailing ',' in array
                    .replace(new RegExp(/,\n([\t ]+)?\]/, 'g'), '\n$1]')
                    // '{{ | {!!' not followed by '\n'
                    .replace(new RegExp(/({({|!!)(--)?)([\t ]+)?(?!(-+)?\n)/, 'g'), '$1 ')
                    // '}} | !!}' not preceded by '\n'
                    .replace(new RegExp(/(?<!(\s|-))([\t ]+)?((--)?(!!|})})/, 'g'), ' $3')

                // add space before '@..('
                if (drb) {
                    txt = txt.replace(new RegExp(`@(${drb})\\(`, 'g'), '@$1 (')
                }

                // add new line after '@..'
                if (dnl) {
                    txt = txt.replace(new RegExp(`@(${dnl})\n(.)`, 'g'), '@$1\n\n$2')
                }

                // space after ','
                if (sac) {
                    txt = txt.replace(new RegExp(`(['"])?,([\t ]+)?([0-9]|${sac})`, 'g'), '$1, $3')
                }

                // surround with spaces
                if (sws) {
                    txt = txt.replace(new RegExp(`([\t ]+)?(${sws})([\t ]+)?(?!\n)`, '\g'), ' $2 ')
                }

                if (to) {
                    txt = txt
                        // surround '..?..:..' with spaces when not on its own line
                        .replace(new RegExp(`(?<!\n((\t| )+)?)([\t ]+)?(?<!\\?)(\\?)(?![\n:])([\t ]+)?([0-9]|${to})`, 'g'), ' $4 $6')
                        .replace(new RegExp(`(?<!\n((\t| )+)?)([\t ]+)?(?<!\\?)(:)(?!\n)([\t ]+)?([0-9]|${to})`, 'g'), ' $4 $6')
                        // space after `? / :' when on new line
                        .replace(new RegExp(`^([\t ]+)(\\?)([\t ]+)?([0-9]|${to})`, 'gm'), '$1$2 $4')
                        .replace(new RegExp(`^([\t ]+)(:)([\t ]+)?([0-9]|${to})`, 'gm'), '$1$2 $4')
                }

                // surround dot with space '$var.something`
                if (sdws) {
                    txt = txt.replace(new RegExp(`([\t ]+)?\\.([\t ]+)?([0-9]|${sdws})`, 'g'), ' . $3')
                }

                // remove extra spaces between text
                txt = txt.replace(new RegExp('([\'"\w]) {2,}(\w)', 'g'), '$1 $2')

                await editor.edit(
                    (edit) => edit.replace(
                        new vscode.Range(0, 0, document.lineCount, 0),
                        txt
                    ),
                    {undoStopBefore: false, undoStopAfter: false}
                )
            }
        }
    }))
}

async function readConfig() {
    config  = await vscode.workspace.getConfiguration(PACKAGE_NAME)
    drb     = prepareRegex(config.spaceBeforeDirectiveCondition)
    dnl     = prepareRegex(config.newLineAfterDirectiveEnd)
    sws     = prepareRegex(config.surroundWithSpace)
    to      = prepareRegex(config.ternaryOperator)
    sac     = prepareRegex(config.spaceAfterComma)
    sdws    = prepareRegex(config.surroundDotWithSpace)
    ignored = config.ignoreFiles
}

function prepareRegex(arr) {
    return arr.map((e) => escapeStringRegexp(e)).join('|')
}

function checkForExclusions(fileName) {
    return ignored.length && ignored.some((el) => fileName.includes(el))
}

/* -------------------------------------------------------------------------- */

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
