                <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Mortgage Calculator</title>
<link rel="stylesheet" href="css/mortgage-calculator.css">
</head>
<body>
<div class="wrap calc-ui">
  <div class="print-header only-print">
    <div class="printLogoText">Smart Indexes</div>
    <h1>Mortgage Calculator</h1>
    <div id="printDate" class="print-date" aria-hidden="true"></div>
    <span id="printURL" class="print-url"></span>
  </div>
<div class="titlebar">
      <h1 class="no-print">Mortgage Calculator</h1>
      <div class="titlebar-ctrls">
        <button type="button" class="btn btn-ghost small no-print" id="btnWhyDisabled">Why disabled?</button>
        <button type="button" class="btn btn-ghost small no-print" id="hintToggle">Show hints</button>
      </div>
    </div>
  <div class="grid2">
    <!-- LEFT: form -->
    <div class="card" id="formCard">
      <div class="columns">
        <div class="column left larger">
          <div class="row currency" role="group" aria-label="Currency">
            <label id="currencyToMortgage">Currency to mortgage<i></i></label>
            <div class="hint hidden" id="currencyToMortgage">
              The selected currency for mortgage settlements.
            </div>
            <div class="toggle" id="curToggle">
              <button type="button" data-cur="AED" class="active">AED</button>
              <button type="button" data-cur="USD">USD</button>
            </div>
            <span id="curShown" class="cur-shown printMargin" aria-live="polite">AED</span>
          </div>
        </div>
        <div class="column right">
          <div>
          <label id="annualInterestRate">Annual Interest Rate (%)<i></i></label>
          <div class="hint hidden" id="annualInterestRate">
            Annual Interest Rate calculates the annual cost of interest paid over the each year of a mortgage loan.
          </div>
          <input type="text" id="interestRate" value="4,5 %">
          <div class="range small interestRate">
            <input id="rateRange" type="range" min="1" max="10" step="0.01" value="4.5">
            <div class="minmax"><span>1%</span><span>10%</span></div>
          </div>
        </div>
      </div>
<br>
      <div class="chooseStartPeriod">
        <label id="startMortgagePeriod">Start mortgage period<i></i></label>
        <div class="hint hidden" id="startMortgagePeriod">
            Chosen month and year of start mortgage contract to counting its value and end date.
        </div>
        <div class="row">
          <button type="button" class="btn btn-ghost small" id="startBtn">Choose start period</button>
          <span id="startShown" class="muted"></span>
        </div>
        <!-- скрытый input month для нативного календаря -->
        <input type="month" id="startMonth" style="position\:absolute;left:-9999px;opacity:0;width:0;height:0;"/>
      </div>
<br>
      <div class="columns">
        <div class="column left larger">
          <div class="fieldhead">
            <label id="propertyValue">Property price for mortgage<i></i></label>
            <div class="hint hidden" id="propertyValue">
                The cost of the planned purchase of real estate.
            </div>
            <span class="muted" id="pvPct"></span>
          </div>
          <input type="text" id="propertyValue" placeholder="1,200,000 AED" class="money">
          <div class="range">
            <input id="pvRange" type="range" min="200000" max="200000000" step="10000" value="200000">
            <div class="minmax"><span id="pvMin">—</span><span id="pvMax">—</span></div>
          </div>
        </div>
        <div class="column right">
          <div class="fieldhead">
            <label id="downPayment">Down Payment<i></i></label>
            <div class="hint hidden" id="downPayment">
                A down payment is the amount of the initial payment on a mortgage loan.
            </div>
            <span class="pct" id="dpPct">0%</span>
          </div>
          <input type="text" id="downPayment" placeholder="400,000 AED" class="money">
          <div class="range">
            <input id="dpRange" type="range" min="0" max="100" step="1" value="20">
            <div class="minmax"><span id="dpMin">0 AED</span><span id="dpMax">—</span></div>
          </div>
        </div>
      </div>
