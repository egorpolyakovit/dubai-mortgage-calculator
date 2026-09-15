(function(){
  "use strict";

  // ================= DEBUG =================
  let DEBUG = false;
  try { DEBUG = localStorage.getItem('mcDebug') === '1'; } catch (_) {}
  const dbg = (...a)=>{ if (DEBUG) console.debug('[MortgageCalc]', ...a); };

  // ===== Month guard (С‚РѕР»СЊРєРѕ С‚РµРєСѓС‰РёР№ РјРµСЃСЏС† Рё РІРїРµСЂС‘Рґ) =====
  const NOW = new Date();
  const CUR_MONTH_STR   = `${NOW.getFullYear()}-${String(NOW.getMonth()+1).padStart(2,'0')}`;
  const CUR_MONTH_START = new Date(NOW.getFullYear(), NOW.getMonth(), 1);  

  // С‚РµРєСѓС‰Р°СЏ Р»РѕРєР°Р»СЊ СЃС‚СЂР°РЅРёС†С‹
  const pageLang = document.documentElement.lang || navigator.language || undefined; 

  // ===== I18N =====
  const isRU = /^ru\b/i.test(pageLang || '');
  const I18N = {
  en: {
    Principal:"Principal", Interest:"Interest", "Monthly Payment":"Monthly Payment",
    "Loan Amount":"Loan Amount", "Down payment":"Down payment", "Total Extra":"Total Extra",
    "Required Upfront":"Required Upfront",
    "Total paid interest":"Total paid interest",
    Amount:"Amount", Balance:"Balance", "Cumulative Paid":"Cumulative Paid",
    "Remaining Balance":"Remaining Balance",
    "Your monthly payment is":"Your monthly payment is", "Total Interest":"Total Interest",
    "Total Payment":"Total Payment", Instalments:"Instalments", years:"years",
    "Mortgage Calculation":"Mortgage Calculation", Currency:"Currency", Start:"Start",
    Rate:"Rate", "Property Value":"Property Value", "Down Payment":"Down Payment",
    Term:"Term", Copy:"Copy", "Copied":"Copied", "Show hints":"Show hints",
    "Hide hints":"Hide hints", Help:"Help", "Why disabled?":"Why disabled?",
    "Form ok try calc":"The form looks valid вЂ” try Calculate.", "Please check:":"Please check:",
    "Loan Period (5вЂ“25)":"Loan Period (5вЂ“25)", "Annual Interest Rate (в‰Ґ 0)":"Annual Interest Rate (в‰Ґ 0)",
    "Payoff Date": "Payoff Date", 
    "Payment Breakdown": "Payment Breakdown",
    "Dubai Land Department Fee":"Dubai Land Department Fee",
    "Mortgage Registration":"Mortgage Registration",
    "Registration Fee":"Registration Fee",
    "Valuation":"Valuation",
    "Mortgage start period":"Mortgage start period",
    "Mortgage end period":"Mortgage end period"    
  },
  ru: {
    Principal:"РћСЃРЅРѕРІРЅРѕР№ РґРѕР»Рі",
    Interest:"РџСЂРѕС†РµРЅС‚С‹",
    "Monthly Payment":"Р•Р¶РµРјРµСЃСЏС‡РЅС‹Р№ РїР»Р°С‚С‘Р¶",
    "Loan Amount":"РЎСѓРјРјР° РєСЂРµРґРёС‚Р°",
    "Down payment":"РџРµСЂРІРѕРЅР°С‡Р°Р»СЊРЅС‹Р№ РІР·РЅРѕСЃ",
    "Total Extra":"РЎСѓРјРјР° РґРѕРї. СЂР°СЃС…РѕРґРѕРІ",
    "Required Upfront":"РўСЂРµР±СѓРµС‚СЃСЏ РґРѕ СЃРґРµР»РєРё",
    "Total paid interest":"Р’СЃРµРіРѕ РїСЂРѕС†РµРЅС‚РѕРІ Рє СѓРїР»Р°С‚Рµ", // в†ђ РёСЃРїСЂР°РІР»РµРЅРѕ
    Amount:"РЎСѓРјРјР°",
    Balance:"РћСЃС‚Р°С‚РѕРє РґРѕР»РіР°",
    "Cumulative Paid":"РќР°РєРѕРїРёС‚РµР»СЊРЅС‹Р№ РїР»Р°С‚С‘Р¶",
    "Remaining Balance":"РћСЃС‚Р°РІС€Р°СЏСЃСЏ Р·Р°РґРѕР»Р¶РµРЅРЅРѕСЃС‚СЊ",
    "Your monthly payment is":"Р’Р°С€ РµР¶РµРјРµСЃСЏС‡РЅС‹Р№ РїР»Р°С‚С‘Р¶",
    "Total Interest":"Р’СЃРµРіРѕ РїСЂРѕС†РµРЅС‚РѕРІ",
    "Total Payment":"Р’СЃРµРіРѕ РїР»Р°С‚РµР¶РµР№",
    Instalments:"РїР»Р°С‚РµР¶РµР№",
    years:"Р»РµС‚",
    "Mortgage Calculation":"РРїРѕС‚РµС‡РЅС‹Р№ СЂР°СЃС‡С‘С‚",
    Currency:"Р’Р°Р»СЋС‚Р°",
    Start:"РќР°С‡Р°Р»Рѕ",
    Rate:"РЎС‚Р°РІРєР°",
    "Property Value":"РЎС‚РѕРёРјРѕСЃС‚СЊ РѕР±СЉРµРєС‚Р°",
    "Down Payment":"РџРµСЂРІРѕРЅР°С‡Р°Р»СЊРЅС‹Р№ РІР·РЅРѕСЃ",
    Term:"РЎСЂРѕРє",
    Copy:"РљРѕРїРёСЂРѕРІР°С‚СЊ",
    "Copied":"РЎРєРѕРїРёСЂРѕРІР°РЅРѕ",
    "Show hints":"РџРѕРєР°Р·Р°С‚СЊ РїРѕРґСЃРєР°Р·РєРё",
    "Hide hints":"РЎРєСЂС‹С‚СЊ РїРѕРґСЃРєР°Р·РєРё",
    Help:"РЎРїСЂР°РІРєР°",
    "Why disabled?":"РџРѕС‡РµРјСѓ РЅРµРґРѕСЃС‚СѓРїРЅРѕ?",
    "Form ok try calc":"Р¤РѕСЂРјР° РєРѕСЂСЂРµРєС‚РЅР° вЂ” РЅР°Р¶РјРёС‚Рµ В«Р Р°СЃСЃС‡РёС‚Р°С‚СЊВ».",
    "Please check:":"РџСЂРѕРІРµСЂСЊС‚Рµ:",
    "Loan Period (5вЂ“25)":"РЎСЂРѕРє РєСЂРµРґРёС‚Р° (5вЂ“25)",
    "Annual Interest Rate (в‰Ґ 0)":"Р“РѕРґРѕРІР°СЏ СЃС‚Р°РІРєР° (в‰Ґ 0)",
    "Payoff Date": "Р”Р°С‚Р° РїРѕР»РЅРѕРіРѕ РїРѕРіР°С€РµРЅРёСЏ",
    "Payment Breakdown": "РЎС‚СЂСѓРєС‚СѓСЂР° РїР»Р°С‚РµР¶РµР№",
    "Dubai Land Department Fee":"РЎР±РѕСЂ Р—РµРјРµР»СЊРЅРѕРіРѕ РґРµРїР°СЂС‚Р°РјРµРЅС‚Р° Р”СѓР±Р°СЏ",
    "Mortgage Registration":"Р РµРіРёСЃС‚СЂР°С†РёСЏ РёРїРѕС‚РµРєРё (DLD)",
    "Registration Fee":"РЎРµСЂРІРёСЃРЅС‹Р№ СЃР±РѕСЂ Trustee",
    "Valuation":"РћС†РµРЅРєР° РѕР±СЉРµРєС‚Р°",
    "Mortgage start period":"РќР°С‡Р°Р»Рѕ РёРїРѕС‚РµС‡РЅРѕРіРѕ РїРµСЂРёРѕРґР°",
    "Mortgage end period":"РћРєРѕРЅС‡Р°РЅРёРµ РёРїРѕС‚РµС‡РЅРѕРіРѕ РїРµСЂРёРѕРґР°",
    "Total paid interest":"Р’СЃРµРіРѕ РїСЂРѕС†РµРЅС‚РѕРІ Рє СѓРїР»Р°С‚Рµ"
  }
  };
  const T = (k)=> (I18N[isRU ? 'ru':'en'][k] ?? k);

  // ================= ELEMENTS =================
  const els = {
    curToggle:   document.getElementById('curToggle'),
    curShown: document.getElementById('curShown'),
    startBtn:    document.getElementById('startBtn'),
    startShown:  document.getElementById('startShown'),
    startMonth:  document.getElementById('startMonth'),

    interestRate:   document.querySelector('input#interestRate'),
    rateRange:      document.getElementById('rateRange'),
    propertyValue:  document.querySelector('input#propertyValue'),
    downPayment:    document.querySelector('input#downPayment'),
    loanAmount:     document.querySelector('input#loanAmount'),
    loanDuration:   document.querySelector('input#loanDuration'),

    tenureRange:    document.getElementById('tenureRange'),
    dpRange:        document.getElementById('dpRange'),
    laRange:        document.getElementById('laRange'),
    dpPct:          document.getElementById('dpPct'),
    laPct:          document.getElementById('laPct'),
    dpMin:          document.getElementById('dpMin'),
    dpMax:          document.getElementById('dpMax'),
    laMin:          document.getElementById('laMin'),
    laMax:          document.getElementById('laMax'),
    pvPct:          document.getElementById('pvPct'),
    pvRange:        document.getElementById('pvRange'),
    pvMin:          document.getElementById('pvMin'),
    pvMax:          document.getElementById('pvMax'),

    btnCalc:     document.getElementById('btnCalc'),
    btnReset:    document.getElementById('btnReset'),
    btnPrint:    document.getElementById('btnPrint'),
    btnAutofill: document.getElementById('btnAutofill'),
    btnCopy:     document.getElementById('btnCopy'),

    // KPI
    kpiMonthly:  document.getElementById('kpiMonthly'),
    kpiTotInterest: document.getElementById('kpiTotInterest'),
    kpiLoan:     document.getElementById('kpiLoan'),
    kpiPayoff:   document.getElementById('kpiPayoff'),
    curBadges:   document.querySelectorAll('[data-cur]'),
    breakdown:   document.getElementById('breakdown'),
    mortgageSummary: document.getElementById('mortgageSummary'),
    monthlyText: document.getElementById('monthlyText'),

    // Charts
    donutCard:   document.getElementById('donutCard'),
    lineCard:    document.getElementById('lineCard'),
    chart:       document.getElementById('chart'),
    donut:       document.getElementById('donut'),
    donutLegend: document.getElementById('donutLegend'),

    // Fees
    feeConvey:   document.querySelector('input#feeConvey'),
    feeBroker:   document.querySelector('input#feeBroker'),
    feeDLD:      document.querySelector('input#feeDLD'),
    feeReg:      document.querySelector('input#feeReg'),
    feeProc:     document.querySelector('input#feeProc'),
    feeAdmin:    document.querySelector('input#feeAdmin'),
    feeVal:      document.querySelector('input#feeVal'),

    afterCalc:   document.getElementById('afterCalc')
  };

  const aedToCur = (n)=> currency==='AED' ? n : Math.round(n/FX);
  const curToAed = (n)=> currency==='AED' ? n : Math.round(n*FX);
  
  function updatePvRangeBounds(){
    if (!els.pvRange) return;
    const MIN_AED = 200_000;
    const MAX_AED = 200_000_000; 
    const STEP_AED= 10_000;
    const min = aedToCur(MIN_AED);
    const max = aedToCur(MAX_AED);
    const step= Math.max( currency==='AED' ? STEP_AED : Math.round(STEP_AED/FX), 1 );
    els.pvRange.min  = String(min);
    els.pvRange.max  = String(max);
    els.pvRange.step = String(step);
    els.pvMin.textContent = moneyStr(min);
    els.pvMax.textContent = moneyStr(max);

    const pv = parseMoney(els.propertyValue.value) || min;
    els.pvRange.value = String( Math.min(max, Math.max(min, pv)) );
  }

  function syncPvRangeFromInput(){
    if (!els.pvRange) return;
    const pv = parseMoney(els.propertyValue.value);
    if (!pv) return;
    const min = Number(els.pvRange.min)||0;
    const max = Number(els.pvRange.max)||0;
    els.pvRange.value = String( Math.min(max, Math.max(min, pv)) );
  }

  // ===== Helpers: clear & hide results =====
  function clearCharts(){
    if (lineChart){
      lineChart.data.labels = [];
      lineChart.data.datasets = [];
      lineChart.update();
    }
    if (donutChart){
      donutChart.data.labels = [ T('Principal'), T('Interest') ];
      donutChart.data.datasets[0].data = [0, 0];
      donutChart.update();
    }
    els.donutLegend.innerHTML = '';
  }

  const DONUT_COLORS = { principal:'#5b4ee6', interest:'#f59e0b' };
  const FX = 3.6725; // AED per USD
  let currency = 'AED';

  // ===== Hints for "Payment Breakdown" =====
  const BREAKDOWN_HINTS = isRU ? {
    [T('Principal')]: 'Р§Р°СЃС‚СЊ РµР¶РµРјРµСЃСЏС‡РЅРѕРіРѕ РїР»Р°С‚РµР¶Р°, СѓРјРµРЅСЊС€Р°СЋС‰Р°СЏ РѕСЃРЅРѕРІРЅРѕР№ РґРѕР»Рі.',
    [T('Interest')]: 'Р§Р°СЃС‚СЊ РµР¶РµРјРµСЃСЏС‡РЅРѕРіРѕ РїР»Р°С‚РµР¶Р°, РёРґСѓС‰Р°СЏ Р±Р°РЅРєСѓ РєР°Рє РїСЂРѕС†РµРЅС‚С‹ Р·Р° РїРѕР»СЊР·РѕРІР°РЅРёРµ РєСЂРµРґРёС‚РѕРј.',
    [T('Monthly Payment')]: 'РС‚РѕРіРѕРІС‹Р№ РµР¶РµРјРµСЃСЏС‡РЅС‹Р№ РїР»Р°С‚С‘Р¶: РѕСЃРЅРѕРІРЅРѕР№ РґРѕР»Рі + РїСЂРѕС†РµРЅС‚С‹ ...',
    [T('Loan Amount')]: 'РЎСѓРјРјР°, РєРѕС‚РѕСЂСѓСЋ РІС‹ С„Р°РєС‚РёС‡РµСЃРєРё Р±РµСЂС‘С‚Рµ РІ Р±Р°РЅРєРµ ...',
    [T('Down payment')]: 'РџРµСЂРІРѕРЅР°С‡Р°Р»СЊРЅС‹Р№ РІР·РЅРѕСЃ РїРѕРєСѓРїР°С‚РµР»СЏ ...',
    [T('Total Extra')]: 'РЎСѓРјРјР° РІСЃРµС… СЃРѕРїСѓС‚СЃС‚РІСѓСЋС‰РёС… СЂР°СЃС…РѕРґРѕРІ ...',
    [T('Required Upfront')]: 'РЎСѓРјРјР°, РєРѕС‚РѕСЂР°СЏ РЅСѓР¶РЅР° РґРѕ СЃРґРµР»РєРё: РїРµСЂРІРѕРЅР°С‡Р°Р»СЊРЅС‹Р№ РІР·РЅРѕСЃ + РґРѕРї. СЂР°СЃС…РѕРґС‹.',
    [T('Total paid interest')]: 'РС‚РѕРіРѕРІР°СЏ СЃСѓРјРјР° РїСЂРѕС†РµРЅС‚РѕРІ Р±Р°РЅРєСѓ Р·Р° РІРµСЃСЊ СЃСЂРѕРє РєСЂРµРґРёС‚Р° РїСЂРё С‚РµРєСѓС‰РёС… СѓСЃР»РѕРІРёСЏС….',
    [T('Dubai Land Department Fee')]:
      'Р“РѕСЃРїРѕС€Р»РёРЅР° DLD Р·Р° СЂРµРіРёСЃС‚СЂР°С†РёСЋ РїРµСЂРµС…РѕРґР° РїСЂР°РІР° СЃРѕР±СЃС‚РІРµРЅРЅРѕСЃС‚Рё (РѕР±С‹С‡РЅРѕ 4% РѕС‚ С†РµРЅС‹ РѕР±СЉРµРєС‚Р°).',
    [T('Mortgage Registration')]:
      'Р“РѕСЃРїРѕС€Р»РёРЅР° DLD Р·Р° СЂРµРіРёСЃС‚СЂР°С†РёСЋ РёРїРѕС‚РµРєРё: 0,25% РѕС‚ СЃСѓРјРјС‹ РєСЂРµРґРёС‚Р° + 290 AED.',
    [T('Registration Fee')]:
      'РЎРµСЂРІРёСЃРЅС‹Р№ СЃР±РѕСЂ РѕС„РёСЃР° Trustee Р·Р° РѕС„РѕСЂРјР»РµРЅРёРµ СЃРґРµР»РєРё Рё РІС‹РґР°С‡Сѓ Title Deed (СЃ РќР”РЎ).',
    [T('Valuation')]:
      'РЎР±РѕСЂ Р·Р° РЅРµР·Р°РІРёСЃРёРјСѓСЋ РѕС†РµРЅРєСѓ РѕР±СЉРµРєС‚Р° РїРѕ Р·Р°РїСЂРѕСЃСѓ Р±Р°РЅРєР° (СЃ РќР”РЎ).'      
  } : {
    'Principal': 'The part of the monthly payment that reduces principal.',
    'Interest': 'The portion of the payment that goes to interest.',
    'Monthly Payment': 'Principal + Interest (excl. utilities/insurance unless noted).',
    'Loan Amount': 'Amount actually borrowed from the bank.',
    'Down payment': 'BuyerвЂ™s upfront payment not financed by the bank.',
    'Total Extra': 'All fees not included in the property price.',
    'Required Upfront': 'Down payment + Total Extra.',
    'Total paid interest': 'Total interest over the full loan term.',
    [T('Dubai Land Department Fee')]:
      'DLD transfer fee (typically 4% of property value).',
    [T('Mortgage Registration')]:
      'DLD mortgage registration fee: 0.25% of loan amount + AED 290.',
    [T('Registration Fee')]:
      'Trustee service fee for closing and issuing new Title Deed (incl. VAT).',
    [T('Valuation')]:
      'Independent property valuation fee requested by the bank (incl. VAT).'
  };

  // [+] РҐРРќРўР« Р”Р›РЇ РљРћРњРРЎРЎРР™ (EN Рё RU-РІР°СЂРёР°РЅС‚С‹)
  // EN labels:
  BREAKDOWN_HINTS['Dubai Land Department Fee'] = 'Government transfer fee (commonly 4% of property price) charged by DLD.';
  BREAKDOWN_HINTS['Mortgage Registration']     = 'DLD mortgage registration fee: 0.25% of loan amount + AED 290.';
  BREAKDOWN_HINTS['Registration Fee']          = 'Trustee service/admin fee (often subject to 5% VAT).';
  BREAKDOWN_HINTS['Valuation']                 = 'Bank valuation fee for independent appraisal (often +5% VAT).';
  // RU labels (РЅР° Р±СѓРґСѓС‰РµРµ, РµСЃР»Рё Р»РѕРєР°Р»РёР·СѓРµС‚Рµ Р·Р°РіРѕР»РѕРІРєРё РїСѓРЅРєС‚РѕРІ):
  BREAKDOWN_HINTS['РЎР±РѕСЂ DLD']                  = 'Р“РѕСЃРїРѕС€Р»РёРЅР° DLD Р·Р° РїРµСЂРµС…РѕРґ РїСЂР°РІР° СЃРѕР±СЃС‚РІРµРЅРЅРѕСЃС‚Рё (РѕР±С‹С‡РЅРѕ 4% РѕС‚ С†РµРЅС‹).';
  BREAKDOWN_HINTS['Р РµРіРёСЃС‚СЂР°С†РёСЏ РёРїРѕС‚РµРєРё (DLD)'] = 'РџРѕС€Р»РёРЅР° DLD: 0,25% РѕС‚ СЃСѓРјРјС‹ РєСЂРµРґРёС‚Р° + AED 290.';
  BREAKDOWN_HINTS['Р РµРіРёСЃС‚СЂР°С†РёРѕРЅРЅС‹Р№ СЃР±РѕСЂ']      = 'РЎРµСЂРІРёСЃРЅС‹Р№ СЃР±РѕСЂ РѕС„РёСЃР° Trustee (РєР°Рє РїСЂР°РІРёР»Рѕ, СЃ РќР”РЎ 5%).';
  BREAKDOWN_HINTS['РћС†РµРЅРєР° РѕР±СЉРµРєС‚Р°']            = 'РЎР±РѕСЂ Р·Р° РЅРµР·Р°РІРёСЃРёРјСѓСЋ РѕС†РµРЅРєСѓ РїРѕ Р·Р°РїСЂРѕСЃСѓ Р±Р°РЅРєР° (РѕР±С‹С‡РЅРѕ СЃ РќР”РЎ 5%).';

  function attachBreakdownHints(){
    let globalOn = false;
    try { globalOn = localStorage.getItem('mortgageHints') === '1'; } catch (_) {}
    els.breakdown.querySelectorAll('li').forEach(li=>{
      const label = li.querySelector('span'); 
      if(!label) return;
      const key = label.textContent.trim();
      const tip = BREAKDOWN_HINTS[key]; 
      if(!tip) return;

      let wrap = label.closest('.withHint');
      if(!wrap){
        wrap = document.createElement('span');
        wrap.className = 'withHint';
        label.replaceWith(wrap);
        wrap.appendChild(label);
      }

      let btn = wrap.querySelector('button.hintToggle');
      if(!btn){
        btn = document.createElement('button');
        btn.type='button';
        btn.className='hintToggle';
        btn.setAttribute('aria-label', T('Help'));
        wrap.appendChild(btn);
      }

      let hint = wrap.querySelector('.hint');
      if(!hint){
        hint = document.createElement('div');
        hint.className='hint hidden';
        wrap.appendChild(hint);
      }

      hint.textContent = tip;
      setHintVisible(hint, globalOn);
      btn.setAttribute('aria-expanded', String(globalOn));

      if(!btn._mcBound){
        btn.addEventListener('click', (e)=>{ e.preventDefault(); toggleHint(hint); });
        btn._mcBound = true;
      }

      if (!hint._mcHoverBound){
        hint.addEventListener('mouseenter', ()=> { try{ clearTimeout(hintTimers.get(hint)); }catch(_){ } });
        hint.addEventListener('mouseleave', ()=> scheduleAutohide(hint));
        hint._mcHoverBound = true;
      }

      if(!label._mcBound){
        label.style.cursor='help';
        label.addEventListener('click', ()=> toggleHint(hint));
        label._mcBound = true;
      }
    });
  }

  function setCurrency(code){
    currency = code;

    if (els.curShown) {
      els.curShown.textContent = code;
      els.curShown.setAttribute('data-currency', code);
      els.curShown.setAttribute(
        'aria-label',
        isRU
          ? (code === 'AED' ? 'Р”РёСЂС…Р°Рј РћРђР­' : 'Р”РѕР»Р»Р°СЂ РЎРЁРђ')
          : (code === 'AED' ? 'UAE dirham' : 'US dollar')
      );
    }

    els.curBadges.forEach(b=> b.textContent = code);
    document.querySelectorAll('.money').forEach(formatMoneyInput);
    updateRangeLabels();
    dbg('Currency set:', code);
  }

  setCurrency('AED');
  els.curToggle?.querySelector('button[data-cur="AED"]')?.classList.add('active');

  function parseMoney(str){
    if (!str) return 0;
    const d = String(str).replace(/[^\d]/g,'');
    return d ? Number(d) : 0;
  }
  function moneyStr(n){
    // [+] AED Рё USD вЂ” РїСЂРµС„РёРєСЃ РїРµСЂРµРґ С‡РёСЃР»РѕРј (AED/$)
    const locale =
      currency === 'AED' ? 'en-AE' :
      currency === 'USD' ? 'en-US' :
      (isRU ? 'ru-RU' : 'en-US');
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency, maximumFractionDigits: 0, notation: 'standard'
    }).format(n || 0);
  }
  function percentParse(str){
    if(!str) return 0;
    const s = String(str).replace(/[^\d.,]/g,'').replace(',','.');
    const v = parseFloat(s);
    return isFinite(v) ? v : 0;
  }
  function percentStr(v){
    const num = (v ?? 0).toFixed(2);
    if (isRU) {
      return num.replace('.', ',').replace(/,00$/,'') + ' %';
    } else {
      return num.replace(/\.00$/,'') + '%';
    }
  }
  function formatMoneyInput(el){
    const n = parseMoney(el.value);
    el.value = n ? moneyStr(n) : '';
  }
  function onMoneyInput(e){
    const el = e.currentTarget;
    syncLoans(el);
    enableButtonsMaybe();
    updateRangeLabels();
    if (el === els.propertyValue) { syncPvRangeFromInput(); enforceMinDownPayment(); }
  }

  // ================= Month picker =================
  function parseMonthInput(v){
    let d;
    if(!v || !/^\d{4}-\d{2}$/.test(v)){
      d = CUR_MONTH_START;
    } else {
      const [y,m] = v.split('-').map(Number);
      d = new Date(y, m-1, 1);
    }
    return d < CUR_MONTH_START ? CUR_MONTH_START : d;
  }
  function formatMonthValue(v){
    const d = v instanceof Date ? v : parseMonthInput(v);
    return d.toLocaleDateString(pageLang, { month:'long', year:'numeric' });
  }
  function openMonthPicker(){
    const tmp = document.createElement('input');
    tmp.type = 'month';
    const useDate = (tmp.type !== 'month');
    tmp.type = useDate ? 'date' : 'month';

    if (useDate){ tmp.min = `${CUR_MONTH_STR}-01`; } else { tmp.min = CUR_MONTH_STR; }

    let cur = els.startMonth.value; // "YYYY-MM"
    if (!cur || cur < CUR_MONTH_STR) cur = CUR_MONTH_STR;
    tmp.value = useDate ? (cur + '-01') : cur;
    Object.assign(tmp.style, {
      position:'fixed', left:'0', top:'0',
      width:'1px', height:'1px', opacity:'0', zIndex:'9999'
    });
    document.body.appendChild(tmp);

    const cleanup = () => { try { document.body.removeChild(tmp); } catch(_){ } };

    tmp.addEventListener('change', () => {
      if (!tmp.value){ cleanup(); return; }
      let chosenStr;
      if (useDate){
        const [y,m] = tmp.value.split('-');
        chosenStr = `${y}-${m}`;
      } else {
        chosenStr = tmp.value;
      }
      if (chosenStr < CUR_MONTH_STR) chosenStr = CUR_MONTH_STR;
      els.startMonth.value = chosenStr;
      els.startShown.textContent = formatMonthValue(chosenStr);
      cleanup();
    }, { once:true });

    tmp.addEventListener('blur', () => setTimeout(cleanup, 200), { once:true });

    try { if (tmp.showPicker){ tmp.showPicker(); } else { tmp.focus(); tmp.click(); } }
    catch(_) { tmp.focus(); tmp.click(); }
  }
  els.startBtn.addEventListener('click', openMonthPicker);

  // default month now
  (function(){
    els.startMonth.value = CUR_MONTH_STR;
    els.startMonth.setAttribute('min', CUR_MONTH_STR);
    els.startShown.textContent = formatMonthValue(els.startMonth.value);
  })();

  // ================= Sync Property/Down/Loan + sliders =================
  let syncing=false;
  function syncLoans(fromEl){
    if (syncing) return; syncing = true;
    const pv=parseMoney(els.propertyValue.value);
    let dp=parseMoney(els.downPayment.value);
    let la=parseMoney(els.loanAmount.value);

    if (fromEl===els.loanAmount || fromEl===els.laRange){
      const pct=pv?Math.round((la/pv)*100):0;
      els.laRange.value=pct;
      els.dpRange.value=Math.max(0,100-pct);
      dp=pv-la; els.downPayment.value=dp?moneyStr(dp):'';
      dbg('sync from loan', {pv, la, dp, laPct:els.laRange.value});
    } else {
      const pct=pv?Math.round((dp/pv)*100):0;
      els.dpRange.value=pct;
      els.laRange.value=Math.max(0,100-pct);
      la=pv-dp; els.loanAmount.value=la?moneyStr(la):'';
      dbg('sync from down', {pv, la, dp, dpPct:els.dpRange.value});
    }
    els.dpPct.textContent=els.dpRange.value+'%';
    els.laPct.textContent=els.laRange.value+'%';
    els.pvPct.textContent=pv?'('+moneyStr(pv)+')':'';
    syncing=false;
  }

  document.querySelectorAll('.money').forEach(el=>{
    el.addEventListener('input', onMoneyInput);
    el.addEventListener('blur', ()=>formatMoneyInput(el));
  });

  // РЎР»РµРґРёРј Р·Р° РјРёРЅРёРјР°Р»СЊРЅС‹Рј РїРµСЂРІРѕРЅР°С‡Р°Р»СЊРЅС‹Рј РІР·РЅРѕСЃРѕРј РїСЂРё РІРІРѕРґРµ СЃСѓРјРј
  ['input','blur'].forEach(evt=>{
    els.propertyValue.addEventListener(evt, enforceMinDownPayment);
    els.downPayment.addEventListener(evt, enforceMinDownPayment);
    els.loanAmount.addEventListener(evt, enforceMinDownPayment);
  });

  // ranges
  els.pvRange?.addEventListener('input', ()=>{
    const v = Number(els.pvRange.value)||0;
    els.propertyValue.value = moneyStr(v);
    syncLoans(els.propertyValue); 
    enableButtonsMaybe();
    updateRangeLabels();
    enforceMinDownPayment();
  });  
  els.dpRange.addEventListener('input', ()=>{
    const pv=parseMoney(els.propertyValue.value);
    const dp=Math.round(pv*(els.dpRange.value/100));
    els.downPayment.value=moneyStr(dp);
    els.dpPct.textContent=els.dpRange.value+'%';
    els.laRange.value=100-Number(els.dpRange.value);
    const la=pv-dp; els.loanAmount.value=moneyStr(la);
    els.laPct.textContent=els.laRange.value+'%';
    enableButtonsMaybe(); updateRangeLabels();
    enforceMinDownPayment();
  });
  els.laRange.addEventListener('input', ()=>{
    const pv=parseMoney(els.propertyValue.value);
    const la=Math.round(pv*(els.laRange.value/100));
    els.loanAmount.value=moneyStr(la);
    els.laPct.textContent=els.laRange.value+'%';
    els.dpRange.value=100-Number(els.laRange.value);
    const dp=pv-la; els.downPayment.value=moneyStr(dp);
    els.dpPct.textContent=els.dpRange.value+'%';
    enableButtonsMaybe(); updateRangeLabels();
    enforceMinDownPayment();
  });
  els.tenureRange.addEventListener('input', ()=>{
    els.loanDuration.value=els.tenureRange.value; enableButtonsMaybe();
  });
  els.loanDuration.addEventListener('input', ()=>{
    let v=parseInt(els.loanDuration.value||'0',10);
    if(v<5 && v!==0) v=5;
    if(v>25) v=25;
    els.loanDuration.value=v||'';
    els.tenureRange.value=v||5;
    enableButtonsMaybe();
  });
  els.rateRange.addEventListener('input', ()=>{
    const v=Number(els.rateRange.value);
    els.interestRate.value=percentStr(v);
    enableButtonsMaybe();
  });
  els.interestRate.addEventListener('input', ()=>{
    const v=percentParse(els.interestRate.value);
    els.rateRange.value=v;
    els.interestRate.value=percentStr(v);
    enableButtonsMaybe();
  });

  function updateRangeLabels(){
    const pv=parseMoney(els.propertyValue.value);
    els.dpMin.textContent=moneyStr(0);
    els.dpMax.textContent=moneyStr(pv);
    els.laMin.textContent=moneyStr(0);
    els.laMax.textContent=moneyStr(pv);
  }

  // ===== LTV guard =====
  function enforceMinDownPayment() {
    const pv = parseMoney(els.propertyValue.value);
    if (!pv) return;

    const minPct = pv > 5_000_000 ? 30 : 20;

    els.dpRange.min = minPct;

    const dp = parseMoney(els.downPayment.value);
    const la = parseMoney(els.loanAmount.value);

    if (pv && (dp / pv * 100) < minPct) {
      const newDp = Math.round(pv * (minPct / 100));
      const newLa = Math.max(0, pv - newDp);
      els.downPayment.value = moneyStr(newDp);
      els.loanAmount.value  = moneyStr(newLa);
      els.dpRange.value = String(minPct);
      els.laRange.value = String(100 - minPct);
      els.dpPct.textContent = minPct + '%';
      els.laPct.textContent = (100 - minPct) + '%';
    }
  }

  // ================= Currency toggle =================
  els.curToggle?.addEventListener('click', (e)=>{
    const btn=e.target.closest('button[data-cur]');
    if(!btn || btn.classList.contains('active')) return;
    els.curToggle.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    const next = btn.dataset.cur;
    const prev = currency; // Р·Р°РїРѕРјРЅРёРј С‚РµРєСѓС‰СѓСЋ
    const convert = (n, from, to) =>
      (from===to) ? n : (from==='AED' && to==='USD' ? Math.round(n/FX) : Math.round(n*FX));

    setCurrency(next);

    [els.propertyValue, els.downPayment, els.loanAmount,
    els.feeConvey, els.feeBroker, els.feeDLD, els.feeReg, els.feeProc, els.feeAdmin, els.feeVal]
      .forEach(el => {
        const n = parseMoney(el.value);
        if (n) el.value = moneyStr(convert(n, prev, next));
      });
    updatePvRangeBounds();
    syncPvRangeFromInput();    
    enableButtonsMaybe();
    enforceMinDownPayment();
    if (hasCalculated) calculate();
  });

  // РІС‹СЂРѕРІРЅСЏС‚СЊ РїРѕРґРїРёСЃРё РєРЅРѕРїРѕРє РїРѕ Р°С‚СЂРёР±СѓС‚Сѓ data-cur
  els.curToggle.querySelectorAll('button[data-cur]').forEach(btn => btn.textContent = btn.dataset.cur);

  // ================= Autofill fees =================
  document.getElementById('btnAutofill')?.addEventListener('click', ()=>{
    const pv = parseMoney(els.propertyValue.value);
    const la = parseMoney(els.loanAmount.value);
    if (pv) els.feeDLD.value = moneyStr(Math.round(pv * 0.04));
    if (la) els.feeReg.value = moneyStr(Math.round(la * 0.0025 + 290));
    els.feeAdmin.value = moneyStr(4000);
    els.feeVal.value   = moneyStr(3000);
    enableButtonsMaybe();
    dbg('Autofill fees (ex VAT)', {pv, la});
  });

  // ================= Buttons state =================
  let everTyped=false, hasCalculated=false, lastCopyText="";
  document.getElementById('formCard').addEventListener('input', ()=>{
    everTyped=true; enableButtonsMaybe();
  });

  function formValidDetails(){
    const pv=parseMoney(els.propertyValue.value);
    const la=parseMoney(els.loanAmount.value);
    const years=parseInt(els.loanDuration.value||'0',10);
    const rate=percentParse(els.interestRate.value);

    const problems=[];
    if(!(pv>0)) problems.push(T('Property Value'));
    if(!(la>0)) problems.push(T('Loan Amount'));
    if(!(years>=5 && years<=25)) problems.push(T('Loan Period (5вЂ“25)'));
    if(!(rate>=0)) problems.push(T('Annual Interest Rate (в‰Ґ 0)'));
    return { ok: problems.length===0, problems, values:{pv,la,years,rate} };
  }
  function formValid(){ return formValidDetails().ok; }

  function enableButtonsMaybe(){
    els.btnCalc.disabled = !formValid();
    els.btnReset.disabled = !everTyped;
    if (els.btnPrint) els.btnPrint.disabled = !hasCalculated;
    els.btnCopy.disabled  = !hasCalculated;
  }

  els.btnReset.addEventListener('click', ()=>{
    [els.propertyValue,els.downPayment,els.loanAmount,els.loanDuration,
     els.feeConvey,els.feeBroker,els.feeDLD,els.feeReg,els.feeProc,els.feeAdmin,els.feeVal]
     .forEach(el=> el.value='');
    els.interestRate.value='4,5 %';
    els.rateRange.value=4.5; els.tenureRange.value=25; els.dpRange.value=20; els.laRange.value=80;
    everTyped=false; hasCalculated=false; lastCopyText="";
    els.kpiMonthly.textContent='вЂ”'; els.kpiTotInterest.textContent='вЂ”'; els.kpiLoan.textContent='вЂ”'; els.kpiPayoff.textContent='вЂ”';
    els.breakdown.innerHTML='';
    els.mortgageSummary.innerHTML='';
    els.donutLegend.innerHTML='';
    if (els.monthlyText) els.monthlyText.textContent='вЂ”';
    destroyCharts(); 
    hideResults();
    els.startMonth.value = CUR_MONTH_STR;
    els.startShown.textContent = formatMonthValue(CUR_MONTH_STR);    
    updateRangeLabels(); 
    enableButtonsMaybe();
    dbg('Reset form');
  });
  if (els.btnPrint) {
    els.btnPrint.addEventListener('click', ()=> window.print());
  }
  els.btnCopy.addEventListener('click', async ()=>{
    if(!lastCopyText) return;
    try{
      await navigator.clipboard.writeText(lastCopyText);
      // [-] РіР°Р»РѕС‡РєР°/СЃРёРјРІРѕР»С‹
      // els.btnCopy.textContent = T('Copied вњ“');
      // setTimeout(()=> els.btnCopy.textContent = T('Copy'), 1200);
      // [+] С‚РѕР»СЊРєРѕ С‚РµРєСЃС‚, Р·Р°С‚РµРј РІРµСЂРЅСѓС‚СЊ Рє РёСЃС…РѕРґРЅРѕРјСѓ
      els.btnCopy.textContent = T('Copied');
      setTimeout(()=> { els.btnCopy.textContent = T('Copy'); }, 1200);
    }catch(_){}
  });

  // ================= Charts =================
  let lineChart=null, donutChart=null;

  // РџРѕР»РЅС‹Р№ СЃР±СЂРѕСЃ РіСЂР°С„РёРєРѕРІ (СѓРЅРёС‡С‚РѕР¶Р°РµРј РёРЅСЃС‚Р°РЅСЃС‹ Chart.js)
  function destroyCharts(){
    if (lineChart){ try{ lineChart.destroy(); }catch(_){} lineChart=null; }
    if (donutChart){ try{ donutChart.destroy(); }catch(_){} donutChart=null; }
    els.donutLegend.innerHTML = '';
  }

  // РџРѕРєР°Р·/СЃРєСЂС‹С‚РёРµ РєР°СЂС‚РѕС‡РµРє СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ
  function showResults(){
    els.afterCalc.classList.remove('hidden');  els.afterCalc.style.display = '';
    els.donutCard.classList.remove('hidden');  els.donutCard.style.display = '';
    els.lineCard.classList.remove('hidden');   els.lineCard.style.display  = '';
  }
  function hideResults(){
    els.afterCalc.classList.add('hidden');  els.afterCalc.style.display='none';
    els.donutCard.classList.add('hidden');  els.donutCard.style.display='none';
    els.lineCard.classList.add('hidden');   els.lineCard.style.display='none';
  }  
  function ensureLine(){
    if (lineChart) return lineChart;
    lineChart = new Chart(els.chart.getContext('2d'), {
      type:'bar',
      data:{ labels:[], datasets:[] },
      options:{
        responsive:true, maintainAspectRatio:false,
        scales:{
          y:  { title:{ display:true, text: T('Amount')  }, ticks:{ callback:v=> moneyStr(v) } },
          y2: { position:'right', grid:{ drawOnChartArea:false }, title:{ display:true, text: T('Balance') }, ticks:{ callback:v=> moneyStr(v) } },
          x:  { ticks:{ maxRotation:0, autoSkip:true, maxTicksLimit:12 } }
        },
        plugins:{
          legend:{ position:'top' },
          tooltip:{ callbacks:{ label:(ctx)=> `${ctx.dataset.label}: ${moneyStr(ctx.parsed.y)}` } }
        }
      }
    });
    return lineChart;
  }
  function ensureDonut(){
    if (donutChart) return donutChart;
    donutChart = new Chart(els.donut.getContext('2d'), {
      type:'doughnut',
      data:{
        labels:[ T('Principal'), T('Interest') ],
        datasets:[{
          data:[0,0],
          backgroundColor:[DONUT_COLORS.principal,DONUT_COLORS.interest],
          hoverBackgroundColor:[DONUT_COLORS.principal,DONUT_COLORS.interest]
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'65%',
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=> `${ctx.label}: ${moneyStr(ctx.parsed)}` } } }
      }
    });
    return donutChart;
  }

  // ================= Schedule / Calc =================
  function addMonths(d,n){ return new Date(d.getFullYear(), d.getMonth()+n, 1); }

  function buildSchedule({ loanAmount, years, annualRate, startMonth }){
    const n=Math.max(1,Math.round(years*12));
    const r=(annualRate/100)/12;
    const schedule=[], labels=[];
    const start=parseMonthInput(startMonth);
    let balance=loanAmount;
    const pow=Math.pow(1+r,n);
    const payment = r>0 ? (loanAmount*r*pow/(pow-1)) : (loanAmount/n);
    let cumulative=0;
    for(let i=0;i<n;i++){
      const date=addMonths(start,i);
      labels.push(date.toLocaleDateString(pageLang, { year:'numeric', month:'short' }));
      const interest=r>0?balance*r:0;
      let principal=payment - interest;
      if(i===n-1) principal=balance;
      const actual=principal+interest;
      balance=Math.max(0,balance-principal);
      cumulative+=actual;
      schedule.push({payment:actual, interest, principal, cumulative, balance});
    }
    const endDate=addMonths(start,n-1);
    return {
      labels, schedule,
      totals:{
        monthly:payment,
        totalPayment:schedule.reduce((s,r)=>s+r.payment,0),
        totalInterest:schedule.reduce((s,r)=>s+r.interest,0),
        payoffDate:endDate
      }
    };
  }

  function buildCopy(schedule, totals, inputs, fees, totalsExtra){
    const lines=[]; const fmt=n=> moneyStr(Math.round(n));
    lines.push(T('Mortgage Calculation'));
    lines.push(`${T('Currency')}: ${currency}`);
    lines.push(`${T('Start')}: ${new Date(inputs.startDate).toLocaleDateString(pageLang,{year:'numeric',month:'long'})}`);
    lines.push(`${T('Rate')}: ${percentParse(inputs.rate).toFixed(2).replace('.',',').replace(/,00$/,'')}%`);
    lines.push(`${T('Property Value')}: ${fmt(inputs.pv)}`);
    lines.push(`${T('Down Payment')}: ${fmt(inputs.dp)}`);
    lines.push(`${T('Loan Amount')}: ${fmt(inputs.la)}`);
    lines.push(`${T('Term')}: ${inputs.years} ${T('years')}`);
    lines.push('');
    lines.push(`${T('Monthly Payment')}: ${fmt(totals.monthly)}`);
    lines.push(`${T('Total paid interest')}: ${fmt(totals.totalInterest)}`);
    lines.push(`${T('Payoff Date')}: ${totals.payoffDate
      .toLocaleDateString(pageLang,{year:'numeric',month:'long'})}`);
    lines.push('');
    const first=schedule[0]||{principal:0,interest:0,payment:0};
    lines.push(T('Payment Breakdown') + ':');
    lines.push(`- ${T('Principal')}: ${fmt(first.principal)}`);
    lines.push(`- ${T('Interest')}: ${fmt(first.interest)}`);
    lines.push(`- ${T('Monthly Payment')}: ${fmt(first.payment)}`);
    lines.push(`- ${T('Loan Amount')}: ${fmt(inputs.la)}`);
    Object.entries(fees).forEach(([k,v])=>{
      if(v>0) lines.push(`- ${T(k)}: ${fmt(v)}`);
    });
    lines.push(`- ${T('Down payment')}: ${fmt(inputs.dp)}`);
    lines.push(`- ${T('Total Extra')}: ${fmt(totalsExtra.totalExtra)}`);
    lines.push(`- ${T('Required Upfront')}: ${fmt(totalsExtra.requiredUpfront)}`);
    lines.push(`- ${T('Total paid interest')}: ${fmt(totals.totalInterest)}`);
    return lines.join('\n');
  }

  function calculate(){
    const pv=parseMoney(els.propertyValue.value);
    const dp=parseMoney(els.downPayment.value);
    let la=parseMoney(els.loanAmount.value);
    if(!la && pv){ la=Math.max(0,pv-dp); els.loanAmount.value=moneyStr(la); }

    const years=parseInt(els.loanDuration.value||'0',10);
    const rate=percentParse(els.interestRate.value);

    let start = els.startMonth.value;
    if (!start || start < CUR_MONTH_STR){
      start = CUR_MONTH_STR;
      els.startMonth.value = start;
      els.startShown.textContent = formatMonthValue(start);
    }

    const { labels, schedule, totals } = buildSchedule({ loanAmount:la, years, annualRate:rate, startMonth:start });

    const round=x=>Math.round(x);
    els.kpiMonthly.textContent     = moneyStr(round(totals.monthly));
    els.kpiTotInterest.textContent = moneyStr(round(totals.totalInterest));
    els.kpiLoan.textContent        = moneyStr(la);
    els.kpiPayoff.textContent      = totals.payoffDate.toLocaleDateString(pageLang,{year:'numeric',month:'long'});
    showResults();

    // Fees
    const fees = {
      Conveyance:                  parseMoney(els.feeConvey.value),
      'Broker Commission':         parseMoney(els.feeBroker.value),
      'Dubai Land Department Fee': parseMoney(els.feeDLD.value),
      'Mortgage Registration':     parseMoney(els.feeReg.value),
      'Mortgage Processing':       parseMoney(els.feeProc.value),
      'Registration Fee':          parseMoney(els.feeAdmin.value),
      Valuation:                   parseMoney(els.feeVal.value),
    };
    const applyVAT = document.getElementById('feeVat')?.checked;
    if (applyVAT) {
      const gross = (x)=> Math.round(x * 1.05);
      fees['Broker Commission'] = gross(fees['Broker Commission']||0);
      fees['Mortgage Processing'] = gross(fees['Mortgage Processing']||0);
      fees['Registration Fee'] = gross(fees['Registration Fee']||0);
      fees['Valuation'] = gross(fees['Valuation']||0);
    }
    const totalExtra = Object.values(fees).reduce((s,v)=> s + (v||0), 0);
    const requiredUpfront = dp + totalExtra;
    const first=schedule[0]||{principal:0,interest:0,payment:0};

    // [+] С„РѕСЂРјР°С‚РёСЂСѓРµРј РїРµСЂРёРѕРґС‹ РґР»СЏ РІС‹РІРѕРґР° РІ Breakdown (С‚РµРєСЃС‚, Р±РµР· РІР°Р»СЋС‚С‹)
    const startDateObj = parseMonthInput(start);
    const startTxt = startDateObj.toLocaleDateString(pageLang, { month:'long', year:'numeric' });
    const endTxt   = totals.payoffDate.toLocaleDateString(pageLang, { month:'long', year:'numeric' });

    const startLabel = formatMonthValue(start);
    const endLabel   = totals.payoffDate.toLocaleDateString(pageLang, { year:'numeric', month:'long' });

    const rows = [
      [ T('Mortgage start period'), startLabel ],
      [ T('Mortgage end period'),   endLabel   ],
      [ T('Principal'),        Math.round(first.principal) ],
      [ T('Interest'),         Math.round(first.interest)  ],
      [ T('Monthly Payment'),  Math.round(first.payment)   ],
      [ T('Loan Amount'),      la ],
      ...Object.entries(fees)
        .filter(([,v])=> v>0)
        .map(([k,v])=> [ T(k), v ]),  
      [ T('Down payment'),        dp ],
      [ T('Total Extra'),         totalExtra ],
      [ T('Required Upfront'),    requiredUpfront ],
      [ T('Total paid interest'), Math.round(totals.totalInterest) ]
    ];

    // [+] РµСЃР»Рё Р·РЅР°С‡РµРЅРёРµ С‡РёСЃР»Рѕ вЂ” С„РѕСЂРјР°С‚ РґРµРЅРµРі; РµСЃР»Рё СЃС‚СЂРѕРєР° вЂ” РѕСЃС‚Р°РІРёС‚СЊ РєР°Рє РµСЃС‚СЊ
    const fmtRowVal = (v)=> (typeof v === 'number' && isFinite(v)) ? moneyStr(v) : String(v);
    els.breakdown.innerHTML = rows
      .map(([k,v])=> `<li><span>${k}</span><strong>${typeof v === 'number' ? moneyStr(v) : v}</strong></li>`)
      .join('');
    attachBreakdownHints();

    // Donut
    const dc = ensureDonut();
    const totalInterest = Math.round(totals.totalInterest);
    dc.data.datasets[0].data = [ la, totalInterest ];
    dc.update();

    // Donut legend + Mortgage Summary
    const totalPayment = Math.round(totals.totalPayment);
    const interestPct  = totalPayment ? (totalInterest / totalPayment * 100) : 0;
    els.donutLegend.innerHTML = `
      <div class="legend-item">
        <span class="legend-dot" style="background:${DONUT_COLORS.principal}"></span>
        <span><b>${T('Principal')}:</b> ${moneyStr(la)}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background:${DONUT_COLORS.interest}"></span>
        <span><b>${T('Interest')} (${interestPct.toFixed(2)}%):</b> ${moneyStr(totalInterest)}</span>
      </div>
    `;
    const monthlyStr = moneyStr(Math.round(totals.monthly)) + (isRU ? '/РјРµСЃ' : '/month');
    const inst = years * 12;

    els.mortgageSummary.innerHTML = `
      <li>${T('Your monthly payment is')} <span id="monthlyText">${monthlyStr}</span></li>
      <li>${T('Total Interest')}: <i>${moneyStr(Math.round(totals.totalInterest))}</i></li>
      <li>${T('Total Payment')} (${moneyStr(Math.round(totals.monthly))} Г— ${inst} ${T('Instalments')}): <i>${moneyStr(Math.round(totals.totalPayment))}</i></li>
    `;
    els.monthlyText = document.getElementById('monthlyText');

    // Line
    const lc = ensureLine();
    lc.data.labels = labels;
    lc.data.datasets = [
      { type:'bar',  label: T('Monthly Payment'),   data: schedule.map(r=>Math.round(r.payment)),    yAxisID:'y'  },
      { type:'line', label: T('Cumulative Paid'),   data: schedule.map(r=>Math.round(r.cumulative)), yAxisID:'y'  },
      { type:'line', label: T('Remaining Balance'), data: schedule.map(r=>Math.round(r.balance)),    yAxisID:'y2' }
    ];
    lc.update();

    // Copy text (РґР»СЏ С€СЌСЂРёРЅРіР°)
    lastCopyText = buildCopy(schedule, totals, {
      pv, dp, la, years, rate: els.interestRate.value, startDate: parseMonthInput(start)
    }, fees, { totalExtra, requiredUpfront });

    hasCalculated=true; enableButtonsMaybe();
    dbg('Calculated', {pv,dp,la,years,rate,totals});
  }

  // ================= Events =================
  document.getElementById('btnCalc').addEventListener('click', calculate);

  function setHintVisible(hint, on){
    if (!hint) return;
    hint.classList.toggle('hidden', !on);      
    hint.classList.toggle('visible', !!on); 
    hint.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  // ===== Hint Manager =====
  const HINT_AUTOHIDE_MS = 5000;
  let currentHint = null;
  const hintTimers = new WeakMap();

  function _setBtnExpanded(hint, on){
    const btn = hint?.parentElement?.querySelector?.('.hintToggle');
    if (btn) btn.setAttribute('aria-expanded', String(!!on));
  }

  function hideHint(hint){
    if (!hint) return;
    try { clearTimeout(hintTimers.get(hint)); } catch(_) {}
    hintTimers.delete(hint);
    setHintVisible(hint, false);
    _setBtnExpanded(hint, false);
    if (currentHint === hint) currentHint = null;
  }

  function scheduleAutohide(hint){
    try { clearTimeout(hintTimers.get(hint)); } catch(_) {}
    const t = setTimeout(()=> hideHint(hint), HINT_AUTOHIDE_MS);
    hintTimers.set(hint, t);
  }

  function openHint(hint){
    if (!hint) return;
    if (currentHint && currentHint !== hint) hideHint(currentHint);
    setHintVisible(hint, true);
    _setBtnExpanded(hint, true);
    currentHint = hint;
    scheduleAutohide(hint);
  }

  function toggleHint(hint){
    if (!hint) return;
    const isOpen = !(hint.classList.contains('hidden') && !hint.classList.contains('visible')) && hint.getAttribute('aria-hidden') !== 'true';
    if (isOpen) hideHint(hint); else openHint(hint);
  }

  // Р—Р°РєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ СЃРЅР°СЂСѓР¶Рё
  document.addEventListener('click', (e)=>{
    if (!currentHint) return;
    const clickedInside = currentHint.contains(e.target) ||
      e.target.closest('.hintToggle') ||
      e.target.closest('.withHint');
    if (!clickedInside) hideHint(currentHint);
  });  

  function initPerFieldHints(){
    const labels = document.querySelectorAll('#formCard label[id]');
    labels.forEach(lbl=>{
      const findHintForLabel = (label)=>{
        let n = label.nextElementSibling;
        while(n){
          if (n.classList && n.classList.contains('hint')) return n;
          n = n.nextElementSibling;
        }
        if (label.id && label.parentElement){
          try{
            const exact = label.parentElement.querySelector(`.hint#${CSS.escape(label.id)}`);
            if (exact) return exact;
          }catch(_){}
        }
        return label.parentElement?.querySelector('.hint') || null;
      };
      const hint = findHintForLabel(lbl);
      if (!hint) return;

      let wrap = lbl.parentElement;
      if (!wrap || !wrap.classList || !wrap.classList.contains('withHint')){
        wrap = document.createElement('div');
        wrap.className = 'withHint';
        lbl.parentNode.insertBefore(wrap, lbl);
        wrap.appendChild(lbl);
        wrap.appendChild(hint);
      } else {
        wrap.classList.add('withHint');
      }

      let btn = wrap.querySelector('button.hintToggle');
      if (!btn){
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hintToggle';
        btn.setAttribute('aria-label', T('Help'));
        btn.setAttribute('aria-expanded','false');
        wrap.appendChild(btn);
      }

      let globalOn = false;
    try { globalOn = localStorage.getItem('mortgageHints') === '1'; } catch (_) {}
      setHintVisible(hint, globalOn);
      btn.setAttribute('aria-expanded', String(globalOn));

      if (!btn._mcBound){
        btn.addEventListener('click', (e)=>{ e.preventDefault(); toggleHint(hint); });
        btn._mcBound = true;
      }

      if (!hint._mcHoverBound){
        hint.addEventListener('mouseenter', ()=> { try{ clearTimeout(hintTimers.get(hint)); }catch(_){ } });
        hint.addEventListener('mouseleave', ()=> scheduleAutohide(hint));
        hint._mcHoverBound = true;
      }

      const icon = lbl.querySelector('i');
      if (icon && !icon._mcBound){
        icon.style.cursor = 'pointer';
        icon.setAttribute('role','button');
        icon.setAttribute('tabindex','0');
        const doToggle = ()=> toggleHint(hint);
        icon.addEventListener('click', doToggle);
        icon.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); doToggle(); }});
        icon._mcBound = true;
      }
    });
  }

  // РіР»РѕР±Р°Р»СЊРЅС‹Р№ С‚СѓРјР±Р»РµСЂ "Show/Hide hints" (id="hintToggle") вЂ” РїРµСЂРµРЅРѕСЃРёС‚СЃСЏ Рє H1
  function setupGlobalHintsToggle(){
    let toggle = document.getElementById('hintToggle');
    if (!toggle){
      toggle = document.createElement('button');
      toggle.type='button';
      toggle.id='hintToggle';
      toggle.className='btn btn-ghost small no-print';
      toggle.textContent = T('Show hints');
    }
    const setHints = (on)=>{
      localStorage.setItem('mortgageHints', on?'1':'0');
      toggle.textContent = on ? T('Hide hints') : T('Show hints');
      document.querySelectorAll('#formCard .hint, #resultCard .hint').forEach(h=> setHintVisible(h, on));
      document.querySelectorAll('#formCard .withHint .hintToggle, #resultCard .withHint .hintToggle').forEach(b=>{
        b.setAttribute('aria-expanded', String(on));
      });
    };
    if (!toggle._mcBound){
      toggle.addEventListener('click', ()=>{
        setHints(!(localStorage.getItem('mortgageHints')==='1'));
      });
      toggle._mcBound = true;
    }
    setHints(localStorage.getItem('mortgageHints')==='1');
    return toggle;
  }

  // ================= WHY DISABLED? =================
  function setupWhyDisabled(){
    let btn = document.getElementById('btnWhyDisabled');
    if (!btn){
      btn = document.createElement('button');
      btn.type='button';
      btn.id='btnWhyDisabled';
      btn.className='btn btn-ghost small no-print';
      btn.textContent = T('Why disabled?');
    }
    if (!btn._mcBound){
      btn.addEventListener('click', ()=>{
        const det = formValidDetails();
        if (det.ok){
          alert(T('Form ok try calc'));
          return;
        }
        alert(T('Please check:') + '\nвЂў ' + det.problems.join('\nвЂў '));
      });
      btn._mcBound = true;
    }
    return btn;
  }

  // ================= Titlebar (РїРµСЂРµРЅРѕСЃ РєРЅРѕРїРѕРє Рє H1) =================
  function ensureTitlebar(){
    const wrap = document.querySelector('.wrap');
    if (!wrap) return null;

    let bar = wrap.querySelector('.titlebar');
    if (!bar){
      // РёС‰РµРј СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РёР№ h1, РЅРµ РїРѕРїР°РґР°СЋС‰РёР№ РїРѕРґ .only-print
      let h1 = Array.from(wrap.querySelectorAll('h1')).find(el => !el.closest('.only-print'));

      if (!h1){
        const grid    = wrap.querySelector('.grid2');
        const printH1 = wrap.querySelector('.only-print h1');
        if (printH1){
          // вњ… РєР»РѕРЅРёСЂСѓРµРј printH1, Р° РЅРµ h1
          h1 = printH1.cloneNode(true);
        } else {
          h1 = document.createElement('h1');
          h1.textContent = 'Mortgage Calculator';
        }
        // СЌС‚РѕС‚ Р·Р°РіРѕР»РѕРІРѕРє РїРѕРєР°Р·С‹РІР°РµРј С‚РѕР»СЊРєРѕ РЅР° СЌРєСЂР°РЅРµ, РЅРµ РІ РїРµС‡Р°С‚Рё
        h1.classList.add('no-print');
        wrap.insertBefore(h1, grid || wrap.firstChild);
      }

      // СЃРѕР·РґР°С‘Рј Р±Р°СЂ Рё РєРѕРЅС‚СЂРѕР»С‹
      bar = document.createElement('div');
      bar.className = 'titlebar';
      const parent = h1.parentNode;
      parent.insertBefore(bar, h1);
      bar.appendChild(h1);

      const ctrls = document.createElement('div');
      ctrls.className = 'titlebar-ctrls';
      bar.appendChild(ctrls);

      const cs = getComputedStyle(h1);
      bar.style.marginTop    = cs.marginTop;
      bar.style.marginBottom = cs.marginBottom;
      h1.style.margin = '0';

      if (!document.getElementById('titlebar-css')){
        const st = document.createElement('style');
        st.id = 'titlebar-css';
        st.textContent = `
          .titlebar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
          .titlebar h1{margin:0}
          .titlebar-ctrls{display:flex;gap:8px;margin-left:auto}
          @media (max-width:640px){
            .titlebar-ctrls{margin-left:0;width:100%;justify-content:flex-start}
          }
        `;
        document.head.appendChild(st);
      }
    }

    // РЅР° СЃР»СѓС‡Р°Р№, РµСЃР»Рё bar РїРѕ РєР°РєРѕР№-С‚Рѕ РїСЂРёС‡РёРЅРµ РЅРµ СЃРѕР·РґР°Р»СЃСЏ
    return bar ? bar.querySelector('.titlebar-ctrls') : null;
  }

  // СЃР±РѕСЂРєР° titlebar Рё РїРµСЂРµРЅРѕСЃ РєРЅРѕРїРѕРє
  (function buildTitlebar(){
    const ctrls = ensureTitlebar(); if(!ctrls) return;

    const btnWhy   = setupWhyDisabled();
    const btnHints = setupGlobalHintsToggle();

    if (btnWhy && btnWhy.parentNode !== ctrls)     ctrls.appendChild(btnWhy);
    if (btnHints && btnHints.parentNode !== ctrls) ctrls.appendChild(btnHints);
  })();

  // РёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ field-level РїРѕРґСЃРєР°Р·РѕРє РїРѕСЃР»Рµ СЃР±РѕСЂРєРё РіР»РѕР±Р°Р»СЊРЅРѕРіРѕ С‚СѓРјР±Р»РµСЂР°
  initPerFieldHints();

  // ================= INIT =================
  hideResults();
  updateRangeLabels();
  updatePvRangeBounds();
  syncPvRangeFromInput();
})();

  // РїРµС‡Р°С‚РЅС‹Рµ РґР°С‚Р°/URL (С‚СЂРµР±СѓРµС‚СЃСЏ <div id="printDate"> Рё <div id="printURL"> РІ С€Р°РїРєРµ РїРµС‡Р°С‚Рё)
  (function(){
    const pageLang = document.documentElement.lang || navigator.language || undefined;

    function setPrintDate(){
      var el = document.getElementById('printDate');
      if (!el) return;

      var d = new Date();
      el.textContent = d.toLocaleDateString(pageLang, {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }
    setPrintDate();

    if (window.matchMedia) {
      var mq = window.matchMedia('print');
      mq.addEventListener?.('change', e => { if (e.matches) setPrintDate(); });
    }
    window.addEventListener?.('beforeprint', setPrintDate);
  })();

  (function(){
    const pageLang = document.documentElement.lang || navigator.language || undefined;
    const dateEl = document.getElementById('printDate');
    const urlEl  = document.getElementById('printURL'); // [+] СЌР»РµРјРµРЅС‚ РґР»СЏ URL

    function setPrintMeta(){
      const d = new Date();
      if (dateEl) {
        dateEl.textContent = d.toLocaleDateString(pageLang, {
          day:'2-digit', month:'2-digit', year:'numeric'
        });
      }
      if (urlEl) {
        urlEl.textContent = window.location.href;
      }
    }
    setPrintMeta();

    if (window.matchMedia){
      const mq = window.matchMedia('print');
      mq.addEventListener?.('change', e => { if (e.matches) setPrintMeta(); });
    }
    window.addEventListener?.('beforeprint', setPrintMeta);
  })();