import {_} from 'Wook_Market/src/lang/i18n';
import {getUser} from 'Wook_Market/src/lib/user';

const ALIPAY_ICON = require('Wook_Market/src/assets/icons/icn_alipay_payement.png');
const BANK_CARD_ICON = require('Wook_Market/src/assets/icons/icn_card_cb_payement.png');
const CASH_ICON = require('Wook_Market/src/assets/icons/icn_cash_payement.png');
const CHECK_ICON = require('Wook_Market/src/assets/icons/icn_check_payment.png');

export const getPurchaseMethods = () => {
  return [
    {name: _('main.delivery'), id: 1},
    {name: _('main.clickAndCollect'), id: 2},
  ];
};



export const getPaymentMethods =  (orderType, role) => {

  console.log(role)
  if(role=="user"){
    return orderType === 'delivery'
    ? [
        //{name: _('main.alipay'), image: ALIPAY_ICON, id: 1},
        {name: _('main.bankCard'), image: BANK_CARD_ICON, id: 2},
      ]
    : [
        //{name: _('main.alipay'), image: ALIPAY_ICON, id: 1},
        {name: _('main.bankCard'), image: BANK_CARD_ICON, id: 2},
        //{name: _('main.cash'), image: CASH_ICON, id: 3},
      ];
  }
  else {
    return [
      {name: _('main.bankCardPro'), image: BANK_CARD_ICON, id: 10},

      {name: _('main.checkPayment'), image: CHECK_ICON, id: 11},

      {name: _('main.cashPro'), image: CASH_ICON, id: 12},
    ]
  }
  
};
