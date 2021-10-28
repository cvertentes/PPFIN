import { ParseParams } from './paramsClass.js'
import $ from 'jquery';
export { parseParamFunction, json2table, onParseParam }
// import { itemLevelParse } from './itemLevel.js'

function parseParams(arg) {
  var parseParamsObj = new ParseParams(arg);
  parseParamsObj.returnParsedValues('&');
}

const onParseParam = () => {
  parseParamFunction()
//   itemLevelParse()
//   onGetJiraTicket()
}

const parseParamFunction = () => {
  parseParams($('#qsInput').val())
  $("span:contains('WARNING')").addClass('highlight-yellow');
  $("span:contains('invalid')").addClass('highlight-red');
  $("span:contains('not numeric')").addClass('highlight-red');
  $("span:contains('must be YES or NO')").addClass('highlight-red');
  $("span:contains('cannot end with')").addClass('highlight-red');
  $("span:contains('cannot have duplicates')").addClass('highlight-red');
  $("span:contains('cannot have duplicates')").addClass('highlight-red');
  $("span:contains('special characters')").addClass('highlight-yellow');
  $("span:contains('Item level parameter index is missing')").addClass('highlight-red');
  $("span:contains(' parameter Invalid')").addClass('highlight-red');
  $("span:contains('key is not recognized')").addClass('highlight-red');
  const cidOnTable = $('#tableExcel').find("span:contains('CID')")[0].parentElement.nextElementSibling.innerText
}

/* The function */

function json2table(json, classes) {
  var cols = Object.keys(json[0])

  var headerRow = '';
  var bodyRows = '';

  classes = classes || '';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cols.map(function (col) {
    headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
  });

  json.map(function (row) {
    bodyRows += '<tr>';

    cols.map(function (colName) {
      bodyRows += '<td><span>' + row[colName] + '</span></td>';
    })

    bodyRows += '</tr>';
  });

  return '<table id="tableExcel" class="' +
    classes +
    '"><thead><tr>' +
    headerRow +
    '</tr></thead><tbody>' +
    bodyRows +
    '</tbody></table>';
}