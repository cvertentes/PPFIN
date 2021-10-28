import { json2table } from './formAction.js'
import { exportTableToExcel } from './excelAction.js'
export const onExcelFile = () => {
  exportTableToExcel('tableExcel', document.getElementById('companyGoesHere').innerHTML)
}

export class ParseParams {
  // Add global variables you need here
  constructor(paramsInput, customSort) {
    // super('displayParams', 'table_parse', 'parse');
    this.paramsInput = paramsInput;
    this.customSort = customSort;
    this.paramsOutputArray = [
      ['Key', 'Value', 'Validation']
    ];
    this.paramsOutputJson = [];
    this.requiredParams = {
      'CID': false,
      'TYPE': false,
      'CURRENCY': false,
      'CJEVENT': false,
      'OID': false,
      'SIMPLE': false,
      'ADVANCED': false
    }
    this.generalTravelParams = {
      'DURATION': false,
      'BOOKING_DATE': false,
      'TRAVEL_DESTINATION': false
    }
    this.paramsThatCanBeNull = {
      'COUPON': false,
      'DISCOUNT': false
    }

    //MAKE A PARAM OBJECT OF PARAMS THAT CAN NEVER BE NULL -- ADD ON TO REQUIREDPARAMS
    // Below will be constructor for easy to validate travel params that we can group together

    //this.easyValidateTravelParams = {
    //Room Type/Payment/Coupons/ ETC.
    //}

    this.subtotal = 0
    this.amount = 0
    this.discount = 0
    this.amtsArray = []
    this.qtysArray = []
    this.dcntsArray = []
    this.errorObj = {}
    this.warningObj = {}
    this.requiredParamFeedback = {}
    this.paramKeys = []
  }
  /*
   * All methods for validation should be below this line
   * Try to keep syntax/naming convention consistent and return true for errors
   * Validate alphanumeric string such as 591784646e-8a11e88391_00dd0a1c0e0f
   * Returns true if error
   */
  checkAlphaNumericString(alphastring) {
    if (/[^a-zA-Z0-9-_]+/gi.test(alphastring)) {
      return true;
    } else {
      return false;
    }
  }
  // Validate integer/float value inlcuding 1, 2, 2.5, 3.5, etc.
  // Returns true if error
  //Need to fix if multiple decimals ex:(109..00) -- FIXED
  checkNumericValue(number) {
    if (/[^0-9.]+/g.test(number) || number.indexOf('..') !== -1) {
      return true;
    } else {
      return false;
    }
  }
  //Same check as checkNumericValue but allows negatives
  checkDiscountNumericValue(number) {
    if (isNaN(number) || number.indexOf('..') !== -1) {
      return true;
    } else {
      return false;
    }
  }

  // Validate integer value, e.g. whole number like 1, 2, 3, etc.
  // Returns true if error
  checkIntegerValue(integer) {
    if (/^-?[0-9]+$/g.test(integer)) {
      return false;
    } else {
      return true;
    }
  }

  // Validate alpha string (letters only), such as 'String'
  // Returns true if error
  checkAlphaString(string) {
    if (/[^a-zA-Z-_]+/gi.test(string)) {
      return true;
    } else {
      return false;
    }
  }

  // Check if input is empty, undefined, or null
  // Returns true if error
  checkIfInputEmpty(string) {
    if (typeof string !== 'undefined' && string !== null) {
      if (string.lengh === 0 || !string || /^\s*$/.test(string) || string.toUpperCase() === 'UNDEFINED' || string.toUpperCase() === 'NULL') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  // Validate string (YES or NO only)
  // Returns true if error
  checkYesOrNo(string) {
    var list = ['YES', 'NO']
    if (string === undefined) {
      return true;
    } else if (!list.includes(string.toUpperCase())) {
      return true;
    } else {
      return false;
    }
  }

  //Validate URL encoded ISO 8601 date and time string, e.g. "eventTime=2018-09-15T05%3A53%3A00%2B07%3A00%"
  //Returns true if error
  checkEventTimeString(EVENTTIME) {
    if (/^((\d{4})-(\d{2})-(\d{2})[T](\d{2})(%3A)(\d{2})(%3A)(\d{2})(%2B|-)(\d{2})(%3A)(\d{2}))$/g.test(EVENTTIME)) {
      return false;
    } else {
      return true;
    }
  }

  //Validate URL encoded Channel_TS string, e.g. "channel_ts=2017-02-14T22%3A16%3A46.623Z"
  //Returns true if error
  checkChannel_TS_String(CHANNEL_TS) {
    if (/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9])(%3A)([0-5][0-9])(%3A)([0-5][0-9])(.[0-9]+)?(Z)?$/g.test(CHANNEL_TS)) {
      return false;
    } else {
      return true;
    }
  }

  // Validate country code
  // Returns true if error
  checkCountryCode(code) {
    var countryCodeArray = ['AFG', 'EUR', 'ALA', 'ALB', 'DZA', 'ASM', 'AND', 'AGO', 'AIA', 'ATA', 'ATG', 'ARG', 'ARM', 'ABW', 'AUS', 'AUT', 'AZE', 'BHS', 'BHR', 'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'GBP', 'BEN', 'BMU', 'BTN', 'BOL', 'BIH', 'BWA', 'BVT', 'BRA', 'VGB', 'IOT', 'BRN', 'BGR', 'BFA', 'BDI', 'KHM', 'CMR', 'CAN', 'CPV', 'CYM', 'CAF', 'TCD', 'CHL', 'CHN', 'HKG', 'MAC', 'CXR', 'CCK', 'COL', 'COM', 'COG', 'COD', 'COK', 'CRI', 'CIV', 'HRV', 'CUB', 'CYP', 'CZE', 'DNK', 'DJI', 'DMA', 'DOM', 'ECU', 'EGY', 'SLV', 'GNQ', 'ERI', 'EST', 'ETH', 'FLK', 'FRO', 'FJI', 'FIN', 'FRA', 'GUF', 'PYF', 'ATF', 'GAB', 'GMB', 'GEO', 'DEU', 'GHA', 'GIB', 'GRC', 'GRL', 'GRD', 'GLP', 'GUM', 'GTM', 'GGY', 'GIN', 'GNB', 'GUY', 'HTI', 'HMD', 'VAT', 'HND', 'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'IRL', 'IMN', 'ISR', 'ITA', 'JAM', 'JPN', 'JEY', 'JOR', 'KAZ', 'KEN', 'KIR', 'PRK', 'KOR', 'KWT', 'KGZ', 'LAO', 'LVA', 'LBN', 'LSO', 'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MKD', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'MLT', 'MHL', 'MTQ', 'MRT', 'MUS', 'MYT', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MSR', 'MAR', 'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'NLD', 'ANT', 'NCL', 'NZL', 'NIC', 'NER', 'NGA', 'NIU', 'NFK', 'MNP', 'NOR', 'OMN', 'PAK', 'PLW', 'PSE', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'PCN', 'POL', 'PRT', 'PRI', 'QAT', 'REU', 'ROU', 'RUS', 'RWA', 'BLM', 'SHN', 'KNA', 'LCA', 'MAF', 'SPM', 'VCT', 'WSM', 'SMR', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SVK', 'SVN', 'SLB', 'SOM', 'ZAF', 'SGS', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SJM', 'SWZ', 'SWE', 'CHE', 'SYR', 'TWN', 'TJK', 'TZA', 'THA', 'TLS', 'TGO', 'TKL', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TCA', 'TUV', 'UGA', 'UKR', 'ARE', 'GBR', 'USA', 'UMI', 'URY', 'UZB', 'VUT', 'VEN', 'VNM', 'VIR', 'WLF', 'ESH', 'YEM', 'ZMB', 'ZWE'];
    if (code === undefined) {
      return true;
    } else if (!countryCodeArray.includes(code.toUpperCase())) {
      return true;
    } else {
      return false;
    }
  }

  // Validate currency code
  // Returns true if error
  checkCurrencyCode(code) {
    var currencyCodeArray = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'XSU', 'XUA', 'YER', 'ZAR', 'ZMW', 'ZWL'];
    if (code === undefined) {
      return true;
    } else if (!currencyCodeArray.includes(code.toUpperCase())) {
      return true;
    } else {
      return false;
    }
  }

