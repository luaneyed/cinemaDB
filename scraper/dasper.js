console.log("Maybe No Syntax Error");

var $ = require('jquery');
var casper = require('casper').create();

//casper.start("http://www.naver.com/");
casper.start("http://www.megabox.co.kr/?menuId=theater-detail&region=45&cinema=3021");

casper.then(function() {
  console.log("opened Megabox");

  /*
  do {
    registerTable(theaterEnum.megabox, "대전", null, this.evaluate(function(){
      return document.documentElement.innerHTML;
    }));
    this.evaluate(function(){
      $("#theaterSchedule div.movie_time_header div.calendar div.date_wrap button.date_next").click();
    });
  }
  while(this.evaluate(function(){return $("#theaterSchedule div.timetable_container table.movie_time_table tbody").length;}) > 0)
  */
});

casper.thenOpen('http://www.lottecinema.co.kr/LCHS/Contents/Cinema/Cinema-Detail.aspx?divisionCode=1&detailDivisionCode=3&cinemaID=4002', function() {
  console.log("opened lottecinema");
    });

casper.run();
