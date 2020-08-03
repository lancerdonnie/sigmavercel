var elasticemail = require('elasticemail');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function checkDb(bet) {
  const date = new Date().toDateString().split(' ').join('');
  fetch('https://sigma-8639.restdb.io/rest/sigma?q={"date":"' + date + '"}', {
    headers: { 'x-apikey': '5f25f69367e4950327927bd7' },
  })
    .then((e) => e.json())
    .then((e) => {
      if (!e.length) {
        postDb(bet);
      }
    });
}

function postDb(bet) {
  const date = new Date().toDateString().split(' ').join('');
  fetch('https://sigma-8639.restdb.io/rest/sigma', {
    method: 'POST',
    headers: {
      'x-apikey': '5f25f69367e4950327927bd7',
      Accept: 'application/json',
      'cache-control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
    json: true,
  })
    .then((e) => e.json())
    .then((e) => {
      if (!e.length) {
        sendMail(bet);
      }
    });
}

async function sendMail(bet = 'shite test') {
  console.log('This is a test');

  var client = elasticemail.createClient({
    username: 'jideadedejifirst@gmail.com',
    apiKey:
      '1685DEAC1BD9EED9EE8AB5DAC458B8F41A7F870794B089BC892E46B6430924C26EF2FEC8D5F111436936F9674EBD2063',
  });

  var msg = {
    from: 'jideadedejifirst@gmail.com',
    from_name: 'Sigma',
    to: 'jideadedejifirst@gmail.com',
    subject: 'Todays Sigma',
    body_text: bet,
  };

  client.mailer.send(msg, function (err, result) {
    if (err) {
      return console.error(err);
    }
    console.log(result);
  });
}

function handleDOM(dom) {
  const x = dom.window.document.getElementsByClassName('post-date');
  const today = new Date().getDate().toString();
  const date = Array.from(x).find((e) => {
    console.log(e.textContent);
    return e.textContent.split(' ')[1].split(',')[0] === today;
  }).innerHTML;
  if (date) {
    let bet = x[0]
      .closest('.post-content')
      .querySelector('.entry')
      .children[0].innerHTML.toString();
    bet = bet.split('&nbsp;').join('');
    if (bet) {
      checkDb(bet);
    }
  }
}

module.exports = (req, res) => {
  JSDOM.fromURL('https://sigma1x2.com/')
    .then(handleDOM)
    .catch((err) => {
      console.warn('Something went wrong.', err);
    });
  res.send('okay');
};
