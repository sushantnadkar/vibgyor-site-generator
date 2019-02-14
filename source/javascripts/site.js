function loadJSON(url, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', url, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}

var url = 'data/data.js';//'https://sushantnadkar.github.io/vibgyoraws/data/data.js';

window.onload = loadJSON(url, function(r){
  var ar = JSON.parse(r);
  for(i = 0; i < ar.flagshipevents.length; i++) {
    //home page events
    if($("#flagship-events .row").length !== 0) {
      $("#flagship-events .row").append(
        '<div class="col-xs-12 col-md-6">' +
        '<div style="background-image:url( '+ ar.flagshipevents[i].image +' )">' +
        '<h4>' + ar.flagshipevents[i].name + '</h4>' +
        '</div></div>'
      );
    }
    //events page
    if($("#e-page").length !== 0) {
      $("#e-page").append(
        '<div class="row event">' +
          '<div class="col-xs-12 col-md-6">' +
              '<div class="row event-img" style="background-image:url(' + ar.events[i].image + ')">' +
              '</div>' +
          '</div>' +
          '<div class="col-xs-12 col-md-6">' +
            '<div class="row event-desc">' +
                '<div class="col-xs-12 col-md-12"><h5>' + ar.events[i].name + '</h5></div>' +
                '<div id="' + ar.events[i].id + '" class="collapse text col-xs-12 col-md-12" aria-expanded="false">' + ar.events[i].description + '</div>' +
                '<a role="button" class="collapsed" data-toggle="collapse" href="#' + ar.events[i].id + '" aria-expanded="false" aria-controls="' + ar.events[i].id + '"></a>' +
                '<div class="col-xs-12 col-md-12"></br><strong>Where: </strong>' + ar.events[i].when + '</div>' +
                '<div class="col-xs-12 col-md-12"></br><strong>When: </strong>' + ar.events[i].where + '</p></div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }
  }
  for(i = 0; i < ar.testimonials.length; i++) {
    //testimonials page
    if($("#t-page").length !== 0) {
      var img_class = "";
      var attribution_class = "";
      if( i % 2 == 0 ) {
        img_class = "float-left";
        attribution_class = "text-right";
      } else {
        img_class = "float-right";
        attribution_class = "text-left";  
      }

      $("#t-page").append(
        '<div class="row testimonial">' +
          '<div class="col-md-8 quote">' +
            '<img class="testimonial-img rounded-circle ' + img_class + '" src="' + ar.testimonials[i].image + '"' + ar.testimonials[i].name + '></img>' +
            '<p>' + ar.testimonials[i].quote + '</p>' +
          '</div>' +
          '<div class="col-md-8 attribution">' +
            '<p class="' + attribution_class + ' name">' + ar.testimonials[i].name + '</p>' +
            '<p class="' + attribution_class + ' title">' + ar.testimonials[i].title + '</p>' +
            '<p class="' + attribution_class + ' company">' + ar.testimonials[i].company + '</p>' +
          '</div>' +
        '</div>'
      );
    }
  }
  for(i = 0; i < ar.galleryimages.length; i++) {
    if($("#gallery-container .gallery").length !== 0) {
      $("#gallery-container .gallery").append(
        '<div class="img-container" style="background-image: url(' + ar.galleryimages[i].image + ')">' +
        '<img src="' + ar.galleryimages[i].image + '"' + ar.galleryimages[i].caption + '>' +
			    '<a href="#">' +
			      '<div class="caption text-center">' +
			        '<p>' + ar.galleryimages[i].caption + '</p>' +
			      '</div>' +
          '</a>' +
		    '</div>'
      );
    }
  }
  for(var i = 0; i < ar.booklist.length; i++) {
    if($("tbody").length !== 0) {
      $("tbody").append(
        '<tr class="row100 body">'+
          '<td class="cell100 column1">' + ar.booklist[i].bookno + '</td>'+
          '<td class="cell100 column2">' + ar.booklist[i].bookname + '</td>'+
          '<td class="cell100 column3">' + ar.booklist[i].author + '</td>' +
        '</tr>'
      );
    }
    if($("tbody").length !== 0) {
      $(".loading-spinner").parent().remove();
    }
  }
  // to stimulate hover effect on touch screen devices
  $(".img-container a").on("touchstart touched", function(e) {
    $(this).focus();
  });

  if($(".limiter").length !== 0) {
    var filter_options = {
      "Self Help": 1,
      "Biography": 2,
      "Children's": 3,
      "Novel": 4,
      "Fitness": 5,
      "Science Non-fiction": 6,
      "Travelogues": 7,
      "History": 8,
      "Other Non-fiction": 9
    };

    //search logic using fuse.js
    var options = {
      shouldSort: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 5,
      keys: [
        "bookname",
        "author"
      ]
    };
    var fuse = new Fuse(ar.booklist, options);

    function search_booklist(booklist) {
      $("#search").addClass("loading");

      var result = [];
      var language = $("#language .choices__item.choices__item--selectable").data("value");
      var category = $("#category .choices__item.choices__item--selectable").data("value");

      if ($(".input-field.second-wrap input#search")[0].value.length !== 0) {
        result = fuse.search($(".input-field.second-wrap input#search")[0].value);
      } else {
        result = booklist;
      }
      if(language !== "Language") {
        if (language === "E") {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("E") > -1});
        } else if (language === "M") {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("M") > -1});
        }
      }

      if (category !== "Category") {

        if(category === 1) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("1") > -1});
        } else if(category === 2) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("2") > -1});
        } else if(category === 3) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("3") > -1});
        } else if(category === 4) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("4") > -1});
        } else if(category === 5) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("5") > -1});
        } else if(category === 6) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("6") > -1});
        } else if(category === 7) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("7") > -1});
        } else if(category === 8) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("8") > -1});
        } else if(category === 9) {
          result = result.filter(function(b) {return b.bookno.split("-")[0].indexOf("9") > -1});
        }
      }

      $("tbody").empty().append('<tr><td class="loading-spinner"></td>');
      
      setTimeout(function() {
        $("tbody").empty();

        for(var i = 0; i < result.length; i++) {

          $("tbody").append(
            '<tr class="row100 body">'+
              '<td class="cell100 column1">' + result[i].bookno + '</td>'+
              '<td class="cell100 column2">' + result[i].bookname + '</td>'+
              '<td class="cell100 column3">' + result[i].author + '</td>' +
            '</tr>'
          );
        }

        $("#search").removeClass("loading");
      }, 1500);
    }
    // search bar
    $(".input-field.second-wrap input#search, #language .choices__item.choices__item--selectable").on("keydown", {"booklist": ar.booklist}, function(e) {
      if(e.keyCode === 13) {
        search_booklist(e.data.booklist);
        //scroll the table into view
        $('html,body').animate({
          scrollTop: parseInt($(".s003").css('height'),10) - 30
        },'slow');
      }
    });
    $(".input-field.third-wrap button.btn-search").on("click", {"booklist": ar.booklist}, function(e) {
      search_booklist(e.data.booklist);
      //scroll the table into view
      $('html,body').animate({
        scrollTop: parseInt($(".s003").css('height'),10) - 30
      },'slow');
    });
  }
});
