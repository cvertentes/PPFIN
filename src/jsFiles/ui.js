
'use strict'
import $ from 'jquery';

const oidLookUpClear = () => {
  $('.lookUpFeedback').text('')
  document.getElementById('transactionTable').innerHTML = ''
  document.getElementById('intranet').innerHTML = ''
}

const pixelParserClear = () => {
  document.getElementById('companyGoesHere').innerHTML = ''
  document.getElementById('subtotalGoesHere').innerHTML = ''
  document.getElementById('subtotalGoesHere').innerHTML = ''
  document.getElementById('additionalErrors').innerHTML = ''
  document.getElementById('tableGoesHere').innerHTML = ''
  document.getElementById('keyGoesHere').innerHTML = ''
}

const proxyInspectorClear = () => {
  $('.proxyFeedback').text('')
  document.getElementById('proxyHeaders').innerHTML = ''
}

const proxyInspectorFail = (data) => {
  $("#proxyHeaderDiv").addClass('hide')
  $('.proxyFeedback').text('Something went wrong. Please try again.')
}

const noProxyRoot = () => {
  $('.proxyFeedback').text('No Proxy Root Found.')
}

const oidLookUpFail = (data) => {
  $("#oidLoaderDiv").addClass('hide')
  $('.lookUpFeedback').text('Something went wrong. Please try again.')
}

const noData = () => {
  $('.lookUpFeedback').text('Transaction not found. Please double check Kibana as well.')
  $('#jiraTest').addClass('hide')
  $('#jiraTestBtn').addClass('hide')
}

const companyApiDataFail = (data) => {
  $('.lookUpFeedback').text('Advertiser List failed to load. Please refresh the page.')
}

const createCommentSuccess = (data) => {
  $('#issueInput').val('')
  $('#username').val('')
  $('#password').val('')
  $('.jiraFeedback').text('Thank you for your feedback!')
}

const createCommentFail = (data) => {
  $("#jiraTicketDiv").addClass('hide')
  $('.jiraFeedback').text('Failed to create comment. Please refresh and try again.')
}

const jiraTestSubmitSuccess = () => {
  $('#jiraTestLogFeedbackDiv').removeClass('hide')
  $('#jiraUsername').val('')
  $('#jiraPassword').val('')
  $('#jiraTestLogDiv').addClass('hide')
  $('#jiraTicketFeedback').text('Test successfully logged.')
  const launchTicket = document.getElementById('launchTicketId').innerHTML
  document.getElementById('jiraTicketLink').innerHTML = `<a class="label-control" href='https://jira.cnvrmedia.net/browse/${launchTicket}' target="_blank">${launchTicket}</a>`
}

const jiraTestSubmitFail = () => {
  $('#jiraTestLogDiv').addClass('hide')
  $('#jiraTestLogFeedbackDiv').removeClass('hide')
  $('#jiraUsername').val('')
  $('#jiraPassword').val('')
  $('#jiraTicketFeedback').text('Could not log test. Please try again.')
  const launchTicket = document.getElementById('launchTicketId').innerHTML
  document.getElementById('jiraTicketLink').innerHTML = `<a class="label-control" href='https://jira.cnvrmedia.net/browse/${launchTicket}' target="_blank">${launchTicket}</a>`
}

export {
  oidLookUpClear,
  pixelParserClear,
  proxyInspectorClear,
  oidLookUpFail,
  noData,
  companyApiDataFail,
  createCommentSuccess,
  createCommentFail,
  jiraTestSubmitSuccess,
  jiraTestSubmitFail,
  proxyInspectorFail,
  noProxyRoot
}
