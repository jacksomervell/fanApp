
var thePlayersTotalScores = [];
      var totalScoresIndex = 0;
      var thePlayers = []
      var playerScores = [];
      var thePlayersTotalScores = [];
      var ajaxCount = 0;
      var viceCaptain;
      var captain;
      var theSubsScoresToAdd = [];
     var subScoresIndex = 0;
     var subsUsedInGameWeek = [];
     var subsUsed = 0;
     var subs = [];
     var playersWhoPlayedHistory;


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

// $.ajaxPrefilter( function (options) {
//   if (options.crossDomain && jQuery.support.cors) {
//     var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
//     options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
//     //options.url = "http://cors.corsproxy.io/url=" + options.url;
//   }
// });

  

  $(".what-if").click(function(){
  
      var teamId = $('.team-id').val()

      if(teamId == ""){
        $('.warning').slideDown();
        return;
      }

      $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', 
                        data:{csurl: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/event/1"}, 
                        success: function(result){

                          thePlayers = [];
                          playerScores = result.picks;
                           var points = [];
                           var teamName = result.entry.name;
                           

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

       var fish = $.each(thePlayers, function(i, val){

          var scoresAddedForOnePlayer
         
            $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + val,}})
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
          
        thePlayersTotalScores = thePlayersTotalScores.slice(0, 12);
       
         subs.push(thePlayers[12]);
         subs.push(thePlayers[13]);
         subs.push(thePlayers[14]);
         subs.push(thePlayers[15]);


         var playerHistory = [];

         var fish = $.each (thePlayers, function(i, val){

            $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + val,}})
           .done(function(result){

                playerHistory.push(result);

           })

          //end of each:
          })

         $(document).ajaxStop(function(){
          $(this).unbind("ajaxStop");
          //console.log(playerHistory);

          playersWhoPlayedHistory = playerHistory.slice(0, 12);

              var fish = $.each (playersWhoPlayedHistory, function(i, val){

                //console.log(val)
                var playerPos = val;
                var playerNum = thePlayers[val]

 
                for(i=0; i<val.history.length; i++){

                  //console.log(val.history[i].minutes);

                  if((val.history[i].minutes == 0)&&(playerNum == captain)){
                   (function(){

                      $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + viceCaptain}})
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
                        console.log('faked')
                      }  
                    });



              $(document).ajaxStop(function(){
                $(this).unbind("ajaxStop");
                 //if the keeper didnt play

                var fish = $.each (playersWhoPlayedHistory, function(i, val){

                //console.log(val)
                  var playerPos = val;
                  var playerNum = thePlayers[val]

   
                  for(i=0; i<val.history.length; i++){

                    if((val.history[i].minutes == 0)&&(playerPos == 0)){
                     (function(){

                        $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[0]}})
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
                        console.log('faked')
                      }  
                    });


                    $(document).ajaxStop(function(){
                      $(this).unbind("ajaxStop");

                      //for outfielders:

                      var fish = $.each (playersWhoPlayedHistory, function(i, val){

                //console.log(val)
                          var playerPos = val;
                          var playerNum = thePlayers[val]

           
                          for(i=0; i<val.history.length; i++){

                            console.log(val);
                            

                            if((val.history[i].minutes == 0)&&(playerPos > 0)){
                             (function(){
                                  console.log(val)
                                $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[0]}})
                                 .done(function(result){
                                      console.log(result);
                                        var addPoints = result.history[i].total_points
                                        theSubsScoresToAdd[subScoresIndex] = addPoints;
                                        subScoresIndex++;
                                      
                                    })  

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
                      // console.log('made it');
                      // console.log('subs: ' + subs)
                      // console.log('starters scores: ' + thePlayersTotalScores);
                      // console.log('sub scores: ' + theSubsScoresToAdd)
                      // console.log('history of players who played: ' + playersWhoPlayedHistory)

                      var subScores = theSubsScoresToAdd.reduce(function(a, b) { return a + b; }, 0);


                      var fieldedPlayersScore = thePlayersTotalScores.reduce(function(a, b) { return a + b; }, 0);

                       
                      var totalScore = subScores + fieldedPlayersScore; 

                      console.log(totalScore);

                    });

            })
              
          })
      
       })

      })



    //end of click:
  });

});


              

//               //these are for if subs have been used. If this sub is used, add it to the array. Checks the array each time loops.
              

              
//             
//           //calc for outfield
//                   if (playerPos > 0){
//                     (function(){

//                     $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[1]}, async:false})
//                      .done(function(result){
//                         console.log('6' + result);
//                         if(!result.history[i]){
//                         return;
//                         }

//                         if ((result.history[i].minutes == 0) || (countInArray(subsUsedInGameWeek, (subs[1] + i)) > 0)){
//                             (function(){

//                               $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[2]}, async:false})
//                               .done(function(result){
//                                 console.log('7' + result);
//                                 if(!result.history[i]){
//                                   return;
//                                   }

//                                 if ((result.history[i].minutes == 0) || (countInArray(subsUsedInGameWeek, (subs[2] + i)) > 0)){
//                                   (function(){

//                                     $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[3]}, async:false})
//                                     .done(function(result){
//                                       console.log('8' + result);
//                                       if(!result.history[i]){
//                                         return;
//                                         }

//                                       if(countInArray(subsUsedInGameWeek, (subs[3] + i)) > 0){return}

//                                       subsUsedInGameWeek[subsUsed] = (subs[3] + i);
//                                       subsUsed++
                                      
                                      
//                                       // if(countInArray(gameWeeksWithSubs, i) > 2){ return}
//                                       var addPoints = result.history[i].total_points
//                                       theSubsScoresToAdd[subScoresIndex] = addPoints;
//                                       subScoresIndex++;
                                        
                                      
                                      
//                                     })
//                                   })()
//                                 }
//                                 else{

//                                   subsUsedInGameWeek[subsUsed] = (subs[2] + i);
//                                   subsUsed++
                                  
                                  
//                                   // if(countInArray(gameWeeksWithSubs, i) > 2){ return}
//                                   var addPoints = result.history[i].total_points
//                                   theSubsScoresToAdd[subScoresIndex] = addPoints;
//                                   subScoresIndex++;

                                
//                                 }
//                               })
//                             })()
//                         }
//                         else{


//                           subsUsedInGameWeek[subsUsed] = (subs[1] + i);
//                           subsUsed++
                          
                          
//                           // if(countInArray(gameWeeksWithSubs, i) > 1){ return}

//                           var addPoints = result.history[i].total_points
//                           theSubsScoresToAdd[subScoresIndex] = addPoints;
//                           subScoresIndex++;

//                         }
                     
                            
//                       })  

//                     })()
//                   }
//                 }
//               }

//           })


  //     console.log(thePlayersTotalScores);


      


  //     $('.results').append("<p>If <strong>" + teamName + "</strong> hadn't made any transfers or captain changes since day 1, their score would be <strong> "+totalScore+"</strong></p>")

  //     }, complete: function(){
  //      // $('.ajax-loader').css("visibility", "hidden");
  //     }

  //   });


  // }); 

