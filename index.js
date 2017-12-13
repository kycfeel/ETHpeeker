const TelegramBot = require('node-telegram-bot-api');
const tokendata = require('./private/token.js');

const token = tokendata.bot;
const bot = new TelegramBot(token, {polling: true});

const request = require('request');

let secTrigger;
let pushInterval;

bot.onText(/\/start/, (msg) => {

bot.sendMessage(msg.chat.id, "빗썸의 실시간 이더리움 시세를 확인할 수 있습니다. 아래 버튼을 눌러주세요. \n\n주의 : 개발자와 애플리케이션은 빗썸과 완전히 무관하며, 애플리케이션 사용으로 발생한 모든 형태의 피해는 사용자에게 있습니다.", {
"reply_markup": {
    "keyboard": [['이더리움(ETH) 시세 확인'],['반복 시세 알리미', '정지']],
    }
  });
});

bot.on('message', (msg) => {

  if (msg.text === 'ping') {
    bot.sendMessage(msg.chat.id, "pong");
  }

  else if (msg.text === '이더리움(ETH) 시세 확인') {

    console.log("Telegram Chat ID : " + msg.chat.id);

    request({
      url: 'https://api.bithumb.com/public/ticker/eth',
    }, (err, res, html) => {
      if (err) {
        console.log(err);
        return;
      }
      let parseRes = JSON.parse(html);
      console.log(html);
      if (parseRes.status === 5600) {
        bot.sendMessage(msg.chat.id, "현재 빗썸 API 서비스가 점검중입니다. 다음에 다시 시도해 주세요.");
        return;
      }
      else {
      bot.sendMessage(msg.chat.id, "*🤑 " + numComma(parseRes.data.closing_price) + " KRW 🤑* ```\n\n순가격 : "+  numComma(parseRes.data.opening_price) + " KRW\n평균가 : " + numComma(parseRes.data.average_price) + " KRW\n구매가 : " + numComma(parseRes.data.buy_price) + " KRW\n판매가 : " + numComma(parseRes.data.sell_price) + " KRW``` \n[빗썸 바로가기](https://www.bithumb.com)", {parse_mode : "MarkDown"});
    }
  })
}
else if (msg.text === '반복 시세 알리미') {
  console.log("Telegram Chat ID : " + msg.chat.id);
  secTrigger = 1;

  bot.sendMessage(msg.chat.id, "5초 간격으로 실시간 이더리움 시세를 알려줍니다. \n\n정지를 누르면 알림을 멈출 수 있습니다.");

pushInterval = setInterval(()=> {
    request({
      url: 'https://api.bithumb.com/public/ticker/eth',
    }, (err, res, html) => {
      if (err) {
        console.log(err);
        return;
      }
      let parseRes = JSON.parse(html);
      console.log(html);
      if (parseRes.status === 5600) {
        bot.sendMessage(msg.chat.id, "현재 빗썸 API 서비스가 점검중입니다. 5초 후 다시 시도합니다.");
        return;
      }
      else {
        bot.sendMessage(msg.chat.id, "*🤑 " + numComma(parseRes.data.closing_price) + " KRW 🤑* ```\n\n순가격 : "+  numComma(parseRes.data.opening_price) + " KRW\n평균가 : " + numComma(parseRes.data.average_price) + " KRW\n구매가 : " + numComma(parseRes.data.buy_price) + " KRW\n판매가 : " + numComma(parseRes.data.sell_price) + " KRW``` \n[빗썸 바로가기](https://www.bithumb.com)", {parse_mode : "MarkDown"});
      }
    })
  }, 5000);
}

else if (msg.text === '정지') {
  if (secTrigger) {
    clearInterval(pushInterval);
    secTrigger = 0;
    bot.sendMessage(msg.chat.id, "반복 시세 알리미가 정지되었습니다.");
  }
  else {
    bot.sendMessage(msg.chat.id, "아직 알리미 기능을 사용하고 있지 않습니다.");
    }
  }
});

function numComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
