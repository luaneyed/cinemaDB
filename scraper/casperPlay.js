var $ = require('jquery');
var casper = require('casper').create();

var pages = new Array();

var output = "";

var moviesByTitle = new Array();
var theaterEnum = {
  lottecinema: 1,
  megabox: 2,
  cgv: 3
}
var NUM_THEATER = Object.keys(theaterEnum).length;
var NUM_LEFT_PAGE = 1;

function didTheater()
{
  NUM_THEATER --;
  if(NUM_THEATER == 0)
    phantom.exit();
}

function removeSpace(str)
{
  return str.split(" ").join("");
}

function areSameString(str1, str2)
{
  return removeSpace(str1)==removeSpace(str2)
}

function searchMovie(title)
{
  for (var movie in moviesByTitle){
    if(areSameString(movie.title, title))
      return movie;
  }
  return null;
}

function getTextNode(elem)
{
  return elem.contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE;
          })[0];
}

function parseDate(str, theater)
{
  if(theater == theaterEnum.lottecinema)
  {

  }
  else if(theater == theaterEnum.megabox)
  {
    return str.split(".").join(" ").split(" ");
  }
  else if(theater == theaterEnum.cgv)
  {

  }
}

function parseTimeSlot(str, theater)
{
  if(theater == theaterEnum.lottecinema)  //  only for endTime
    return str.substring(3, str.length - 1);
  else if(theater == theaterEnum.megabox)
    return str.split("~");
  else if(theater == theaterEnum.cgv)
  {

  }
}

function parseSeat(str, theater)
{
  if(theater == theaterEnum.lottecinema)  //  only for totalSeat
  {
    var temp = str.split("/")[1];
    return temp.substring(1, temp.length - 2);  //  remove " " , "관"
  }
  else if(theater == theaterEnum.megabox)
  {
    return str.split("/");
  }
  else if(theater == theaterEnum.cgv)
  {

  }
}

//  제목, 관람가, 종류(디지털, 더빙, 자막, SCREENX, 2D, 3D 등), 월, 일, 요일, 영화관 종류, 영화관 위치,
//  시작시간, 끝시간, null or 조조 or 심야(예매마감이면 무조건 null), 전체 좌석 수(예매마감일때 0), 남은 좌석 수, 상영관(1관, 2관 등), 예매 link
function registerOnePlay(title, age, option, month, day, weekday, theaterBrand, theaterLocation, startTime, endTime, type, totalSeat, leftSeat, screen, link)
{
  var newplay = new Object();
  newplay.title = title;
  newplay.age = age;
  newplay.option = option;
  newplay.month = month;
  newplay.day = day;
  newplay.weekday = weekday;
  if(theaterBrand == theaterEnum.lottecinema)
  {

  }
  else if(theaterBrand == theaterEnum.megabox)
  {
    newplay.theater = "메가박스 " + theaterLocation;
    newplay.brand = "megabox";
    newplay.place = theaterLocation;
  }
  else if(theaterBrand == theaterEnum.cgv)
  {

  }
  newplay.startTime = startTime;
  newplay.endTime = endTime;
  newplay.type = type;
  newplay.totalSeat = totalSeat;
  newplay.leftSeat = leftSeat;
  newplay.screen = screen;
  newplay.link = link;
  
  if(output != "")
    output += ",";
  else
    output += "[";
  output += JSON.stringify(newplay);
  //console.log(JSON.stringify(newplay));
}

function registerLottecinemaDay(table, date)
{
  var link = "http://www.lottecinema.co.kr/LCHS/Contents/ticketing/ticketing.aspx";
  // parse date
  var movies = $(table).find($("dl.time_line"));
  movies.each(function(){
    var title = $(this).find($("dt")).contents().filter(function(){
      return this.nodeType == Node.TEXT_NODE;
    })[0].nodeValue;
    var age = $(this).find($("dt span")).html();

    var options = $(this).find($("dd"));
    options.each(function(){
      var option = "";
      $(this).find("ul.cineD1 li").each(function(){
        option += $(this).html();
      });

      var times = $(this).find($("ul.theater_time li"));
      times.each(function(){
        var screen = $(this).find($("a span.cineD2 em")).html();
        var startTime = $(this).find($("a span.clock")).getTextNode();
        var endTime = parseTimeSlot($(this).find($("a span.clock span")).html());

        var type;
        var totalSeat, leftSeat;
        if($(this).hasClass("soldout"))
        {
          type = "";
          totalSeat = 0;
          leftSeat = 0;
        }
        else
        {
          if($(this).find($("a span.clock em.seat")).length > 0)
            type = $(this).find($("a span.clock em.seat")).html();
          else
            type = "";
          leftSeat = $(this).find($("a span.ppNum em")).html();
          totalSeat = parseSeat($(this).find($("a span.ppNum")).contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE;
          })[0].nodeValue, theaterEnum.lottecinema);
        }
      });
    });
  });
}

