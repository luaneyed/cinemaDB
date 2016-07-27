//console.log("Maybe No Syntax Error");

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

/*
function getTextNode(elem)
{
  return elem.contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE;
          })[0];
}
*/

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
    return str.substring(3, str.length);
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
    return temp.substring(1, temp.length - 1);  //  remove " " , "관"
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
  //console.log("registerOnePlay");
  var newplay = new Object();
  newplay.title = title;
  newplay.age = age;
  newplay.option = option;
  newplay.month = month;
  newplay.day = day;
  newplay.weekday = weekday;
  if(theaterBrand == theaterEnum.lottecinema)
  {
    newplay.theater = "롯데시네마 " + theaterLocation;
    newplay.brand = "lottecinema";
  }
  else if(theaterBrand == theaterEnum.megabox)
  {
    newplay.theater = "메가박스 " + theaterLocation;
    newplay.brand = "megabox";
  }
  else if(theaterBrand == theaterEnum.cgv)
  {

  }
  newplay.place = theaterLocation;
  newplay.startTime = startTime;
  newplay.endTime = endTime;
  newplay.type = type;
  newplay.totalSeat = totalSeat;
  newplay.leftSeat = leftSeat;
  newplay.screen = screen;
  newplay.link = link;
  
  if(output != "")
  {
    output += ",";
    console.log(",");
  }
  else
  {
    output += "[";
    console.log("[");
  }
  output += JSON.stringify(newplay);
  console.log(JSON.stringify(newplay));
  //console.log(JSON.stringify(newplay));
}

function registerLottecinemaDay(theaterLocation, date, table)
{
  //console.log("registerLottecinemaDay");
  var link = "http://www.lottecinema.co.kr/LCHS/Contents/ticketing/ticketing.aspx";
  var month = date.month;
  if(month < 10)
  {
    month = String(month);
    month = "0" + month;
  }
  var day = date.day;
  if(day < 10)
  {
    day = String(day);
    day = "0" + day;
  }
  var weekday = date.weekday;

  var movies = $(table).find($("dl.time_line"));
  movies.each(function(){
    var title = $(this).find($("dt")).contents().filter(function(){
      return this.nodeType == Node.TEXT_NODE;
    })[1].nodeValue;  //  index 0 is emptry string in this case

    while(title.slice(-1) == " ")
      title = title.substring(0, title.length - 1);

    var age = $(this).find($("dt span")).html();

    var options = $(this).find($("dd"));
    options.each(function(){
      var option = "";
      $(this).find("ul.cineD1 li").each(function(){
        option += $(this).html();
      });
      
      while(option.slice(-1) == " ")
        option = option.substring(0, option.length - 1);

      var times = $(this).find($("ul.theater_time li"));
      times.each(function(){
        var screen = $(this).find($("a span.cineD2 em")).html();
        var startTime = $(this).find($("a span.clock")).contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE;
        })[0].nodeValue;
        //console.log("endTime html : " + 
        var endTime = parseTimeSlot($(this).find($("a span.clock span")).html(), theaterEnum.lottecinema);
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
        registerOnePlay(title, age, option, month, day, weekday, theaterEnum.lottecinema, theaterLocation, startTime, endTime, type, totalSeat, leftSeat, screen, link);
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

      registerOnePlay(title, age, option, month, day, weekday, theaterEnum.megabox, theaterLocation, startTime, endTime, type, totalSeat, leftSeat, screen, link);
    });
  });
}

function registerCgvDay(theaterLocation, date, table)
{

}

function registerSchedule(schedule, theaterBrand, theaterLocation, date)
{
  if(theaterBrand == theaterEnum.lottecinema)
  {
    //var date = $(schedule).find($("div.calendar fieldset.month-picker-fieldset"));
    var table = $(schedule).find($("div.time_inner div.time_box div.time_aType"));
    registerLottecinemaDay(theaterLocation, date, table);
  }
  else if(theaterBrand == theaterEnum.megabox)
  {
    var table = $(schedule).find($(".timetable_container .movie_time_table tbody"));
    var dateElem = $(schedule).find($(".date"));
    registerMegaboxDay(theaterLocation, dateElem, table);
  }
  else if(theaterBrand == theaterEnum.cgv)
  {

  }
}

function doUpdate()
{
  //console.log("No Syntax Error Before doUpdate()");
  pages.forEach(function(p){
    document.documentElement.innerHTML = p.html;
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
    registerSchedule(schedule, p.theaterBrand, p.theaterLocation, p.date);
  });

  output += "]";
  console.log("]^");
  //console.log(output);
}

function registerTable(theaterBrand, theaterLocation, date, html)
{
  //console.log("registerTable");
  var newpage = new Object(); 
  newpage.theaterBrand = theaterBrand;
  newpage.theaterLocation = theaterLocation;
  newpage.date = date;
  newpage.html = html;
  pages.push(newpage);
}

//casper.start("http://www.naver.com/");
casper.start("http://www.megabox.co.kr/?menuId=theater-detail&region=45&cinema=3021");
//casper.start("http://www.lottecinema.co.kr/LCHS/Contents/Cinema/Cinema-Detail.aspx?divisionCode=1&detailDivisionCode=3&cinemaID=4006");
casper.then(function() {
  //console.log("opened Megabox");

  
  do {
    registerTable(theaterEnum.megabox, "대전", null, this.evaluate(function(){
      return document.documentElement.innerHTML;
    }));
    this.evaluate(function(){
      $("#theaterSchedule div.movie_time_header div.calendar div.date_wrap button.date_next").click();
    });
  }
  while(this.evaluate(function(){return $("#theaterSchedule div.timetable_container table.movie_time_table tbody").length;}) > 0)
  
});

