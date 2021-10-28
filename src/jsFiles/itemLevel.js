let qsInput = ""
export function itemLevelParse() {
  let querystring = qsInput.value.replace(/&amp/gi, '&')
  let pixelArray = querystring.split("&")
  let pixelDict = {}
  let itemList = ""
  let jiraTestObj = {}

  for (let i = 0; i < pixelArray.length; i++) {
    let t = pixelArray[i].split("=")
    pixelDict[t[0].toUpperCase()] = t[1]
  }

  for (let prop in pixelDict) {
    if (!prop.includes('CID') &&
      !prop.includes('TYPE') &&
      !prop.includes('OID') &&
      !prop.includes('ITEM') &&
      !prop.includes('AMT') &&
      !prop.includes('QTY') &&
      !prop.includes('DCNT')) {
      itemList = itemList + `<span class="params" id="${prop.toLowerCase()}Li">${prop}</span>: <span id="${prop.toLowerCase()}LiValue">${pixelDict[prop]}</span><br/>`
      jiraTestObj[prop] = pixelDict[prop]
    }
  }

  for (let n = 1; n < 100; n++) {
    let skuGroupCreated = false

    if (pixelDict["ITEM" + n]) {
      if (!skuGroupCreated) {
        itemList = itemList + '<br/>' +
          '<span class="params_head">PRODUCT ' + n + ' INFORMATION:' + '</span><br/>'
        skuGroupCreated = true
      }
      itemList = itemList + '<span class="params">ITEM' + '</span>: ' + pixelDict["ITEM" + n] + '<br/>'
      jiraTestObj["ITEM" + n] = pixelDict["ITEM" + n]
    }

    if (pixelDict["AMT" + n]) {
      if (!skuGroupCreated) {
        itemList = itemList + '<br/>' +
          '<span class="params_head">PRODUCT ' + n + ' INFORMATION:' + '</span><br/>'
        skuGroupCreated = true
      }
      itemList = itemList + '<span class="params">AMT' + '</span>: ' + pixelDict["AMT" + n] + '<br/>'
      jiraTestObj["AMT" + n] = pixelDict["AMT" + n]
    }

    if (pixelDict["QTY" + n]) {
      if (!skuGroupCreated) {
        itemList = itemList + '<br/>' + '<span class="params_head">PRODUCT ' + n + ' INFORMATION:' + '</span><br/>'
        skuGroupCreated = true
      }
      itemList = itemList + '<span class="params">QTY' + '</span>: ' + pixelDict["QTY" + n] + '<br/>'
      jiraTestObj["QTY" + n] = pixelDict["QTY" + n]
    }

    if (pixelDict["DCNT" + n]) {
      if (!skuGroupCreated) {
        itemList = itemList + '<br/>' + '<span class="params_head">PRODUCT ' + n + ' INFORMATION:' + '</span><br/>'
        skuGroupCreated = true
      }
      itemList = itemList + '<span class="params">DCNT</span>: ' + pixelDict["DCNT" + n] + '<br/>'
      jiraTestObj["DCNT" + n] = pixelDict["DCNT" + n]
    }
  }
  let itemListJira = `|EVENT TIME|${document.getElementById('eventTimeJira').innerHTML}|\n|CID|${pixelDict["CID"]}|\n|TYPE|${pixelDict["TYPE"]}|\n|OID|${pixelDict["OID"]}|\n|SUBTOTAL|${document.getElementById('subtotalStore').innerHTML}|\n`
  for (let prop in jiraTestObj) {
    itemListJira = itemListJira + `|${prop}|${jiraTestObj[prop]}|\n`
  }
  document.getElementById('testDetails').value = itemListJira
  document.getElementById('itemListDiv').innerHTML =
    `<span class="params" id="cidLi">CID</span>: <span id="cidLiValue">${pixelDict["CID"]}</span><br/>
    <span class="params" id="typeLi">TYPE</span>: <span id="typeLiValue">${pixelDict["TYPE"]}</span><br/>
    <span class="params" id="oidLi">OID</span>: <span id="oidLiValue">${pixelDict["OID"]}</span><br/>
    ${itemList}`
}
