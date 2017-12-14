const TelegramBot = require('node-telegram-bot-api');
const tokendata = require('./private/token.js');

const token = tokendata.bot;

const bot = new TelegramBot(token, {polling: true});

const request = require('request');

let secTrigger;
let pushInterval;

bot.onText(/\/start/, (msg) => {

bot.sendMessage(msg.chat.id, "빗썸의 실시간 가상화폐 시세를 확인할 수 있습니다. 아래 버튼을 눌러주세요.```\n\n⚠️ 개발자와 애플리케이션은 빗썸과 완전히 무관하며, 애플리케이션 사용으로 발생한 모든 형태의 피해는 사용자에게 있습니다. 종종 유지보수 또는 개인 서버의 문제로 서비스가 중단되거나 느려질 수 있습니다. 너그럽게 이해해 주세요! ⚠️```", {
"reply_markup": {
    "keyboard": [['/ETH'],['/BTC'], ['/XRP']],
  },
parse_mode : "MarkDown",
  });
});

bot.onText(/\/ETH/, (msg) => {

bot.sendMessage(msg.chat.id, "💰 이더리움(ETH) 메뉴입니다. 아래 버튼을 눌러주세요.💰```\n\n'/start' 버튼을 누르면 초기 화면으로 돌아갑니다.```", {
"reply_markup": {
    "keyboard": [['이더리움(ETH) 시세 확인'],/*['ETH 반복 시세 알리미', '정지'],*/ ['/start']],
  },
parse_mode : "MarkDown",
  });
});

bot.onText(/\/BTC/, (msg) => {

bot.sendMessage(msg.chat.id, "💰 비트코인(BTC) 메뉴입니다. 아래 버튼을 눌러주세요.💰```\n\n'/start' 버튼을 누르면 초기 화면으로 돌아갑니다.```", {
"reply_markup": {
    "keyboard": [['비트코인(BTC) 시세 확인'],/*['BTC 반복 시세 알리미', '정지'],*/ ['/start']],
  },
parse_mode : "MarkDown",
  });
});

bot.onText(/\/XRP/, (msg) => {

bot.sendMessage(msg.chat.id, "💰 리플(XRP) 메뉴입니다. 아래 버튼을 눌러주세요.💰```\n\n'/start' 버튼을 누르면 초기 화면으로 돌아갑니다.```", {
"reply_markup": {
    "keyboard": [['리플(XRP) 시세 확인'],/*['XRP 반복 시세 알리미', '정지'],*/ ['/start']],
    },
parse_mode : "MarkDown",
  });
});

call = (type, msg) => {
  request({
    url: 'https://api.bithumb.com/public/ticker/' + type,
  }, (err, res, html) => {
    if (err) {
      console.log(err);
      return;
    }
    let parseRes = JSON.parse(html);
    console.log(html);
    if (parseRes.status == 0000) {
      bot.sendMessage(msg.chat.id, "*🤑 " + numComma(parseRes.data.closing_price) + " KRW 🤑* ```\n\n순가격 : "+  numComma(parseRes.data.opening_price) + " KRW\n평균가 : " + numComma(parseRes.data.average_price) + " KRW\n구매가 : " + numComma(parseRes.data.buy_price) + " KRW\n판매가 : " + numComma(parseRes.data.sell_price) + " KRW``` \n[빗썸 바로가기](https://www.bithumb.com)", {parse_mode : "MarkDown"});
      return;
    }
    else {
      bot.sendMessage(msg.chat.id, "😵 현재 빗썸 API 서비스를 사용할 수 없습니다. 다음에 다시 시도해 주세요.😵");
    }
  })
}

