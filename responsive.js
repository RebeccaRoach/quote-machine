let quotesDataParsed;

function inIframe () {
return false;
}

// { try { return window.self !== window.top; } catch (e) { return true; } }

var currentQuote = '', currentAuthor = '';

function openURL(url){
  window.open(url);
}

//Get usuable data from source JSON; assign to quotesDataParsed
function getQuotes() {
  return $.ajax({
    headers: {
      accept: "application/json"
    },
    url:          'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
    success: function(jsonQuotes) {
      if (typeof jsonQuotes === 'string') {
        quotesDataParsed = JSON.parse(jsonQuotes);
      }
    }
  });
}

//Get random quote from quotesDataParsed
function getRandomQuote() {
  return quotesDataParsed.quotes[Math.floor(Math.random() * quotesDataParsed.quotes.length)];
}

//Get relevant quote info from selected random quote; display in html elements
function getQuote() {

  let randomQuote = getRandomQuote();
  
  currentQuote = randomQuote.quote;
  currentAuthor = randomQuote.author;
  
  //set href attribute for tweeting selected quote
  if(inIframe()){
    $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotable&text=' + encodeURIComponent('"' + currentQuote + '" --' + currentAuthor));
  }
  
  //display current quote in #text element of .quote-text div
  $(".quote-text").animate(
    { opacity: 0.2 },
    500,
    function() {
      $(this).animate({ opacity: 0.7 }, 500);
      $('#text').text(currentQuote);
    }
  );

   //display current author in #author element of .quote-author div
  $(".quote-author").animate(
    { opacity: 0.2 },
    500,
    function() {
      $(this).animate({ opacity: 0.7}, 500);
      $('#author').html(currentAuthor);
    }
  );
}

//When page is ready, get JSON quotes then display first quote
$(document).ready(function() {
  getQuotes().then(() => {
    getQuote();
  });
  
  //when user clicks on #new-quote button, trigger getQuote()
 $('#new-quote').on('click', getQuote);
  
  //when user clicks tweet button, trigger openURL() with text content populated as encoded URI string
  $('#tweet-quote').on('click', function() {
    if(!inIframe()) {
      openURL('https://twitter.com/intent/tweet?hashtags=quotable&text=' + encodeURIComponent('"' + currentQuote + '" --' + currentAuthor));
    }
  });
});