function registerMegaboxDay(theaterLocation, date, table)
{

  var link = "http://www.megabox.co.kr/";
  var curTitle = "";
  var curAge = "";
  var dateinfo = parseDate(date.text(), theaterEnum.megabox);
  var month = dateinfo[0];
  var day = dateinfo[1];
  var weekday = dateinfo[2];
  var rows = $(table).find($("tr"));
  rows.each(function(n, row){
    var th1 = $(this).find($("th.title div"));
    var age = $(th1).find($("span")).html();
    var title = $(th1).find($("strong")).html();
    if(title == "&nbsp;")
    {
      title = curTitle;
      age = curAge;
    }
    else
    {
      curTitle = title;
      curAge = age;
    }
    var th2 = $(this).find($("th.room"));
    var screen = $(th2).find($("div")).html();
    var option = $(th2).find($("small")).html();

    var times = $(this).find($("td div.cinema_time"));
    times.each(function(){
      var StartEndTime = parseTimeSlot($(this).find($("span.hover_time")).html(), theaterEnum.megabox);
      var startTime = StartEndTime[0];
      var endTime = StartEndTime[1];
      var type;
      var totalSeat, leftSeat;
      if($(this).hasClass("done"))
      {
        type = "";
        totalSeat = 0;
        leftSeat = 0;
      }
      else
      {
        type = $(this).find($("p span.type")).html();
        var seat = parseSeat($(this).find($("p span.seat")).html(), theaterEnum.megabox);
        totalSeat = seat[1];
        leftSeat = seat[0];
      }

      registerOnePlay(title, age, option, month, day, weekday, theaterEnum.megabox, theaterLocation, startTime, endTime, type, totalSeat, leftSeat, screen, link)
    });
  });
}

function registerCgvDay(table, date)
{

}

function registerSchedule(schedule, theaterBrand, theaterLocation)
{
  if(theaterBrand == theaterEnum.lottecinema)
  {
    var date = $(schedule).find($("div.calendar fieldset.month-picker-fieldset"));
    var table = $(schedule).find($("div.time_inner div.time_box div.time_aType"));
    registerLottecinemaDay(theaterLocation, date, table);
  }
  else if(theaterBrand == theaterEnum.megabox)
  {
    var table = $(schedule).find($(".timetable_container .movie_time_table tbody"));
    var date = $(schedule).find($(".date"));
    registerMegaboxDay(theaterLocation, date, table);
  }
  else if(theaterBrand == theaterEnum.cgv)
  {

  }
}

function doUpdate()
{
  pages.forEach(function(p){
    document.documentElement.innerHTML = p.html;
    //phantom.exit();
    var schedule;
    switch(p.theaterBrand)
    {
      case theaterEnum.lottecinema:
        schedule = $("#a_cont_cinema div.cont_cinema_Area");
        break;
      case theaterEnum.megabox:
        schedule = $("#theaterSchedule");
        break;
      case theaterEnum.cgv:
        break;
    }
    registerSchedule(schedule, p.theaterBrand, p.theaterLocation);
  });

  output += "]";
  console.log(output);
}

function registerTable(theaterBrand, theaterLocation, html)
{
  var newpage = new Object(); 
  newpage.theaterBrand = theaterBrand;
  newpage.theaterLocation = theaterLocation;
  newpage.html = html;
  pages.push(newpage);
/*
  NUM_LEFT_PAGE --;
  if(NUM_LEFT_PAGE == 0)
    doUpdate();
    */
}

casper.start("http://www.megabox.co.kr/?menuId=theater-detail&region=45&cinema=3021");

casper.then(function() {
  do {
    registerTable(theaterEnum.megabox, "대전", this.evaluate(function(){
      return document.documentElement.innerHTML;
    }));
    this.evaluate(function(){
      $("#theaterSchedule div.movie_time_header div.calendar div.date_wrap button.date_next").click();
    });
  }
  while(this.evaluate(function(){return $("#theaterSchedule div.timetable_container table.movie_time_table tbody").length;}) > 0)
  
  //doUpdate();
});

casper.thenOpen('http://www.lottecinema.co.kr/LCHS/Contents/Cinema/Cinema-Detail.aspx?divisionCode=1&detailDivisionCode=3&cinemaID=4002', function() {
  do {
    if(this.evaluate(function(){return $("#a_cont_cinema div.time_inner div.time_noData").css('display');}) == 'none')  //  if timetable exists
    {
      registerTable(theaterEnum.lottecinema, "대전(백화점)", this.evaluate(function(){
        return document.documentElement.innerHTML;
      }));
    }
    // click next-day button
  } while(false)

  doUpdate();
});

casper.run();
