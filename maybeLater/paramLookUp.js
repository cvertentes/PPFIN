'use strict'

const api = require('./api.js')
const ui = require('./ui.js')

const onParamLookUp = (event) => {
  event.preventDefault()
  $('#jiraTestLogDiv').addClass('hide')
  const eid = $('#selectCid option:selected').attr('eid')
  const param = $('#param').val().toLowerCase()
  const date = $('#date').val()
  const unix = moment(date).format('x')
  let dateRange = ''
  let currentDate = moment(date).format('YYYY'+'-'+'MM'+'-'+'DD')
  const today = moment().format('YYYY'+'-'+'MM'+'-'+'DD')
  while (currentDate <= today) {
    dateRange = ('activity-' + moment(currentDate).format('YYYY'+'-'+'MM'+'-'+'DD')+',') + dateRange
    currentDate = moment(currentDate).add(1, 'days').format('YYYY'+'-'+'MM'+'-'+'DD')
  }
  dateRange = dateRange.slice(0, -1)
  api.paramLookUp(eid, param, unix, dateRange)
    .then(paramLookUpResults)
    .fail(ui.oidLookUpFail)
}

const paramLookUpResults = (data) => {
  let looped = ''
  for (let i = 0; i < data.length; i++) {
    let formattedDate = moment(data[i]['Event Time']).format('MMMM Do YYYY')
    looped += `<tr><td>${data[i]['OID']}</td><td>${formattedDate}</td><td>${data[i]['Action ID']}</td><td>${data[i]['Query']}</td></tr>`
  }
  const tableHtml = `<table class="table"><thead><tr><th scope='col'>OID</th><th scope='col'>Event Time (UTC)</th><th scope='col'>Action ID</th><th scope='col'>Query String</th></tr></thead><tbody>${looped}</tbody></table>`
  document.getElementById('paramLookUpResult').innerHTML = tableHtml
  $('#paramLookUpResult').removeClass('hide')
  $('#paramLookUpResult').addClass('paramLookUpResult')
  $('#transactionTable').addClass('hide')
  $('#intranet').addClass('hide')
}

export { onParamLookUp }
