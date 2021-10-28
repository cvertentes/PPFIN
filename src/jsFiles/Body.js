import '../App.css';
import Container from 'react-bootstrap/Container';
import './Body.css';
import './ui.js';
import './jquery';
import './paramsClass';
import './itemLevel';


function Body() {
  return (
    <div className="Body">
      <Container>
      <div class="row">
      <div class="col-lg-12"></div>
        {/* Pixel Parser section */}
          <div class="ibox float-e-margins">
            <div class="ibox-title">
            {/* <a class="collapse-link"><i class="fa fa-chevron-up"></i></a> add to class below */}
            </div>
            <div class="ibox-content overflow">
              <label class="label-control">Query String</label>
              <textarea class="form-control" id="qsInput" rows="4"></textarea>
              <div>
                <button type="button" id="parse-ampersand" class="btn btn-dark">Parse Parameters</button>
                {/* <button type="button" id="itemLevelParseBtn" class="btn btn-success hide">Item Level Info</button> */}
                <button type="button" id="exportBtn" class="btn btn-secondary" >Export Table Data To Excel File</button>
                {/* <button type="button" id="jiraTestBtn" class="btn btn-primary hide">Log Test in Jira</button> */}
              </div>
              
              <div id="itemListDiv" class="hide"></div>
              
              <h5 id="companyGoesHere"> </h5>
              <h3 id="eventTime"> </h3>
              <h3 id="errorCode"> </h3>
              <h3 id="subtotalGoesHere"> </h3>
              <h3 id="additionalErrors"> </h3>
              <p id="subtotalStore" class="hide"></p>
              <div id="tableGoesHere" class="col-md-8"></div>
              <div id="keyGoesHere"></div>
            </div>
            <div id="transactionTable" class="col-md-6 x-mt10 hide"></div>
      </div>
      </div>
      </Container>
    </div>
  );
}

export default Body;
