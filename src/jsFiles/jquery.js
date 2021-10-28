'use strict'
import { onExcelFile } from './paramsClass.js'
import $ from 'jquery';
import { onParseParam } from './formAction.js'
const ui = require('./ui.js')
// import { defaultDate, onCompanyListApi, onOidLookUp } from './oidLookUp.js'
// import { onCreateComment, onJiraTestSubmit } from './jira.js'
// import { onProxyHeader } from '../../maybeLater/proxyHeader.js'
// import { onParamLookUp } from '../../maybeLater/paramLookUp.js'



// $('html').ready(defaultDate)
// $('html').ready(onCompanyListApi)
$('html').on('click', '#exportBtn', onExcelFile)

// // UT proxy header button
// $('html').on('submit', '#proxyinspector', function() {
//   $("#proxyHeaderDiv").removeClass('hide')
//   ui.proxyInspectorClear()
//   onProxyHeader(event)
// })

// // submit issue button
// $('html').on('submit', '#jiraForm', function() {
//   $("#jiraTicketDiv").removeClass('hide')
//   onCreateComment(event)
// })

// // jira test log button
// $('html').on('click', '#jiraTestSubmit', function() {
//   $("#jiraTestDiv").removeClass('hide')
//   onJiraTestSubmit(event)
// })

// // oid look up button
// $('html').on('click', '#lookUpBtn', function() {
//   $("#oidLoaderDiv").removeClass('hide')
//   $('#jiraTestLogDiv').addClass('hide')
//   ui.oidLookUpClear()
//   ui.pixelParserClear()
//   onOidLookUp(event)
//   $('#itemListDiv').addClass('hide')
//   document.getElementById('itemLevelParseBtn').innerHTML = 'Item Level Info'
//   $('#itemLevelParseBtn').removeClass('hide')
// })

// // param look up  button
// $('html').on('click', '#paramLookUpBtn', function() {
//   $("#oidLoaderDiv").removeClass('hide')
//   $('#jiraTestLogDiv').addClass('hide')
//   onParamLookUp(event)
// })

// parse param button
$('html').on('click', '#parse-ampersand', function() {
  document.getElementById('transactionTable').innerHTML = ''
  // document.getElementById('intranet').innerHTML = ''
  // document.getElementById('oidLookUpForm').reset()
  // defaultDate()
  ui.pixelParserClear()
  onParseParam()
  $('#itemListDiv').addClass('hide')
  // document.getElementById('itemLevelParseBtn').innerHTML = 'Item Level Info'
  // $('#itemLevelParseBtn').removeClass('hide')
})

// // item level parse button
// $('html').on('click', '#itemLevelParseBtn', function() {
//   if ($("#itemListDiv").hasClass('hide')) {
//     $('#itemListDiv').removeClass('hide')
//     document.getElementById('itemLevelParseBtn').innerHTML = 'Hide Item Level Info'
//   } else {
//     $('#itemListDiv').addClass('hide')
//     document.getElementById('itemLevelParseBtn').innerHTML = 'Item Level Info'
//   }
// })

// // log test to jira button
// $('html').on('click', '#jiraTestBtn', function() {
//   $('#jiraTest').removeClass('hide')
//   $('#jiraTestLogFeedbackDiv').addClass('hide')
//   $('#jiraTestLogDiv').removeClass('hide')
//   $('#jiraTestBtn').addClass('hide')
// })

// // cancel logging test to jira button
// $('html').on('click', '#jiraTestCancel', function() {
//   $('#jiraTest').addClass('hide')
//   $('#jiraTestBtn').removeClass('hide')
// })

// // oid look up toggle button
// $('html').on('click', '#onOidLookUpBtn', function() {
//   $('#option1Label').removeClass('hide')
//   $('#oid').removeClass('hide')
//   $('#option2Label').addClass('hide')
//   $('#param').addClass('hide')
//   $('#lookUpBtn').removeClass('hide')
//   $('#paramLookUpBtn').addClass('hide')
// })

// // param look up toggle button
// $('html').on('click', '#onParamLookUpBtn', function() {
//   $('#option1Label').addClass('hide')
//   $('#oid').addClass('hide')
//   $('#option2Label').removeClass('hide')
//   $('#param').removeClass('hide')
//   $('#lookUpBtn').addClass('hide')
//   $('#paramLookUpBtn').removeClass('hide')
// })
