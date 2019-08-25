'use strict';
import { load } from 'js-yaml';

const TEST_FIELDS: string[] = [
  'url', 'method', 'params', 'data', 'header'
];

export default function genOption(globalDoc: string, localDoc: string) {
  var globalOption = load(globalDoc);
  var localOption = load(localDoc);
  var fieldName: any;
  var globalFields = globalOption ? globalOption['field'] : {};
  var globalVars = globalOption ? globalOption['var'] : {};

  console.log(globalOption);
  console.log(localOption);

  for (fieldName of TEST_FIELDS) {
    if (typeof localOption[fieldName] === 'object') {
      localOption[fieldName] = Object.assign({}, globalFields[fieldName], localOption[fieldName]);
    } else if (!localOption[fieldName] && globalFields[fieldName]) {
      localOption[fieldName] = globalFields[fieldName];
    }
  }
  replaceVariables(localOption, globalVars);
  // console.log(JSON.stringify(localOption));
  return localOption;
}

interface OptionObj<T> {
  [index: string]: T;
}

interface VariableObj<T> {
  [index: string]: T;
}

const varPatten = /<.*?>/g;

function replaceVariables(
  localOption: OptionObj<object | string | number>,
  globalVars: VariableObj<object>
) {
  for (var key in localOption) {
    if (typeof localOption[key] === 'object') {
      replaceVariables(localOption[key] as OptionObj<object>, globalVars);
    } else if (typeof localOption[key] === 'string') {
      console.log(key + ':' + localOption[key]);
      var content: string = localOption[key] as string;
      var vars = content.match(varPatten);
      if (vars) {
        for (var v of vars) {
          var varname = v.slice(1, -1);
          var realValue: any = globalVars[varname];
          localOption[key] = (localOption[key] as string).replace(v, realValue);
        }
      }
    }
  }
}