<br>
      <div class="columns">
        <div class="column left larger">
          <div class="fieldhead">
            <label id="loanAmount">Loan amount<i></i></label>
            <span class="pct" id="laPct">100%</span>
            <div class="hint hidden" id="loanAmount">
              Estimated mortgage loan amount for the selected property with the indicated price.
            </div>
          </div>
          <input type="text" id="loanAmount" placeholder="800,000 AED" class="money">
          <div class="range">
            <input id="laRange" type="range" min="0" max="100" step="1" value="80">
            <div class="minmax"><span id="laMin">0 AED</span><span id="laMax">—</span></div>
          </div>
        </div>
        <div class="column right">
          <label id="loanPeriod">Loan Period<i></i></label>
          <div class="hint hidden" id="loanPeriod">
            Desired estimated term in years for repayment of mortgage loan.
          </div>
          <input type="number" id="loanDuration" min="5" max="25" step="1" placeholder="5–25">
          <div class="range">
            <input id="tenureRange" type="range" min="5" max="25" step="1" value="25">
            <div class="minmax"><span>5 years</span><span>25 years</span></div>
          </div>
        </div>
      </div>
      <label class="row vat">
        <input type="checkbox" id="feeVat" class="no-print" checked>
        <span class="textVat">Include 5% VAT on service fees.</span>
      </label>
      <details>
        <summary>Fees <i>Optional</i></summary>
        <div class="row">
          <div class="columns">
            <div class="column left larger" style="flex:1">
              <label id="conveyance">Conveyance<i></i></label>
              <div class="hint hidden" id="conveyance">
                Lawyer's fee for transaction support: document verification, approvals, organization of transfer of ownership.
              </div>
              <input type="text" id="feeConvey" class="money" placeholder="0 AED">
            </div>
            <div class="column right" style="flex:1">
              <label id="brokerCommission">Broker Сommission<i></i></label>
              <div class="hint hidden" id="brokerCommission">
                Commission to the broker (realtor) for selecting a property and supporting the purchase transaction.
              </div>
              <input type="text" id="feeBroker" class="money" placeholder="0 AED">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="columns">
            <div class="column left larger" style="flex:1">
              <label id="dldFee">Dubai Land Department Fee<i></i></label>
              <div class="hint hidden" id="dldFee">
                Dubai Land Department (DLD) fee for registering the transfer of ownership upon purchase.
              </div>
              <input type="text" id="feeDLD" class="money" placeholder="e.g., 4% of price">
            </div>
            <div class="column right" style="flex:1">
              <label id="mortgageRegistration">Mortgage Registration<i></i></label>
              <div class="hint hidden" id="mortgageRegistration">
                State fee DLD for registration of a mortgage (mortgage) on an object.
              </div>
              <input type="text" id="feeReg" class="money" placeholder="e.g., 0.25% of loan">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="columns">
            <div class="column left larger" style="flex:1">
              <label id="mortgageProcessing">Mortgage processing<i></i></label>
              <div class="hint hidden" id="mortgageProcessing">
                One-time bank fee for reviewing the application and processing the mortgage loan.
              </div>
              <input type="text" id="feeProc" class="money" placeholder="0 AED">
            </div>
            <div class="column right" style="flex:1">
              <label id="registrationFee">Registration fee<i></i></label>
              <div class="hint hidden" id="registrationFee">
                Trustee office service fee for completing the transaction and issuing a new Title Deed.
              </div>
              <input type="text" id="feeAdmin" class="money" placeholder="0 AED">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="columns">
            <div class="column left larger" style="flex:1">
              <label id="valuation">Valuation<i></i></label>
              <div class="hint hidden" id="valuation">
                Fee for real estate appraisal by an independent appraiser at the request of the bank.
              </div>
              <input type="text" id="feeVal" class="money" placeholder="0 AED">
            </div>
           <div class="column right" style="flex:1">
              <button type="button" class="btn btn-ghost no-print" id="btnAutofill">Auto-fill Dubai typical</button>
            </div>
          </div>
        </div>
        <span class="muted">Please check with your bank/realtor to make sure the figures are up to date.</span>
      </details>