casper.thenOpen('http://www.lottecinema.co.kr/LCHS/Contents/Cinema/Cinema-Detail.aspx?divisionCode=1&detailDivisionCode=3&cinemaID=4002', function() {
//casper.then(function() {
  this.waitFor(function check() {
    return this.evaluate(function(){ return (document.querySelectorAll('label.month-picker-label').length > 0); });
      //&& (document.querySelectorAll('div.time_aType').length > 0); });
  }, function then(){
    //console.log("opened Lottecinema");
    var month = Number(this.evaluate(function(){
      return $("#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset span.month:first-of-type em").html();}));
    var yesterday = 0;
    var dates = this.evaluate(function(){
      var ret = new Array();
      $("#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset div.calendarArea label.month-picker-label").each(function(){
        var o = new Object();
        if($(this).hasClass("noDate") == false)
          o.noDate = false;
        else
          o.noDate = true;
        ret.push(o);
      });
      return ret;
    });
 
    var order = 0;
    dates.forEach(function(val, n){
      casper.waitFor(function check() {
        return (order == n);
      }, function then(){
        var labelstr = "#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset div.calendarArea label.month-picker-label:nth-of-type(" + (n + 1) + ")";
            var day = casper.evaluate(function(labelstr){return $(labelstr).find($("em")).html();}, labelstr);
            if((day == 1) && (yesterday > 25))
            {
              month ++;
              if(month == 13)
                month = 1;
            }
            //console.log("day : " + day);
            yesterday = day;       
        
        if(val.noDate == false)
        {
          casper.evaluate(function(labelstr){$(labelstr).mousedown();}, labelstr);

          casper.waitFor(function check() {
            return casper.evaluate(function(){ return (document.querySelectorAll('div.d_loading').length == 0); });
          }, function then(){

            
            if(casper.evaluate(function(){return ($("div.time_inner div.time_box div.time_aType").length > 0);}))
            {
              var weekday = casper.evaluate(function(labelstr){return $(labelstr).find($("span")).html();}, labelstr);

              var date = new Object();
              date.month = month;
              date.day = day;
              date.weekday = weekday;

              
              registerTable(theaterEnum.lottecinema, "대전(백화점)", date, casper.evaluate(function(){
                return document.documentElement.innerHTML;
              }));
              
            }
            order ++;
          });
        }
        else
          order ++;
      });
    });
    /*
    casper.waitFor(function check() {
        return (order == dates.length);
    }, function then(){
      doUpdate();
    });
  */
  });
});

casper.thenOpen('http://www.lottecinema.co.kr/LCHS/Contents/Cinema/Cinema-Detail.aspx?divisionCode=1&detailDivisionCode=3&cinemaID=4006', function() {
//casper.then(function() {
  this.waitFor(function check() {
    return this.evaluate(function(){ return (document.querySelectorAll('label.month-picker-label').length > 0); });
      //&& (document.querySelectorAll('div.time_aType').length > 0); });
  }, function then(){
    //console.log("opened Lottecinema");
    var month = Number(this.evaluate(function(){
      return $("#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset span.month:first-of-type em").html();}));
    var yesterday = 0;
    var dates = this.evaluate(function(){
      var ret = new Array();
      $("#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset div.calendarArea label.month-picker-label").each(function(){
        var o = new Object();
        if($(this).hasClass("noDate") == false)
          o.noDate = false;
        else
          o.noDate = true;
        ret.push(o);
      });
      return ret;
    });
 
    var order = 0;
    dates.forEach(function(val, n){
      casper.waitFor(function check() {
        return (order == n);
      }, function then(){
        var labelstr = "#a_cont_cinema div.cont_cinema_Area div.calendar fieldset.month-picker-fieldset div.calendarArea label.month-picker-label:nth-of-type(" + (n + 1) + ")";
            var day = casper.evaluate(function(labelstr){return $(labelstr).find($("em")).html();}, labelstr);
            if((day == 1) && (yesterday > 25))
            {
              month ++;
              if(month == 13)
                month = 1;
            }
            //console.log("day : " + day);
            yesterday = day;       
        
        if(val.noDate == false)
        {
          casper.evaluate(function(labelstr){$(labelstr).mousedown();}, labelstr);

          casper.waitFor(function check() {
            return casper.evaluate(function(){ return (document.querySelectorAll('div.d_loading').length == 0); });
          }, function then(){

            
            if(casper.evaluate(function(){return ($("div.time_inner div.time_box div.time_aType").length > 0);}))
            {
              var weekday = casper.evaluate(function(labelstr){return $(labelstr).find($("span")).html();}, labelstr);

              var date = new Object();
              date.month = month;
              date.day = day;
              date.weekday = weekday;

              
              registerTable(theaterEnum.lottecinema, "대전둔산(월평동)", date, casper.evaluate(function(){
                return document.documentElement.innerHTML;
              }));
              
            }
            order ++;
          });
        }
        else
          order ++;
      });
    });
    casper.waitFor(function check() {
        return (order == dates.length);
    }, function then(){
      doUpdate();
    });
  
  });
});


casper.run();
