
  
      var thePlayersTotalScores = [];
      var totalScoresIndex = 0;
      var thePlayers = []
      var playerScores = [];
      var ajaxCount = 0;
      var viceCaptain;
      var captain;
      var theSubsScoresToAdd = [];
     var subScoresIndex = 0;
     var subsUsedInGameWeek = [];
     var subsUsed = 0;
     var subs = [];
     var playersWhoPlayedHistory = [];
     var teamName;
     var playerHistory = [];
     var theKeeper = [];
     var theKeeperHistory = [];

     var url = 'http://whatiff.herokuapp.com/proxy.php';
     //var url = 'http://www.game-change.co.uk/proxy.php';


function resetVars(){
  
       thePlayersTotalScores = [];
       totalScoresIndex = 0;
       thePlayers = []
       playerScores = [];
       ajaxCount = 0;
       viceCaptain = '';
       captain = '';
       theSubsScoresToAdd = [];
       subScoresIndex = 0;
      subsUsedInGameWeek = [];
      subsUsed = 0;
      subs = [];
      playersWhoPlayedHistory = [];
      playerHistory = []
      teamName = '';
      theKeeper= [];
      theKeeperHistory = [];

}

$(document).ready(function(){


  function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
  }

  $('.captain-if').click(function(){

    var teamId = $('.captain-team-id').val();
    var limit;
    var allPoints = [];
    var limitArray = [];
    var teamName;

     $.ajax({url:url, 
              data:{csurl: "https://fantasy.premierleague.com/drf/bootstrap-static"}, 
              success: function(result){
//get array of every gameweek
              limit = 6

              console.log(result.last-entry-event);

              //console.log(result.);
              
              var lowend = 1
              var highend = limit;

              for (var i = lowend; i <= highend; i++) {
                limitArray.push(i);
              }
              console.log(limitArray);
             }


    }).done(function(){

      var fish = $.each(limitArray, function(i, val){

          $.ajax({url:url, 
                  data:{csurl: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/event/" + val +'/picks'}, 
                  success: function(result){
                    console.log(result)
                    
                    teamName = 'hello'

                    cPlayers = result.picks
                    var points = [];

                      Array.prototype.swap = function (x,y) {
                        var b = this[x];
                        this[x] = this[y];
                        this[y] = b;
                        return this;
                      }


                    if(result.automatic_subs.length > 0){
                        var sub = result.automatic_subs[0].element_in;
                        var original = result.automatic_subs[0].element_out;

                        sub = cPlayers.indexOf(sub);
                        original = cPlayers.indexOf(original);

                        cPlayers.swap(sub, original);
                      }

                    for (i=0; i<11; i++){
                      points.push(cPlayers[i].points)                
                    }

                    //find highest scorer and double him

                    var largest = Math.max.apply(Math, points);

                    points.push(largest);

                    var points = points.reduce(add, 0);

                    function add(a, b) {
                        return a + b;
                    }

                    allPoints.push(points);

                  }
            })
       })

    })

    $(document).ajaxStop(function(){
          $(this).unbind("ajaxStop");

          allPoints = allPoints.reduce(function(a, b) { return a + b; }, 0);

          console.log(allPoints);
          $('.captain-results').append("<p>If <strong>" + teamName + "</strong> had picked their best captain choice every week, their current score would be <strong>" + allPoints + "</srong>");
    })
  })

  

  $(".what-if").click(function(){

      
      $(this).attr("disabled", true);

  
      var teamId = $('.team-id').val()

      if(teamId == ""){
        $('.warning').slideDown();
        $(this).attr("disabled", false);
        return;
      }

      $.ajax({url:url, 
                        data:{csurl: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/event/1/picks"}, 
                        success: function(result){
                          console.log(result);

                          thePlayers = [];
                          playerScores = result.picks;
                           var points = [];
                           // teamName = result.entry.name;
                           

                //set cap

                    for (i=0; i<14; i++){
                        if (playerScores[i].is_captain == true){
                          captain = playerScores[i].element;
                          }
                      }

                //set viceCap 

                    for (i=0; i<14; i++){
                      if (playerScores[i].is_vice_captain == true){
                        viceCaptain = playerScores[i].element;
                        }
                    }
             

      //get the team. thePlayers array is the set of players to calculate total scores for

                for (i=0; i < 15; i++){
                  thePlayers.push(playerScores[i].element)

              //push the id in twice if it's captain
                  if (playerScores[i].is_captain == true){
                    thePlayers.push(playerScores[i].element)
                      }
                }

                Array.prototype.swap = function (x,y) {
                    var b = this[x];
                    this[x] = this[y];
                    this[y] = b;
                    return this;
                  }

                if(result.automatic_subs.length > 0){
                    var sub = result.automatic_subs[0].element_in;
                    var original = result.automatic_subs[0].element_out;

                    sub = thePlayers.indexOf(sub);
                    original = thePlayers.indexOf(original);

                    thePlayers.swap(sub, original);
                  }
            }
    }).done(function(){

      //console.log('before each:' + thePlayers);

         subs.push(thePlayers[12]);
         subs.push(thePlayers[13]);
         subs.push(thePlayers[14]);
         subs.push(thePlayers[15]);

         thePlayers = thePlayers.slice(0, 12);

         var keepy = thePlayers[0];
         theKeeper.push(keepy);
         thePlayers = thePlayers.slice(1,12);

         console.log(theKeeper);
         console.log(thePlayers);


       var fish = $.each(thePlayers, function(i, val){

          var scoresAddedForOnePlayer
         
            $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + val,}})
           .done(function(result){
              //add every point up for each week

              var thisPlayersScores = []
          
              for(i=0; i<result.history.length; i++){
                thisPlayersScores.push(result.history[i].total_points)
              }
              
              //save all the player sscores into arra

              scoresAddedForOnePlayer = (thisPlayersScores.reduce(function(a, b) { return a + b; }, 0));
              thePlayersTotalScores.push(scoresAddedForOnePlayer);
          })
        })
      })

      $(document).ajaxStop(function(){
          $(this).unbind("ajaxStop");
          
          //console.log('before subs out: ' + thePlayersTotalScores);

         var fish = $.each (thePlayers, function(i, val){

            $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + val,}})
           .done(function(result){

                playerHistory.push(result);

           })

          //end of each:
          })

         $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + theKeeper[0],}})
           .done(function(result){

                theKeeperHistory.push(result);

           })

         $(document).ajaxStop(function(){
          $(this).unbind("ajaxStop");
          //console.log(playerHistory);

          playersWhoPlayedHistory = playerHistory;

              var fish = $.each (playersWhoPlayedHistory, function(i, val){

                //console.log(val)
                var playerNum = thePlayers[i]

 
                for(i=0; i<val.history.length; i++){

                  console.log(val);

                  if((val.history[i].minutes == 0)&&(playerNum == captain)){
                   (function(){

                      $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + viceCaptain}})
                       .done(function(result){
                            
                              var addPoints = result.history[i].total_points
                              theSubsScoresToAdd[subScoresIndex] = addPoints;
                              subScoresIndex++;
                            
                          })  

                        })
                   }
                 }

              //end of fish:
               })


              //fake ajax to send if vice cap doesnt send to trigger below ajaxStop
                    $.ajax({
                      type: 'POST',
                      dataType: 'json',
                      url: '/',
                      data : { json: 'hi' },
                      success: function(data) {
                        
                      }  
                    });



              $(document).ajaxStop(function(){
                $(this).unbind("ajaxStop");
                 //if the keeper didnt play

                var fish = $.each (theKeeperHistory, function(i, val){

   
                  for(i=0; i<val.history.length; i++){

                    //console.log(val.history[0].minutes);
                    if((val.history[i].minutes == 0)){

                        $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[0]}})
                         .done(function(result){
                              console.log('keeper sub happened' +result)
                                var addPoints = result.history[i-1].total_points
                                theSubsScoresToAdd[subScoresIndex] = addPoints;
                                subScoresIndex++;
                              
                            })  
                     }
                     else {


                        $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + theKeeper[0]}})
                         .done(function(result){
                              console.log('keeper played: ' +result)
                                var addPoints = result.history[i-1].total_points
                                thePlayersTotalScores.push(addPoints);                            
                            })  

                     }
                   }

              //end of fish:
               })

                //fake ajax to send if vice cap doesnt send to trigger below ajaxStop
                    $.ajax({
                      type: 'POST',
                      dataType: 'json',
                      url: '/',
                      data : { json: 'hi' },
                      success: function(data) {
                        console.log('faked')
                      }  
                    });


                    $(document).ajaxStop(function(){
                      $(this).unbind("ajaxStop");

                      //for outfielders:

                      var fish = $.each (playersWhoPlayedHistory, function(i, val){

                //console.log(val.history)
                          var playerNum = thePlayers[val]

           
                          for(i=0; i<val.history.length; i++){
                              // console.log(i);
                              var subNumber = 1;
                            if(val.history[i].minutes == 0){
                                  // console.log(i)
                                $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[subNumber]}})
                                 .done(function(result){
                                      console.log('subtime:' + i);
                                      console.log('sub'+ result);
                                        var addPoints = result.history[i-1].total_points
                                        theSubsScoresToAdd[subScoresIndex] = addPoints;
                                        subNumber++
                                      
                                    })  
                             }
                           }

              //end of fish:
               })
                      $.ajax({
                      type: 'POST',
                      dataType: 'json',
                      url: '/',
                      data : { json: 'hi' },
                      success: function(data) {
                        console.log('faked')
                      }  
                    });



                    $(document).ajaxStop(function(){
                      $(this).unbind("ajaxStop");

                      //set the teamname

                      $.ajax({url:url, data:{csurl: "https://fantasy.premierleague.com/drf/entry/" + teamId}})
                                 .done(function(result){
                                      teamName = result.entry.name;
                                      console.log(teamName);
                                    })  



                      $(document).ajaxStop(function(){
                        $(this).unbind("ajaxStop");
                        // console.log('made it');
                        // console.log('subs: ' + subs)
                        // console.log('starters scores: ' + thePlayersTotalScores);
                        // console.log('sub scores: ' + theSubsScoresToAdd)
                        // console.log('players: ' + thePlayers)

                        var subScores = theSubsScoresToAdd.reduce(function(a, b) { return a + b; }, 0);


                        var fieldedPlayersScore = thePlayersTotalScores.reduce(function(a, b) { return a + b; }, 0);

                         
                        var totalScore = subScores + fieldedPlayersScore; 
                        console.log('subscores and fieldedscores: ' + [subScores, fieldedPlayersScore]);

                        console.log('final score:' + totalScore);

                        $('.results').append("<p>If <strong>" + teamName + "</strong> hadn't made any transfers, line-up changes or captain changes since day 1, their score would be <strong> "+totalScore+"</strong></p>")

                        resetVars();
                        $(".what-if").attr("disabled", false);

                      });
                    })


            })
              
          })
      
       })

      })



    //end of click:
  });

});


               



