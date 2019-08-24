import * as assert from 'assert';
import { before } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

import genOption from '../../generator';

suite('Extension Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test("Gen", function() {
		// readGlobal();
		let gContent = `
var:
  host: http://127.0.0.1
  port: 8080
  rule: 3
field:
  header:
    Content-Type: text/html
    Keep-Alive: 100
    method: post
  data:
    token: 121212`;

		let lContent = `
#fasdfasd
#asdfasd

url: <host>:<port>/api/v1/auth/login
method: get
header:
  Content-Type: application/json
data:
  username: admin-hx
  password: admin1
  rule: <rule>
  captcha: '8888'
  token: 11111111
# header: <commonHeader>`;

		var option = genOption(gContent, lContent);
		console.log(option);
		assert.equal(option.url, 'http://127.0.0.1:8080/api/v1/auth/login');
		assert.equal(option.method, 'get');
		assert.equal(option.data.rule, 3);
	});
});