<br>
      <div class="row buttons">
        <button class="btn btn-primary no-print" id="btnCalc" disabled>Calculate</button>
        <button class="btn btn-ghost no-print" id="btnReset" disabled>Reset</button>
        <button class="btn btn-ghost no-print" id="btnPrint" disabled>Print</button>
      </div>
    </div>
  </div>
<br>
    <!-- RIGHT: results -->
    <div class="card" id="resultCard">
      <h3 class="calculation">Calculation</h3>
<br>
      <div class="kpis">
        <div class="kpi">
          <span class="cur-badge" data-cur>AED</span>
          <small>Monthly Payment</small>
          <b id="kpiMonthly">—</b>
        </div>
        <div class="kpi">
          <span class="cur-badge" data-cur>AED</span>
          <small>Total Paid Interest</small>
          <b id="kpiTotInterest">—</b>
        </div>
        <div class="kpi">
          <span class="cur-badge" data-cur>AED</span>
          <small>Loan Amount</small>
          <b id="kpiLoan">—</b>
        </div>
        <div class="kpi">
          <small>Payoff Date</small>
          <b id="kpiPayoff">—</b>
        </div>
      </div>
<br>
      <div id="afterCalc" class="hidden">
        <h3 style="margin:16px 0 8px">Payment Breakdown</h3>
        <ul class="list" id="breakdown"></ul>
<br>
        <div class="row left copy">
          <button class="btn btn-ghost no-print" id="btnCopy" disabled>Copy</button>
        </div>
    </div>
  </div>
<br>
    <!-- DONUT (показывается только после расчёта) -->
    <div class="card full-span hidden" id="donutCard">
        <div class="donut-wrap">
          <div class="subHeader">Mortgage Ratio</div>
          <div id="donutLegend" class="legend"></div>
          <canvas id="donut" width="320" height="320"></canvas>
        </div>
        <div class="donutInfo">
          <h3 class="summary">Mortgage Summary</h3>
          <ul class="mortgageSummary" id="mortgageSummary"></ul>
          <!-- Notices -->
          <div class="notices">
            <p><b>Notices:</b></p>
            <ul>
              <li>Tenure limits: 5–25 years</li>
              <li>The maximum of 25 years is set by the CBUAE.</li>
              <li>This calculation of the mortgage on real estate is made at the specified rates and payment period, taking into account the main parameters.</li>
              <li>The exact cost of the mortgage can only be indicated in the mortgage bank.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="card full-span hidden" id="lineCard">
      <div class="subHeader">Periodical Mortgage Payments</div>
      <div class="chart-wrap"><canvas id="chart"></canvas></div>
    </div>
    <div class="card seo">
      <div class="columns">
        <div class="column left">
          <h2>Mortgage calculator for Dubai's residential property</h2>
          <p>Presented financial functional on this page &mdash; analytical instrument <strong>Mortgage calculator</strong>.</p>
          <ul>
            <li>Full free calculator for user experience in case for counting of mortgage sum and term.</li>
            <li>All financial calculators are free for users of Smart Indexes.</li>
            <li>Users can use Smart Indexes' free mortgage calculator to estimate payments and terms for loan options for residential property investment in Dubai, UAE.</li>
            <li>For business document management, you can print out the mortgage calculation in PDF format.</li>
            <li>If you find an error, please notify Smart Indexes <a href="https://smartindexes.com/contacts" class="contextURL" title="Contact Smart Indexes Support Team via email">Support Team via email</a>.</li>
          </ul>
        </div>
        <div class="column right mortgageCalculator"></div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js" defer></script>
<script src="js/mortgage-calculator.js" defer></script>
</body>