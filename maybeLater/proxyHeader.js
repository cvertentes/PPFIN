'use strict'

const ui = require('./ui.js')
const api = require('./api.js')

const onProxyHeader = (event) => {
  event.preventDefault()
  const proxyRoot = $('#proxyRoot').val()
  api.proxyInspector(proxyRoot)
    .then(headerResponse)
    .fail(ui.proxyInspectorFail)
}

const headerResponse = (data) => {
  if (!data) {
    ui.noProxyRoot()
  } else {
    let table = ''
    let errorTable = ''
    let looped = ''
    let looped2 = ''
    let headerObj = {}

    for (let prop in data) {
      headerObj['Integration Type'] = data.integrationType
      headerObj['X-Forwarded-For'] = data.headers['X-Forwarded-For']  == undefined ? '' : data.headers['X-Forwarded-For']
      headerObj['X-Forwarded-Host'] = data.headers['X-Forwarded-Host']  == undefined ? '' : data.headers['X-Forwarded-Host']
      headerObj['X-Forwarded-Request-Host'] = data.headers['X-Forwarded-Request-Host']  == undefined ? '' : data.headers['X-Forwarded-Request-Path']
      headerObj['X-Forwarded-Request-Path'] = data.headers['X-Forwarded-Request-Path']  == undefined ? '' : data.headers['X-Forwarded-Request-Path']
      headerObj['X-Forwarded-Server'] = data.headers['X-Forwarded-Server']  == undefined ? '' : data.headers['X-Forwarded-Server']
    }
    for (let prop in headerObj) {
      looped += `<tr><td>${prop}</td><td>${headerObj[prop]}</td></tr>`
    }
    table += `<table class="table"><thead><tr><th scope='col'>Key</th><th scope='col'>Value</th></tr></thead><tbody>${looped}</tbody></table>`

    if (data.errors.length) {
      data.errors.forEach(e => looped2 += `<tr><td>${e}</td></tr>`)
      errorTable += `<table class="table"><thead><tr><th scope='col'>Header Errors</th></tr></thead><tbody>${looped2}</tbody></table>`
      document.getElementById('proxyHeaders').innerHTML = table + errorTable
    } else {
      document.getElementById('proxyHeaders').innerHTML = table
    }

    $('#proxyHeaders').removeClass('hide')
  }
}

export {
  onProxyHeader
}