repeatCall = (type, msg) => {
  secTrigger = 1;

pushInterval = setInterval(()=> {
    request({
      url: 'https://api.bithumb.com/public/ticker/' + type,
    }, (err, res, html) => {
      if (err) {
        console.log(err);
        return;
      }
      let parseRes = JSON.parse(html);
      console.log(html);
      if (parseRes.status == 0000) {
        bot.sendMessage(msg.chat.id, "*⏳ " + numComma(parseRes.data.closing_price) + " KRW ⏳* ```\n\n순가격 : "+  numComma(parseRes.data.opening_price) + " KRW\n평균가 : " + numComma(parseRes.data.average_price) + " KRW\n구매가 : " + numComma(parseRes.data.buy_price) + " KRW\n판매가 : " + numComma(parseRes.data.sell_price) + " KRW``` \n[빗썸 바로가기](https://www.bithumb.com)", {parse_mode : "MarkDown"});
        return;
      }
      else {
        bot.sendMessage(msg.chat.id, "😵 현재 빗썸 API 서비스를 사용할 수 없습니다. 5초 후 다시 시도합니다.😵");
      }
    })
  }, 30000);
}

bot.on('message', (msg) => {

  if (msg.text === 'ping') {
    bot.sendMessage(msg.chat.id, "pong");
  }

  else if (msg.text === '이더리움(ETH) 시세 확인') {
    console.log("Telegram Chat ID : " + msg.chat.id + " called ETH currency");
    call('eth',msg);
  }

  else if (msg.text === 'ETH 반복 시세 알리미') {
    console.log("Telegram Chat ID : " + msg.chat.id + " is now using ETH 반복 시세 알리미!");
    bot.sendMessage(msg.chat.id, "30초 간격으로 실시간 이더리움 시세를 알려줍니다.\n\n정지를 누르면 알림을 멈출 수 있습니다. ```\n\n⚠️ 종종 '정지' 버튼을 눌러도 알리미가 멈추지 않는 문제가 발생할 수 있습니다. 이럴 경우 임시로 봇을 차단한 후 다시 추가해 주세요.⚠️```", {parse_mode : "MarkDown"});
    repeatCall('eth', msg);
  }

  else if (msg.text === '비트코인(BTC) 시세 확인') {
    console.log("Telegram Chat ID : " + msg.chat.id + " called BTC currency");
    call('btc', msg);
  }

  else if (msg.text === 'BTC 반복 시세 알리미') {
    console.log("Telegram Chat ID : " + msg.chat.id + " is now using BTC 반복 시세 알리미!");
    bot.sendMessage(msg.chat.id, "30초 간격으로 실시간 비트코인 시세를 알려줍니다.\n\n정지를 누르면 알림을 멈출 수 있습니다. ```\n\n⚠️ 종종 '정지' 버튼을 눌러도 알리미가 멈추지 않는 문제가 발생할 수 있습니다. 이럴 경우 임시로 봇을 차단한 후 나중에 다시 추가해 주세요.⚠️```", {parse_mode : "MarkDown"});
    repeatCall('btc', msg);
  }

  else if (msg.text === '리플(XRP) 시세 확인') {
    console.log("Telegram Chat ID : " + msg.chat.id + " called XRP currency");
    call('xrp', msg);
  }

  else if (msg.text === 'XRP 반복 시세 알리미') {
    console.log("Telegram Chat ID : " + msg.chat.id + " is now using XRP 반복 시세 알리미!");
    bot.sendMessage(msg.chat.id, "30초 간격으로 실시간 리플 시세를 알려줍니다.\n\n정지를 누르면 알림을 멈출 수 있습니다. ```\n\n⚠️ 종종 '정지' 버튼을 눌러도 알리미가 멈추지 않는 문제가 발생할 수 있습니다. 이럴 경우 임시로 봇을 차단한 후 다시 추가해 주세요.⚠️```", {parse_mode : "MarkDown"});
    repeatCall('xrp', msg);
  }

  else if (msg.text === '정지') {
    console.log(msg.chat.id + ' STOPPED to use 반복 시세 알리미!');
    if (secTrigger) {
      secTrigger = 0;
      bot.sendMessage(msg.chat.id, "⌛ 반복 시세 알리미가 정지되었습니다.⌛");
      clearInterval(pushInterval);
    }
    else {
      bot.sendMessage(msg.chat.id, "🤔 아직 알리미 기능을 사용하고 있지 않습니다.🤔");
      clearInterval(pushInterval);
      }
    }
});

function numComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
