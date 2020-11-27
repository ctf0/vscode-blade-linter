const vscode = require('vscode')

async function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('bl.lint', async () => {
        let editor = vscode.window.activeTextEditor

        if (editor) {
            let {document} = editor
            let txt = document.getText()

            txt = txt
                .replace(new RegExp(/,\n(\s+)?\]/g), '\n$1]')
                .replace(new RegExp(/@(if|elseif|foreach)\(/g), '@$1 (')
                .replace(new RegExp(/@(endphp|endforeach)\n(.)/g), '@$1\n\n$2')
                .replace(new RegExp(/{!!(\s+)?/g), '{!! ')
                .replace(new RegExp(/(\s+)?!!}/g), ' !!}')
                .replace(new RegExp(/{{(?!--)(\s+)?/g), '{{ ')
                .replace(new RegExp(/(?<!(\s+|--))(\s+)?}}/g), ' }}')
                .replace(new RegExp(/(['"]),(\s+)?([0-9\$])/g), '$1, $3')
                .replace(new RegExp(/(\s+)?=>(\s+)?/g), ' => ')

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

exports.activate = activate

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
