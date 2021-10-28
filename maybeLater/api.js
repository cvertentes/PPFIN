'use strict'

const companyListApi = () => {
  return $.ajax({
    url: '/api/v1/pixel-parser/company-list',
    method: 'GET'
  })
}

const createComment = (username, password, issueInput) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/issue-comment',
    method: 'POST',
    xhrFields: {
      withCredentials: true
    },
    data: {
      username: username,
      password: password,
      issueInput: issueInput,
      ticket: 915483
    },
    success: function(data) {
      $("#jiraTicketDiv").addClass('hide')
    }
  })
}

const oidLookUp = (eid, oid, unix, dateRange) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/oid-lookUp',
    method: 'POST',
    xhrFields: {
      withCredentials: true
    },
    data: {
      eid: eid,
      oid: oid,
      unix: unix,
      dateRange: dateRange
    },
    success: function(data) {
      $("#oidLoaderDiv").addClass('hide')
    }
  })
}

const getJiraTicketTests = (cid) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/jira-ticket',
    method: 'POST',
    xhrFields: {
      withCredentials: true
    },
    data: {
      cid: cid
    },
    success: function(data) {
      $("#jiraDiv").addClass('hide')
    }
  })
}

const jiraTestSubmit = (username, password, ticket, testText) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/jira-ticket-update',
    method: 'POST',
    xhrFields: {
      withCredentials: true
    },
    data: {
      username: username,
      password: password,
      ticket: ticket,
      testText: testText
    },
    success: function(data) {
      $("#jiraTestDiv").addClass('hide')
    }
  })
}

const paramLookUp = (eid, param, unix, dateRange) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/param-lookUp',
    method: 'POST',
    data: {
      eid: eid,
      param: param,
      unix: unix,
      dateRange: dateRange
    },
    success: function(data) {
      $("#oidLoaderDiv").addClass('hide')
    }
  })
}

const proxyInspector = (proxyRoot) => {
  return $.ajax({
    url: '/api/v1/pixel-parser/proxy-inspector',
    method: 'GET',
    data: {
      proxyRoot: proxyRoot
    },
    success: function(data) {
      $("#proxyHeaderDiv").addClass('hide')
    }
  })
}

export {
  companyListApi,
  createComment,
  oidLookUp,
  getJiraTicketTests,
  jiraTestSubmit,
  paramLookUp,
  proxyInspector
}