  //ENTER CHECK STATE CODE BELOW FOR TRAVEL_DESTINATION PARAM (TRAVEL-PARAMS-TEAM)!!!
  // Validate YYYY-MM-DD date string
  // Returns true if error
  checkSimpleDateString(simpleDate) {
    if (/^\d{4}\-\d{2}\-\d{2}$/g.test(simpleDate)) {
      return false;
    } else {
      return true;
    }
  }

  checkRequiredParams() {
    if (this.requiredParams['SIMPLE'] === true && this.requiredParams['ADVANCED'] === false) {
      this.requiredParamFeedback['tag-type-correct'] = 'Tag Type: Simple'
    }

    if (this.requiredParams['SIMPLE'] === false && this.requiredParams['ADVANCED'] === true) {
      let itemRegex = /ITEM\d/gi
      let amtRegex = /AMT\d/gi
      let qtyRegex = /QTY\d/gi
      let item = false
      let amt = false
      let qty = false

      for (let i = 0; i < this.paramKeys.length; i++) {
        if (itemRegex.test(this.paramKeys[i])) {
          item = true
        }

        if (amtRegex.test(this.paramKeys[i])) {
          amt = true
        }

        if (qtyRegex.test(this.paramKeys[i])) {
          qty = true
        }
      }

      if (item == false) {
        this.requiredParamFeedback['format-invalid-error'] = 'ERROR: Required parameter ITEM is missing or invalid.'
      } else if (amt == false) {
        this.requiredParamFeedback['format-invalid-error'] = 'ERROR: Required parameter AMT is missing or invalid.'
      } else if (qty == false) {
        this.requiredParamFeedback['format-invalid-error'] = 'ERROR: Required parameter QTY is missing or invalid.'
      } else {
        this.requiredParamFeedback['tag-type-correct'] = 'Tag Type: Advanced'
      }
    }

    if (this.requiredParams['SIMPLE'] === true && this.requiredParams['ADVANCED'] === true) {
      this.requiredParamFeedback['format-invalid-error'] = 'ERROR: Detected both simple and advanced parameters!'
    }

    if (this.requiredParams['SIMPLE'] === false && this.requiredParams['ADVANCED'] === false) {
      this.requiredParamFeedback['format-missing-error'] = 'ERROR: Neither simple nor advanced parameters exist.'
    }

    for (var property in this.requiredParams) {
      if (property !== 'SIMPLE' && property !== 'ADVANCED' && this.requiredParams[property] === false) {
        this.requiredParamFeedback['requirement-error-' + property] = 'ERROR: Required parameter ' + property + ' is missing or invalid.'
      }
    }
  }

