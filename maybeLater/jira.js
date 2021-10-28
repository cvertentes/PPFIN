'use strict'

const ui = require('../src/jsFiles/ui.js')
const api = require('./api.js')

// request to pangea api
// pass variables storing input fields
// ticket 915483 - https://jira.cnvrmedia.net/browse/AUTO-13831

const onCreateComment = (event) => {
  event.preventDefault()
  const username = $('#username').val().toLowerCase()
  const password = $('#password').val()
  const issueInput = $('#issueInput').val()
  api.createComment(username, password, issueInput)
    .then(ui.createCommentSuccess)
    .fail(ui.createCommentFail)
}

const onGetJiraTicket = () => {
  const eid = document.getElementById('cidLiValue').innerHTML
  if ($(`[eid = ${eid}]`)[0] == undefined) {
    $('#jiraTestBtn').addClass('hide')
    $('#jiraTest').addClass('hide')
    return
  } else {
    const cid = $(`[eid = ${eid}]`)[0].attributes[2].value
    const res = api.getJiraTicketTests(cid)
    .then((res) => {
      if (res.total == 0) {
        $('#jiraTestBtn').addClass('hide')
        $('#jiraTest').addClass('hide')
      } else {
        $('#jiraTest').addClass('hide')
        $('#jiraTestBtn').removeClass('hide')
        document.getElementById('advertiserName').innerHTML = `<a class="label-control" href='https://www5.cj.com/intranet/getadvertiserdetail.do?cid=${cid}' target="_blank">${res.tickets[0].fields.summary.value}</a>`
        document.getElementById('advertiser_cid').innerHTML = `CID: ${res.tickets[0].fields.customfield_12522.value}`
        document.getElementById('advertiser_eid').innerHTML = `EID: ${eid}`
        document.getElementById('launchTicket').innerHTML = `<a id="launchTicketId" class="label-control" href='https://jira.cnvrmedia.net/browse/${res.tickets[0].key}' target="_blank">${res.tickets[0].key}</a>`
        document.getElementById('testDetailsStore').innerHTML = res.tickets[0].fields.customfield_12427.value
        $('#jiraTicketFeedback').text('')
        $('#jiraTicketLink').text('')
        $('.jiraTestFeedback').text('')
      }
    })
    .fail(console.log)
  }
}

const onJiraTestSubmit = (event) => {
  event.preventDefault()
  const username = $('#jiraUsername').val().toLowerCase()
  const password = $('#jiraPassword').val()
  const ticket = document.getElementById('launchTicketId').innerHTML
  const date = moment().format("MM/DD/YY")
  const inputSelect = `\n\n|${$("#actionTypeSelect option:selected").text()}|${$("#testTypeSelect option:selected").text()}|${$("#testResultSelect option:selected").text()}|${username} ${date}|`
  const testText = `${$('#testDetailsStore').val()} \n ${inputSelect} \n ${$('#testDetails').val()}`

  api.jiraTestSubmit(username, password, ticket, testText)
    .then(ui.jiraTestSubmitSuccess)
    .fail(ui.jiraTestSubmitFail)
}

export {
  onCreateComment,
  onGetJiraTicket,
  onJiraTestSubmit
}
