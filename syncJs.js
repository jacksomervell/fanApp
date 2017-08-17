
var thePlayersTotalScores = [];
      var totalScoresIndex = 0;
      var thePlayers = [1, 2,30,49,50,60,70, 9, 8, 1, 5, 6]
      var playerScores = [];
      var thePlayersTotalScores = [];


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
  //  $.ajax({crossOrigin:true, url: "http://whateverorigin.org/get?url=https://fantasy.premierleague.com/drf/entry/30615/event/1", success: function(result){
    //  console.log(result);
    //  console.log('hello');
    //  return;
    // }})

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
                           var formation = [];
                           var viceCaptain;
                           var captain;
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

      $(document).ajaxStop(function () {
          
        thePlayersTotalScores = thePlayersTotalScores.slice(0, 12);
        console.log(thePlayers);

         var subs = []
       
         subs.push(thePlayers[12]);
         subs.push(thePlayers[13]);
         subs.push(thePlayers[14]);
         subs.push(thePlayers[15]);


         var theSubsScoresToAdd = [];
         var subScoresIndex = 0;

         var subsUsedInGameWeek = [];
         var subsUsed = 0;

         var fish = $.each (thePlayers, function(i, val){

            $.ajax({url:'http://whatiff.herokuapp.com/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + val,}})
           .done(function(result){

              var playerPos = val;
              var playerNum = thePlayers[val]
              console.log(result);

           })

          //end of fish:
         })

       //end of ajaxStop:  
      })

    //end of click:
      })
})

            //now calculate how many subs points wouldve been contributed:

          

// ///where you got to yesterdayyy

//           $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + thePlayers[i]}})
//            .done(function(result){

//               var playerPos = i;
//               var playerNum = thePlayers[i]
//               console.log(result);
              

//               //these are for if subs have been used. If this sub is used, add it to the array. Checks the array each time loops.
              

              
//             for(i=0; i<result.history.length; i++){
                
//                 var gameWeek = i;
              
//           //set the vice cap as cap and add their points into the subpoint array if the cap didnt play

//               if((result.history[i].minutes == 0)&&(playerNum == captain)){
//                 (function(){

//                     $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + viceCaptain}, async:false})
//                      .done(function(result){

//                       console.log('4' + result);

//                       var addPoints = result.history[i].total_points
//                       theSubsScoresToAdd[subScoresIndex] = addPoints;
//                       subScoresIndex++;
//                         })  

//                       })()
//               }
//           //if the player did not play
//                 if(result.history[i].minutes == 0){


//           //calc if keeper
//                   if (playerPos == 0){
//                     (function(){

//                     $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[0]}, async:false})
//                      .done(function(result){
//                       console.log('5' + result);
//                       // if(countInArray(gameWeeksWithSubs, i) > 2){ return}
//                       var addPoints = result.history[i].total_points
//                       theSubsScoresToAdd[subScoresIndex] = addPoints;
//                       subScoresIndex++;   
//                         })  

//                       })()
//                   }
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






  


  //    //now calculate how many subs points wouldve been contributed:

  //    var subs = []
   
  //    subs.push(thePlayers[12]);
  //    subs.push(thePlayers[13]);
  //    subs.push(thePlayers[14]);
  //    subs.push(thePlayers[15]);


  //    var theSubsScoresToAdd = [];
  //   var subScoresIndex = 0;

  //   var subsUsedInGameWeek = [];
  //   var subsUsed = 0;

    

  // //cycle through the starting 11

  //     for (i=0; i < 12; i++){

  //       (function(i)
  //       {

  //         
          
  //       })(i);  
  //     }

  //     console.log(thePlayersTotalScores);


  //     var subScores = theSubsScoresToAdd.reduce(function(a, b) { return a + b; }, 0);

  //      //console.log(theSubScoresToAdd);

  //     var fieldedPlayersScore = thePlayersTotalScores.reduce(function(a, b) { return a + b; }, 0);

       
  //     var totalScore = subScores + fieldedPlayersScore; 


  //     $('.results').append("<p>If <strong>" + teamName + "</strong> hadn't made any transfers or captain changes since day 1, their score would be <strong> "+totalScore+"</strong></p>")

  //     }, complete: function(){
  //      // $('.ajax-loader').css("visibility", "hidden");
  //     }

  //   });


  // }); 