  // Calculate subtotal
  calculateSubTotal() {
    if (this.amtsArray.length === 0 && this.qtysArray.length === 0) {
      this.subtotal = Number(this.amount);
    } else {
      for (var i = 0; i < this.amtsArray.length; i++) {
        this.subtotal += Number(this.amtsArray[i]) * Number(this.qtysArray[i]);
        if (this.dcntsArray[i]) {
          this.subtotal -= Number(this.dcntsArray[i]);
        }
      }
    }
    if (this.discount !== 0) {
      this.subtotal = this.subtotal - Number(Math.abs(this.discount));
    }
    this.subtotal = this.subtotal.toFixed(2);
    document.getElementById('subtotalGoesHere').innerHTML = "Subtotal: " + this.subtotal;
    document.getElementById('subtotalStore').innerHTML = this.subtotal;
  }
  // Downlaod all rows including key, value, and validation into CSV file
  downloadCsvFile() {
    var csvContent = 'data:text/csv;charset=utf-8,';
    this.paramsOutputArray.forEach(function(rowArray) {
      var row = rowArray.join(',');
      csvContent += row + '\r\n';
    });
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }
  /*
   * Detect the key you want to validate here
   * Make sure it is within the same validation tree
   * Also make sure you return the string for the
   * valueValidationPatterns method to look for
   *
   * REQUIRING PARAMETERS:
   * if you want to require a parameter, do the following:
   * - add 'PARAMETER' : false to the global requiredParams object
   * - update the value to true when detected as a key
   */
  keyValidationPatterns(inputKey) {
    if (/ITEM\d/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'ITEM';
    } else if (/AMT\d/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'AMT';
    } else if (/QTY\d/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'QTY';
    } else if (/DCNT\d/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'DCNT';
    } else if (/(ITEM|AMT|QTY|DCNT)[^\d]/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'INVALID-ITEM-INDEX';
    } else if (/^(ITEM|AMT|QTY|DCNT)$/i.test(inputKey)) {
      this.requiredParams['ADVANCED'] = true;
      return 'INVALID-ITEM-MISSING';
    } else if (inputKey.toUpperCase() === 'OID') {
      this.requiredParams['OID'] = true;
      return 'OID';
    } else if (inputKey.toUpperCase() === 'CONTAINERTAGID') {
      // this.requiredParams['CONTAINERTAGID'] = true;
      return 'CONTAINERTAGID';
    } else if (inputKey.toUpperCase() === 'CURRENCY') {
      this.requiredParams['CURRENCY'] = true;
      return 'CURRENCY';
    } else if (inputKey.toUpperCase() === 'TYPE') {
      this.requiredParams['TYPE'] = true;
      return 'TYPE';
    } else if (inputKey.toUpperCase() === 'CID') {
      this.requiredParams['CID'] = true;
      return 'CID';
    } else if (inputKey.toUpperCase() === 'METHOD') {
      // this.requiredParams['METHOD'] = true;
      return 'METHOD';
    } else if (inputKey.toUpperCase() === 'AMOUNT') {
      this.requiredParams['SIMPLE'] = true;
      return 'AMOUNT';
    } else if (inputKey.toUpperCase() === 'CJEVENT') {
      this.requiredParams['CJEVENT'] = true;
      return 'CJEVENT';
    } else if (inputKey.toUpperCase() === 'SIGNATURE') {
      return 'SIGNATURE';
    } else if (inputKey.toUpperCase() === 'COUPON') {
      return 'COUPON';
    } else if (inputKey.toUpperCase() === 'DISCOUNT') {
      return 'DISCOUNT';
    } else if (inputKey.toUpperCase() === 'BOOKING_DATE' || inputKey === 'bookingDate') {
      return 'BOOKING_DATE';
    } else if (inputKey.toUpperCase() === 'CUST_STATUS' || inputKey === 'custStatus') {
      return 'CUST_STATUS';
    } else if (inputKey.toUpperCase() === 'DURATION') {
      return 'DURATION';
    } else if (inputKey.toUpperCase() === 'END_DATE_TIME' || inputKey === 'endDateTime') {
      return 'END_DATE_TIME';
    } else if (inputKey.toUpperCase() === 'TRAVEL_DESTINATION' || inputKey === 'travelDestination') {
      return 'TRAVEL_DESTINATION';
    } else if (inputKey.toUpperCase() === 'DOMESTIC') {
      return 'DOMESTIC';
    } else if (inputKey.toUpperCase() === 'LOYALTY.FIRSTTIMESIGNUP') {
      return 'LOYALTY.FIRSTTIMESIGNUP';
    } else if (inputKey.toUpperCase() === 'LOYALTY_FIRST_TIME_SIGNUP' || inputKey === 'loyaltyFirstTimeSignup') {
      return 'LOYALTY_FIRST_TIME_SIGNUP';
    } else if (inputKey.toUpperCase() === 'LOYALTY_STATUS' || inputKey === 'loyaltyStatus') {
      return 'LOYALTY_STATUS';
    } else if (inputKey.toUpperCase() === 'NO_CANCELLATION' || inputKey === 'noCancellation') {
      return 'NO_CANCELLATION';
    } else if (inputKey.toUpperCase() === 'PRE_QUAL' || inputKey === 'preQual') {
      return 'PRE_QUAL';
    } else if (inputKey.toUpperCase() === 'PREORDER') {
      return 'PREORDER';
    } else if (inputKey.toUpperCase() === 'PREPAID') {
      return 'PREPAID';
    } else if (inputKey.toUpperCase() === 'UPSELL') {
      return 'UPSELL';
    } else if (inputKey.toUpperCase() === 'PAYMENT_METHOD' || inputKey === 'paymentMethod') {
      return 'PAYMENT_METHOD'
    } else if (inputKey.toUpperCase() === 'TRANSFER_FEE' || inputKey === 'transferFee') {
      return 'TRANSFER_FEE';
    } else if (inputKey.toUpperCase() === 'PROMOTION_AMT' || inputKey === 'promotionAmt') {
      return 'PROMOTION_AMT';
    } else if (inputKey.toUpperCase() === 'CREDIT_LINE' || inputKey === 'creditLine') {
      return 'CREDIT_LINE';
    } else if (inputKey.toUpperCase() === 'APR') {
      return 'APR';
    } else if (inputKey.toUpperCase() === 'INTRO_APR' || inputKey === 'introApr') {
      return 'INTRO_APR';
    } else if (inputKey.toUpperCase() === 'INTRO_APR_TIME' || inputKey === 'introAprTime') {
      return 'INTRO_APR_TIME';
    } else if (inputKey.toUpperCase() === 'APR_TRANSFER' || inputKey === 'aprTransfer') {
      return 'APR_TRANSFER';
    } else if (inputKey.toUpperCase() === 'APR_TRANSFER_TIME' || inputKey === 'aprTransferTime') {
      return 'APR_TRANSFER_TIME';
    } else if (inputKey.toUpperCase() === 'MIN_DEPOSIT' || inputKey === 'minDeposit') {
      return 'MIN_DEPOSIT';
    } else if (inputKey.toUpperCase() === 'SUB_FEE' || inputKey === 'subFee') {
      return 'SUB_FEE';
    } else if (inputKey.toUpperCase() === 'FUNDED_AMOUNT' || inputKey === 'fundedAmount') {
      return 'FUNDED_AMOUNT';
    } else if (inputKey.toUpperCase() === 'MIN_BAL' || inputKey === 'minBal') {
      return 'MIN_BAL';
    } else if (inputKey.toUpperCase() === 'CUST_COUNTRY' || inputKey === 'custCountry') {
      return 'CUST_COUNTRY';
    } else if (inputKey.toUpperCase() === 'DEST_COUNTRY' || inputKey === 'destCountry') {
      return 'DEST_COUNTRY';
    } else if (inputKey.toUpperCase() === 'OR_COUNTRY' || inputKey === 'orCountry') {
      return 'OR_COUNTRY';
    } else if (inputKey.toUpperCase() === 'APP_STATUS' || inputKey === 'appStatus') {
      return 'APP_STATUS';
    } else if (inputKey.toUpperCase() === 'BOOKING_STATUS' || inputKey === 'bookingStatus') {
      return 'BOOKING_STATUS';
    } else if (inputKey.toUpperCase() === 'BRAND') {
      return 'BRAND';
    } else if (inputKey.toUpperCase() === 'BRAND_ID' || inputKey === 'brandId') {
      return 'BRAND_ID';
    } else if (inputKey.toUpperCase() === 'BUS_UNIT' || inputKey === 'busUnit') {
      return 'BUS_UNIT';
    } else if (inputKey.toUpperCase() === 'CAMP_ID' || inputKey === 'campId') {
      return 'CAMP_ID';
    } else if (inputKey.toUpperCase() === 'CAMP_NAME' || inputKey === 'campName') {
      return 'CAMP_NAME';
    } else if (inputKey.toUpperCase() === 'CAR_OPTIONS' || inputKey === 'carOptions') {
      return 'CAR_OPTIONS';
    } else if (inputKey.toUpperCase() === 'CARD_CATEGORY' || inputKey === 'cardCategory') {
      return 'CARD_CATEGORY';
    } else if (inputKey.toUpperCase() === 'CHANNEL') {
      return 'CHANNEL';
    } else if (inputKey.toUpperCase() === 'CLASS') {
      return 'CLASS';
    } else if (inputKey.toUpperCase() === 'CONFIRMATION_NUMBER' || inputKey === 'confirmationNumber') {
      return 'CONFIRMATION_NUMBER';
    } else if (inputKey.toUpperCase() === 'CONTRACT_TYPE' || inputKey === 'contractType') {
      return 'CONTRACT_TYPE';
    } else if (inputKey.toUpperCase() === 'COUPON_DISCOUNT' || inputKey === 'couponDiscount') {
      return 'COUPON_DISCOUNT';
    } else if (inputKey.toUpperCase() === 'COUPON_TYPE' || inputKey === 'couponType') {
      return 'COUPON_TYPE';
    } else if (inputKey.toUpperCase() === 'CR_REPORT' || inputKey === 'crReport') {
      return 'CR_REPORT';
    } else if (inputKey.toUpperCase() === 'CREDIT_QUALITY' || inputKey === 'creditQuality') {
      return 'CREDIT_QUALITY';
    } else if (inputKey.toUpperCase() === 'CRUISE_TYPE' || inputKey === 'cruiseType') {
      return 'CRUISE_TYPE';
    } else if (inputKey.toUpperCase() === 'CUST_POSTCODE' || inputKey === 'custStatus') {
      return 'CUST_POSTCODE';
    } else if (inputKey.toUpperCase() === 'CUST_SEGMENT' || inputKey === 'custSegment') {
      return 'CUST_SEGMENT';
    } else if (inputKey.toUpperCase() === 'CUST_TYPE' || inputKey === 'custType') {
      return 'CUST_TYPE';
    } else if (inputKey.toUpperCase() === 'CUSTOMER.LOCATION') {
      return 'CUSTOMER.LOCATION';
    } else if (inputKey.toUpperCase() === 'DELIVERY') {
      return 'DELIVERY';
    } else if (inputKey.toUpperCase() === 'DESCRIPTION') {
      return 'DESCRIPTION';
    } else if (inputKey.toUpperCase() === 'DEST_CITY' || inputKey === 'destCity') {
      return 'DEST_CITY';
    } else if (inputKey.toUpperCase() === 'DROPOFF_ID' || inputKey === 'dropoffId') {
      return 'DROPOFF_ID';
    } else if (inputKey.toUpperCase() === 'DROPOFF_IATA' || inputKey === 'dropoffIata') {
      return 'DROPOFF_IATA';
    } else if (inputKey.toUpperCase() === 'FLIGHT_FARE_TYPE' || inputKey === 'flightFareType') {
      return 'FLIGHT_FARE_TYPE';
    } else if (inputKey.toUpperCase() === 'FLIGHT_OPTIONS' || inputKey === 'flightOptions') {
      return 'FLIGHT_OPTIONS';
    } else if (inputKey.toUpperCase() === 'FLIGHT_TYPE' || inputKey === 'flightType') {
      return 'FLIGHT_TYPE';
    } else if (inputKey.toUpperCase() === 'GENRE') {
      return 'GENRE';
    } else if (inputKey.toUpperCase() === 'IATA') {
      return 'IATA';
    } else if (inputKey.toUpperCase() === 'ITEM_ID' || inputKey === 'itemId') {
      return 'ITEM_ID';
    } else if (inputKey.toUpperCase() === 'ITEM_NAME' || inputKey === 'itemName') {
      return 'ITEM_NAME';
    } else if (inputKey.toUpperCase() === 'ITEM_TYPE' || inputKey === 'itemType') {
      return 'ITEM_TYPE';
    } else if (inputKey.toUpperCase() === 'ITINERARY_ID' || inputKey === 'itineraryId') {
      return 'ITINERARY_ID';
    } else if (inputKey.toUpperCase() === 'LIFESTAGE') {
      return 'LIFESTAGE';
    } else if (inputKey.toUpperCase() === 'LOCATION') {
      return 'LOCATION';
    } else if (inputKey.toUpperCase() === 'LOYALTY.FIRSTTIMESIGNUP') {
      return 'LOYALTY.FIRSTTIMESIGNUP';
    } else if (inputKey.toUpperCase() === 'LOYALTY_FIRST_TIME_SIGNUP' || inputKey === 'loyaltyFirstTimeSignup') {
      return 'LOYALTY_FIRST_TIME_SIGNUP';
    } else if (inputKey.toUpperCase() === 'LOYALTY_LEVEL' || inputKey === 'loyaltyLevel') {
      return 'LOYALTY_LEVEL';
    } else if (inputKey.toUpperCase() === 'LOYALTY_STATUS' || inputKey === 'loyaltyStatus') {
      return 'LOYALTY_STATUS';
    } else if (inputKey.toUpperCase() === 'MARGIN') {
      return 'MARGIN';
    } else if (inputKey.toUpperCase() === 'MARKETING_CHANNEL' || inputKey === 'marketingChannel') {
      return 'MARKETING_CHANNEL';
    } else if (inputKey.toUpperCase() === 'NO_CANCELLATION' || inputKey === 'noCancellation') {
      return 'NO_CANCELLATION';
    } else if (inputKey.toUpperCase() === 'OR_CITY' || inputKey === 'orCity') {
      return 'OR_CITY';
    } else if (inputKey.toUpperCase() === 'PAYMENT_MODEL' || inputKey === 'paymentModel') {
      return 'PAYMENT_MODEL';
    } else if (inputKey.toUpperCase() === 'PICKUP_ID' || inputKey === 'pickupId') {
      return 'PICKUP_ID';
    } else if (inputKey.toUpperCase() === 'PICKUP_IATA' || inputKey === 'pickupIata') {
      return 'PICKUP_IATA';
    } else if (inputKey.toUpperCase() === 'PLATFORM_ID' || inputKey === 'platformId') {
      return 'PLATFORM_ID';
    } else if (inputKey.toUpperCase() === 'POINT_OF_SALE' || inputKey === 'pointOfSale') {
      return 'POINT_OF_SALE';
    } else if (inputKey.toUpperCase() === 'PORT') {
      return 'PORT';
    } else if (inputKey.toUpperCase() === 'PRE_QUAL' || inputKey === 'preQual') {
      return 'PRE_QUAL';
    } else if (inputKey.toUpperCase() === 'PREORDER') {
      return 'PREORDER';
    } else if (inputKey.toUpperCase() === 'PREPAID') {
      return 'PREPAID';
    } else if (inputKey.toUpperCase() === 'PROMOTION') {
      return 'PROMOTION';
    } else if (inputKey.toUpperCase() === 'PROMOTION_CONDITIONTYPE' || inputKey === 'promotionConditiontype') {
      return 'PROMOTION_CONDITIONTYPE';
    } else if (inputKey.toUpperCase() === 'PROMOTION_TYPE' || inputKey === 'promotionType') {
      return 'PROMOTION_TYPE';
    } else if (inputKey.toUpperCase() === 'ROOM_TYPE' || inputKey === 'roomType') {
      return 'ROOM_TYPE';
    } else if (inputKey.toUpperCase() === 'SERVICE_TYPE' || inputKey === 'serviceType') {
      return 'SERVICE_TYPE';
    } else if (inputKey.toUpperCase() === 'SHIP_NAME' || inputKey === 'shipName') {
      return 'SHIP_NAME';
    } else if (inputKey.toUpperCase() === 'TAX_TYPE' || inputKey === 'taxType') {
      return 'TAX_TYPE';
    } else if (inputKey.toUpperCase() === 'TRAVEL_TYPE' || inputKey === 'travelType') {
      return 'TRAVEL_TYPE';
    } else if (inputKey.toUpperCase() === 'UPSELL') {
      return 'UPSELL';
    } else if (inputKey.toUpperCase() === 'DEST_STATE' || inputKey === 'destState') {
      return 'DEST_STATE';
    } else if (inputKey.toUpperCase() === 'OR_STATE' || inputKey === 'orState') {
      return 'OR_STATE';
    } else if (inputKey.toUpperCase() === 'EVENTTIME') {
      return 'EVENTTIME';
    } else if (inputKey.toUpperCase() === 'CHANNEL_TS' || inputKey === 'channelTs') {
      return 'CHANNEL_TS';
    } else if (inputKey.toUpperCase() === 'END_DATE_TIME' || inputKey === 'endDateTime') {
      return 'END_DATE_TIME';
    } else if (inputKey.toUpperCase() === 'PROMOTION_ENDS' || inputKey === 'promotionEnds') {
      return 'PROMOTION_ENDS';
    } else if (inputKey.toUpperCase() === 'PROMOTION_STARTS' || inputKey === 'promotionStarts') {
      return 'PROMOTION_STARTS';
    } else if (inputKey.toUpperCase() === 'START_DATE_TIME' || inputKey === 'startDateTime') {
      return 'START_DATE_TIME';
    } else if (inputKey.toUpperCase() === 'GUESTS') {
      return 'GUESTS';
    } else if (inputKey.toUpperCase() === 'AGE') {
      return 'AGE';
    } else if (inputKey.toUpperCase() === 'ANCILLARY_SPEND' || inputKey === 'ancillarySpend') {
      return 'ANCILLARY_SPEND';
    } else if (inputKey.toUpperCase() === 'ANNUAL_FEE' || inputKey === 'annualFee') {
      return 'ANNUAL_FEE';
    } else if (inputKey.toUpperCase() === 'BOOKING_VALUE_POST_TAX' || inputKey === 'bookingValuePostTax') {
      return 'BOOKING_VALUE_POST_TAX';
    } else if (inputKey.toUpperCase() === 'BOOKING_VALUE_PRE_TAX' || inputKey === 'bookingValuePreTax') {
      return 'BOOKING_VALUE_PRE_TAX';
    } else if (inputKey.toUpperCase() === 'CASH_ADVANCE_FEE' || inputKey === 'cashAdvanceFee') {
      return 'CASH_ADVANCE_FEE';
    } else if (inputKey.toUpperCase() === 'CATEGORY') {
      return 'CATEGORY';
    } else if (inputKey.toUpperCase() === 'CONTRACT_LENGTH' || inputKey === 'contractLength') {
      return 'CONTRACT_LENGTH';
    } else if (inputKey.toUpperCase() === 'FLYER_MILES' || inputKey === 'flyerMiles') {
      return 'FLYER_MILES';
    } else if (inputKey.toUpperCase() === 'FUNDED_CURRENCY' || inputKey === 'fundedCurrency') {
      return 'FUNDED_CURRENCY';
    } else if (inputKey.toUpperCase() === 'LOYALTY_EARNED' || inputKey === 'loyaltyEarned') {
      return 'LOYALTY_EARNED';
    } else if (inputKey.toUpperCase() === 'LOYALTY_REDEEMED' || inputKey === 'loyaltyRedeemed') {
      return 'LOYALTY_REDEEMED';
    } else if (inputKey.toUpperCase() === 'MIN_STAY_DURATION' || inputKey === 'minStayDuration') {
      return 'MIN_STAY_DURATION';
    } else if (inputKey.toUpperCase() === 'ORDER_SUBTOTAL' || inputKey === 'orderSubtotal') {
      return 'ORDER_SUBTOTAL';
    } else if (inputKey.toUpperCase() === 'PAID_AT_BOOKING_POST_TAX' || inputKey === 'paidAtBookingPostTax') {
      return 'PAID_AT_BOOKING_POST_TAX';
    } else if (inputKey.toUpperCase() === 'PAID_AT_BOOKING_PRE_TAX' || inputKey === 'paidAtBookingPreTax') {
      return 'PAID_AT_BOOKING_PRE_TAX';
    } else if (inputKey.toUpperCase() === 'PROMOTION_CONDITIONTHRESHOLD' || inputKey === 'promotionConditionthreshold') {
      return 'PROMOTION_CONDITIONTHRESHOLD';
    } else if (inputKey.toUpperCase() === 'QUANTITY') {
      return 'QUANTITY';
    } else if (inputKey.toUpperCase() === 'RATING') {
      return 'RATING';
    } else if (inputKey.toUpperCase() === 'ROOMS') {
      return 'ROOMS';
    } else if (inputKey.toUpperCase() === 'SUB_LENGTH' || inputKey === 'subLength') {
      return 'SUB_LENGTH';
    } else if (inputKey.toUpperCase() === 'TAX_AMOUNT' || inputKey === 'taxAmount') {
      return 'TAX_AMOUNT';
      // Universal Tag
    } else if (inputKey.toUpperCase() === 'TAGUUID') {
      return 'TAGUUID';
    } else if (inputKey.toUpperCase() === 'CUSTOM.STATS') {
      return 'CUSTOM.STATS';
    } else {
      // this.notAlowed(inputKey)
      return inputKey
    }
  };
  /*
   * Validate the value of the detected keys by calliing validation methods
   * Return error string if validation method returns true
   * Use this.errorObj or this.warningObj to add style to results
   * Ensure the index is included in the errorObj/warningObj key
   * so the key is always unique, otherwise you may overwrite a key
   */
  valueValidationPatterns(inputVal, keyResults, validationCol, index) {
    if (keyResults === 'ITEM') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'ITEM contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'AMT') {
      this.amtsArray.push(Number(inputVal));
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'AMT not numeric or is undefined or null or AMT Param index is wrong';
      }
    } else if (keyResults === 'QTY') {
      this.qtysArray.push(Number(inputVal));
      if (this.checkIntegerValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true || this.checkNumericValue(inputVal)) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'QTY not numeric or is undefined or null';
      }
    } else if (keyResults === 'DISCOUNT') {
      this.discount = Number(inputVal);
      if (this.checkDiscountNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DISCOUNT not numeric';
      }
    } else if (keyResults === 'DCNT') {
      this.dcntsArray.push(Number(inputVal));
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DCNT not numeric or is negative';
      }
    } else if (keyResults === 'INVALID-ITEM-INDEX') {
      this.errorObj['error_' + index] = validationCol.id;
      return 'Item level parameter index invalid';

    } else if (keyResults === 'INVALID-ITEM-MISSING') {
      this.errorObj['error_' + index] = validationCol.id;
      return 'Item level parameter index is missing';

    } else if (keyResults === 'OID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'OID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CONTAINERTAGID') {
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'containerTagId not numeric or is undefined or null';
      }
    } else if (keyResults === 'EVENTTIME') {
      if (this.checkEventTimeString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'eventTime is malformed';
      }
    } else if (keyResults === 'CHANNEL_TS') {
      if (this.checkChannel_TS_String(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CHANNEL_TS is malformed';
      }
    } else if (keyResults === 'CONTAINERTAGID') {
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'containerTagId not numeric or is undefined or null';
      }
    } else if (keyResults === 'CURRENCY') {
      if (this.checkCurrencyCode(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CURRENCY invalid or is undefined or null';
      }
    } else if (keyResults === 'TYPE') {
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'TYPE not numeric or is undefined or null';
      }
    } else if (keyResults === 'CID') {
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CID not numeric or is undefined or null';
      }
    } else if (keyResults === 'METHOD') {
      if (inputVal.toUpperCase() !== 'IMG' && inputVal.toUpperCase() !== 'S2S') {
        this.errorObj['error_' + index] = validationCol.id;
        return 'METHOD invalid, must be IMG or S2S';
      }
    } else if (keyResults === 'AMOUNT') {
      this.amount = Number(inputVal);
      if (this.checkNumericValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'AMOUNT not numeric or is undefined or null';
      }
    } else if (keyResults === 'DISCOUNT') {
      this.discount = Number(inputVal);
      if (this.checkDiscountNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DISCOUNT not numeric';
      }
    } else if (keyResults === 'COUPON') {
      if (this.checkAlphaNumericString(inputVal) === true) {
        this.warningObj['error_' + index] = validationCol.id;
        return 'COUPON contains special characters';
      }
    } else if (keyResults === 'BOOKING_DATE') {
      if (this.checkSimpleDateString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Date format invalid, must be YYYY-MM-DD';
      }
    } else if (keyResults === 'END_DATE_TIME') {
      if (this.checkSimpleDateString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Date format invalid, must be YYYY-MM-DD';
      }
    } else if (keyResults === 'START_DATE_TIME') {
      if (this.checkSimpleDateString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Date format invalid, must be YYYY-MM-DD';
      }
    } else if (keyResults === 'PROMOTION_STARTS') {
      if (this.checkSimpleDateString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Date format invalid, must be YYYY-MM-DD';
      }
    } else if (keyResults === 'PROMOTION_ENDS') {
      if (this.checkSimpleDateString(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Date format invalid, must be YYYY-MM-DD';
      }
    } else if (keyResults === 'CJEVENT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CJEVENT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'SIGNATURE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'SIGNATURE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CUST_STATUS') {
      if (inputVal.toUpperCase() !== 'NEW' && inputVal.toUpperCase() !== 'RETURN' && inputVal.toUpperCase() !== 'LAPSED') {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Customer Status must be new, return, or lapsed';
      }
    } else if (keyResults === 'DURATION') {
      if (this.checkIntegerValue(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'Duration not an integer or is undefined or null';
      }
    } else if (keyResults === 'TRAVEL_DESTINATION') {
      if (this.checkAlphaString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true || this.checkCountryCode(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'Invalid travel destination input!';
      }

      //Yes or No Validation Patterns
    } else if (keyResults === 'DOMESTIC') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DOMESTIC must be YES or NO';
      }
    } else if (keyResults === 'LOYALTY.FIRSTTIMESIGNUP') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'LOYALTY.FIRSTTIMESIGNUP must be YES or NO';
      }
    } else if (keyResults === 'LOYALTY_FIRST_TIME_SIGNUP') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'LOYALTY_FIRST_TIME_SIGNUP must be YES or NO';
      }
    } else if (keyResults === 'LOYALTY_STATUS') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'LOYALTY_STATUS must be YES or NO';
      }
    } else if (keyResults === 'NO_CANCELLATION') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'NO_CANCELLATION must be YES or NO';
      }
    } else if (keyResults === 'PRE_QUAL') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'PRE_QUAL must be YES or NO';
      }
    } else if (keyResults === 'PREORDER') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'PREORDER must be YES or NO';
      }
    } else if (keyResults === 'PREPAID') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'PREPAID must be YES or NO';
      }
    } else if (keyResults === 'UPSELL') {
      if (this.checkYesOrNo(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'UPSELL must be YES or NO';
      }
      // Numeric validation patterns
    } else if (keyResults === 'FUNDED_AMOUNT') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'FUNDED_AMOUNT not numeric';
      }
    } else if (keyResults === 'AGE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​AGE not numeric';
      }
    } else if (keyResults === 'ANCILLARY_SPEND') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​ANCILLARY_SPEND not numeric';
      }
    } else if (keyResults === 'ANNUAL_FEE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​ANNUAL_FEE not numeric';
      }
    } else if (keyResults === 'APR') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'APR not numeric';
      }
    } else if (keyResults === 'APR_TRANSFER') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'APR_TRANSFER not numeric';
      }
    } else if (keyResults === 'APR_TRANSFER_TIME') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'APR_TRANSFER_TIME not numeric';
      }
    } else if (keyResults === 'BOOKING_VALUE_POST_TAX') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​BOOKING_VALUE_POST_TAX not numeric';
      }
    } else if (keyResults === 'BOOKING_VALUE_PRE_TAX') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​BOOKING_VALUE_PRE_TAX not numeric';
      }
    } else if (keyResults === 'CASH_ADVANCE_FEE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​CASH_ADVANCE_FEE not numeric';
      }
    } else if (keyResults === 'CATEGORY') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​CATEGORY not numeric';
      }
    } else if (keyResults === 'CONTRACT_LENGTH') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​CONTRACT_LENGTH not numeric';
      }
    } else if (keyResults === 'CREDIT_LINE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CREDIT_LINE not numeric';
      }
    } else if (keyResults === 'DROPOFF_IATA') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DROPOFF_IATA not numeric';
      }
    } else if (keyResults === 'FLYER_MILES') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'FLYER_MILES not numeric';
      }
    } else if (keyResults === 'FUNDED_CURRENCY') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'FUNDED_CURRENCY not numeric';
      }
    } else if (keyResults === 'FUNDED_AMOUNT') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'FUNDED_AMOUNT not numeric';
      }
    } else if (keyResults === 'INTRO_APR') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'INTRO_APR not numeric';
      }
    } else if (keyResults === 'INTRO_APR_TIME') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'INTRO_APR_TIME not numeric';
      }
    } else if (keyResults === 'LOYALTY_EARNED') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY_EARNED not numeric';
      }
    } else if (keyResults === 'LOYALTY_REDEEMED') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY_REDEEMED not numeric';
      }
    } else if (keyResults === 'MIN_BAL') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'MIN_BAL not numeric';
      }
    } else if (keyResults === 'MIN_DEPOSIT') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'MIN_DEPOSIT not numeric';
      }
    } else if (keyResults === 'MIN_STAY_DURATION') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'MIN_STAY_DURATION not numeric';
      }
    } else if (keyResults === 'ORDER_SUBTOTAL') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ORDER_SUBTOTAL not numeric';
      }
    } else if (keyResults === 'PAID_AT_BOOKING_POST_TAX') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​PAID_AT_BOOKING_POST_TAX not numeric';
      }
    } else if (keyResults === 'PAID_AT_BOOKING_PRE_TAX') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​PAID_AT_BOOKING_PRE_TAX not numeric';
      }
    } else if (keyResults === 'PROMOTION_CONDITIONTHRESHOLD') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PROMOTION_CONDITIONTHRESHOLD not numeric';
      }
    } else if (keyResults === 'PROMOTION_AMT') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'PROMOTION_AMT not numeric';
      }
    } else if (keyResults === 'QUANTITY') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'QUANTITY not numeric';
      }
    } else if (keyResults === 'RATING') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'RATING not numeric';
      }
    } else if (keyResults === 'ROOMS') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ROOMS not numeric';
      }
    } else if (keyResults === 'SUB_FEE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'SUB_FEE not numeric';
      }
    } else if (keyResults === 'SUB_LENGTH') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'SUB_LENGTH not numeric';
      }
    } else if (keyResults === 'TAX_AMOUNT') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'TAX_AMOUNT not numeric';
      }
    } else if (keyResults === 'TRANSFER_FEE') {
      if (this.checkNumericValue(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'TRANSFER_FEE not numeric';
      }
      // GUESTS vertical parameter calls for an integer, but the numeric check is sufficient
    } else if (keyResults === 'GUESTS') {
      if (this.checkNumericValue(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return '​GUESTS not numeric';
      }

    } else if (keyResults === 'CUST_COUNTRY') {
      if (this.checkCountryCode(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'CUST_COUNTRY invalid input!';
      }
    } else if (keyResults === 'DEST_COUNTRY') {
      if (this.checkCountryCode(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'DEST_COUNTRY invalid input!';
      }
    } else if (keyResults === 'OR_COUNTRY') {
      if (this.checkCountryCode(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.errorObj['error_' + index] = validationCol.id;
        return 'OR_COUNTRY invalid input!';
      }
      // Alphanumeric validation Pattern:
    } else if (keyResults === 'APP_STATUS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'APP_STATUS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'BOOKING_STATUS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'BOOKING_STATUS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'BRAND') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'BRAND contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'BRAND_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'BRAND_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'BUS_UNIT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'BUS_UNIT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CAMP_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CAMP_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CAMP_NAME') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CAMP_NAME contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CAR_OPTIONS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CAR_OPTIONS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CARD_CATEGORY') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CARD_CATEGORY contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CHANNEL') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CHANNEL contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CLASS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CLASS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CONFIRMATION_NUMBER') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CONFIRMATION_NUMBER contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CONTRACT_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CONTRACT_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'COUPON_DISCOUNT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'COUPON_DISCOUNT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'COUPON_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'COUPON_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CREDIT_QUALITY') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CREDIT_QUALITY contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CR_REPORT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CR_REPORT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CRUISE_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CRUISE_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CUST_POSTCODE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CUST_POSTCODE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CUST_SEGMENT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CUST_SEGMENT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CUST_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CUST_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'CUSTOMER.LOCATION') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CUSTOMER.LOCATION contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'DELIVERY') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'DELIVERY contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'DESCRIPTION') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'DESCRIPTION contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'DEST_CITY') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'DEST_CITY contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'DROPOFF_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'DROPOFF_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'FLIGHT_FARE_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'FLIGHT_FARE_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'FLIGHT_OPTIONS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'FLIGHT_OPTIONS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'FLIGHT_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'FLIGHT_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'GENRE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'GENRE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'IATA') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'IATA contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'ITEM_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ITEM_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'ITEM_NAME') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ITEM_NAME contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'ITEM_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ITEM_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'ITINERARY_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ITINERARY_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LIFESTAGE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LIFESTAGE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LOCATION') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOCATION contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LOYALTY.FIRSTTIMESIGNUP') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY.FIRSTTIMESIGNUP contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LOYALTY_FIRST_TIME_SIGNUP') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY_FIRST_TIME_SIGNUP  contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LOYALTY_LEVEL') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY_LEVEL contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'LOYALTY_STATUS') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'LOYALTY_STATUS contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'MARGIN') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'MARGIN contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'MARKETING_CHANNEL') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'MARKETING_CHANNEL contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'NO_CANCELLATION') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'NO_CANCELLATION contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'OR_CITY') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'OR_CITY contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PAYMENT_MODEL') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PAYMENT_MODEL contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PICKUP_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PICKUP_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PICKUP_IATA') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PICKUP_IATA contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PLATFORM_ID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PLATFORM_ID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'POINT_OF_SALE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'POINT_OF_SALE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PORT') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PORT contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PRE_QUAL') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PRE_QUAL contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PREORDER') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PREORDER contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PREPAID') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PREPAID contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PROMOTION') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PROMOTION contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PROMOTION_CONDITIONTYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PROMOTION_CONDITIONTYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'PROMOTION_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'PROMOTION_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'ROOM_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'ROOM_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'SERVICE_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'SERVICE_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'SHIP_NAME') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'SHIP_NAME contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'TAX_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'TAX_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'TRAVEL_TYPE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'TRAVEL_TYPE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'DEST_STATE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'DEST_STATE contains invalid characters or is undefined or null';
      }
    } else if (keyResults === 'OR_STATE') {
      if (this.checkAlphaNumericString(inputVal) === true || this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'OR_STATE contains invalid characters or is undefined or null';
      }
      //Universal Tag
    } else if (keyResults === 'TAGUUID') {
      if (this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'TAGUUID is empty';
      }
    } else if (keyResults === 'CUSTOM.STATS') {
      if (this.checkIfInputEmpty(inputVal) === true) {
        this.warningObj['warning_' + index] = validationCol.id;
        return 'CUSTOM.STATS is empty';
      }
    } else {
      this.warningObj['warning_' + index] = validationCol.id;
      return keyResults + " key is not recognized";
    }
  }

  checkIfNullValues() {
    for (var i = 0; i < this.paramsOutputJson.length; i++) {
      var value = (this.paramsOutputJson[i].value)
      var key = (this.paramsOutputJson[i].key)
      //checks if value is null and if the key is in required params, if in required params it will keep its original error message
      if (value == '' && (this.requiredParams[key] != true || this.paramsThatCanBeNull[key] == true)) {
        this.paramsOutputArray[i + 1][2] = "WARNING: The value passed in the " + key + " parameter is null"
        this.paramsOutputJson[i].validation = "WARNING: The value passed in the " + key + " paramter is null"
      }
    }
  }

  //Checks to see that no Paramter Keys are duplicates
  checkDuplicateInObject() {
    let keys = this.paramsOutputJson.map(item => {
      return item.key
    })
    let keyMap = keys.reduce(function(agg, key, i) {
      if (agg.hasOwnProperty(key)) {
        agg[key] = agg[key] + 1;
      } else {
        agg[key] = 1;
      }
      return agg;
    }, {})
    for (var i = 0; i < this.paramsOutputJson.length; i++) {
      var key = (this.paramsOutputJson[i].key)
      if (keyMap[key] > 1) {
        this.paramsOutputArray[i + 1][2] = "Key: " + key + " cannot have duplicates"
        this.paramsOutputJson[i].validation = "Key: " + key + " cannot have duplicates"
      }
    }
  }

  checkParamDoesNotStartWithZero() {
    for (var i = 0; i < this.paramsOutputJson.length; i++) {
      var key = (this.paramsOutputJson[i].key)
      var regKey = key.match(/(\d+)/)
      if (regKey !== null) {
        if (regKey[0] < 1) {
          this.paramsOutputArray[i + 1][2] = "Key: " + key + " cannot end with a 0"
          this.paramsOutputJson[i].validation = "Key: " + key + " cannot end with a 0"

        }
      }
    }
  }
  // Main method that parses and loops through key=value pairs
  // and generates validation output based on above methods
  // DO NOT MODIFY (unless you know what's up, then DO IT!)
  returnParsedValues(delimiter) {
    // Begin by generating fresh table
    // super.clearExistingTable();
    // super.generateTable();
    // super.generateTableHeader(['Key', 'Value', 'Validation']);
    this.errorObj = {}
    this.warningObj = {}
    try {
      // Trim extra spaces/returns on input
      this.paramsInput = this.paramsInput.trim();
      // Split by delimiter, default is ampersand
      const splitByDelimiter = this.paramsInput.split(delimiter);
      // Sort using custom function, ensure all advanced parameters in numeric order
      splitByDelimiter.sort(this.customSort);
      // Begin looping through key value pairs
      for (let i = 0; i < splitByDelimiter.length; i++) {
        // super.createNewTableRow(i);
        // Split by equal sign
        let newOutputArray = []
        let newOutputObj = {}

        const splitByEquals = splitByDelimiter[i].split('=');
        for (let q = 0; q < splitByEquals.length; q++) {
          // Pass first index into keyValidationPatterns method
          // You must detect this value in the method above
          if (q === 0) {
            var keyResults = this.keyValidationPatterns(splitByEquals[q]);
            newOutputArray.push(splitByEquals[q])
            newOutputObj['key'] = splitByEquals[q]
            this.paramKeys.push(splitByEquals[q])
          }
          // Pass second index into valueValidationPatterns method
          // You must detect what is returned in keyValidationPatterns method
          if (q === 1) {
            newOutputArray.push(splitByEquals[q]);
            newOutputObj['value'] = splitByEquals[q];
            var validationCol = {};
            var valueResults = this.valueValidationPatterns(splitByEquals[q], keyResults, validationCol, (i + q + 1));
            // If valueResults is undefined or null, we know no error occurred
            // Therefore the key=value pair is considered valid data
            if (valueResults === undefined || valueResults === null) {
              valueResults = 'Valid Data';
            }
            newOutputArray.push(valueResults);
            newOutputObj['validation'] = valueResults;
            this.paramsOutputArray.push(newOutputArray);
            this.paramsOutputJson.push(newOutputObj);
          }
        }
      }
      // Check if both AMOUNT and advanced parameters exist
      this.checkIfNullValues()
      this.checkParamDoesNotStartWithZero()
      this.checkDuplicateInObject()
      this.checkRequiredParams()
      this.calculateSubTotal()
      // Loop through additional errors object and insert content into document
      if (JSON.stringify(this.requiredParamFeedback) !== '{}') {
        for (var key in this.requiredParamFeedback) {
          document.getElementById('additionalErrors').innerHTML += this.requiredParamFeedback[key] + '\n'
        }
      }
    } catch (error) {
      throw new Error('ERROR: failed to loop through input data: ' + error);
    }
    this.convert_JSON_to_HTML(this.paramsOutputJson)
  }
  convert_JSON_to_HTML(list) {
    document.getElementById('keyGoesHere').innerHTML = '<form><fieldset><legend>Color Keys</legend><label class="yellow">Warning</label><div class="square-y"></div><label class="red">Error</label><div class="square-r"></div></fieldset></form>'
    document.getElementById('tableGoesHere').innerHTML = json2table(list, 'table');
    var dom = {
      data: document.getElementById('qsInput'),
      table: document.getElementById('tableGoesHere'),
    };
    dom.data.addEventListener('button', function() {
      dom.table.innerHTML = json2table(JSON.parse(JSON.stringify(list)), 'table');
    });
  }
}
