// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import genOption from './generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "apitester" is now active!');
	let output: vscode.OutputChannel = vscode.window.createOutputChannel("ApiTester");
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.runApiTester', async () => {
		
		if(vscode.window.activeTextEditor){
			try{
				var f = vscode.workspace.workspaceFolders;
				if(!f || f.length === 0){
					return;
				}
				var globalUri: vscode.Uri = vscode.Uri.file(f[0].uri.path + '/global.yaml');
				var globalDoc = '';
				try{
					globalDoc = (await vscode.workspace.fs.readFile(globalUri)).toString();
				}catch (e) {}

				const localDoc = vscode.window.activeTextEditor.document.getText();
				const options = genOption(globalDoc, localDoc);
				let res = await axios(options);
				output.show();
				output.clear();
				output.appendLine(vscode.window.activeTextEditor.document.fileName);
				output.appendLine(JSON.stringify(options, null, 2));
				output.appendLine('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
				output.appendLine(JSON.stringify(res.data, null, 2));
			}catch (e){
					output.show();
					output.clear();
					output.appendLine(vscode.window.activeTextEditor.document.fileName);
					output.appendLine("ERROR : " + e.message);
			}
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
