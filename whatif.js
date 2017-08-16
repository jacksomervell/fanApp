
var thePlayersTotalScores = [];
 			var totalScoresIndex = 0;
 			var thePlayers = [1, 2,30,49,50,60,70, 9, 8, 1, 5, 6]

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
  // 	$.ajax({crossOrigin:true, url: "http://whateverorigin.org/get?url=https://fantasy.premierleague.com/drf/entry/30615/event/1", success: function(result){
		// 	console.log(result);
		// 	console.log('hello');
		// 	return;
		// }})

			var teamId = $('.team-id').val()

			if(teamId == ""){
				$('.warning').slideDown();
				return;
			}

			$('.warning').slideUp();

	    $.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/event/1"}, success: function(result){
	    	//console.log(result);
	    	var thePlayers = [];
	    	var playerScores = result.picks;
			 var points = [];
			 var teamName = result.entry.name;
			 var formation = [];
			 var viceCaptain;
			 var captain;

			 var possibleFormations = [
			   	'4-4-2',
			   	'5-3-2',
			   	'4-3-3',
			   	'3-5-2',
			   	'3-4-3',
			   	'5-2-3',
			   	'4-5-1',
			   	'5-4-1',
		]

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
			 

//get the team. thePLayers array is the set of players to calculate total scores for

	   		for (i=0; i < 15; i++){
	   			thePlayers.push(playerScores[i].element)

	   	//push the id in twice if it's captain
	   			if (playerScores[i].is_captain == true){
	   				thePlayers.push(playerScores[i].element)
	   			}

	   		}

//get the formation 
	for (i=0; i < 15; i++){
	   			formation.push(playerScores[i].element_type)
	   		}

//remove the subs

	
		function removeItems(arr, item) {
		    for ( var i = 0; i < item; i++ ) {
		        arr.pop();
		    }
		}

		removeItems(formation, 4);
	   		

	   	if(formation.toString() === [1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4].toString()){
	   		formation = possibleFormations[4]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4].toString()){
	   		formation = possibleFormations[2]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4].toString()){
	   		formation = possibleFormations[0]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4].toString()){
	   		formation = possibleFormations[1]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4].toString()){
	   		formation = possibleFormations[4]
	   	}

	   	 if(formation.toString() === [1, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4].toString()){
	   		formation = possibleFormations[5]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4].toString()){
	   		formation = possibleFormations[6]
	   	}

	   	if(formation.toString() === [1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4].toString()){
	   		formation = possibleFormations[7]
	   	}


		


 //get the scores for each player

 			var thePlayersTotalScores = [];
 			var totalScoresIndex = 0;

 			for (i=0; i < 12; i++){

 				(function(i)
 				{


		 			$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + thePlayers[i], async:false}})
		 			 .done(function(result){
 		

	//add every point up for each week

							var thisPlayersScores = []
							
							for(i=0; i<result.history.length; i++){
								thisPlayersScores.push(result.history[i].total_points)
							}
		 //save all the player sscores into arra

		 					var scoresAddedForOnePlayer = (thisPlayersScores.reduce(function(a, b) { return a + b; }, 0));

		 					thePlayersTotalScores[totalScoresIndex] = scoresAddedForOnePlayer;
		 					totalScoresIndex++;

	 				})

	 				
 				})(i);	
 			}
 		

 			//console.log(thePlayersTotalScores)
 	


     //now calculate how many subs points wouldve been contributed:

     var subs = []
   
     subs.push(thePlayers[12]);
     subs.push(thePlayers[13]);
     subs.push(thePlayers[14]);
     subs.push(thePlayers[15]);


     var theSubsScoresToAdd = [];
 		var subScoresIndex = 0;

 		var subsUsedInGameWeek = [];
		var subsUsed = 0;

 		

 	//cycle through the starting 11

     	for (i=0; i < 12; i++){

 				(function(i)
 				{

		 			$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + thePlayers[i]}, async:false})
		 			 .done(function(result){

		 			 		var playerPos = i;
		 			 		var playerNum = thePlayers[i]
		 			 		

		 			 		//these are for if subs have been used. If this sub is used, add it to the array. Checks the array each time loops.
		 			 		

							
						for(i=0; i<result.history.length; i++){
								
								var gameWeek = i;
							
					//set the vice cap as cap and add their points into the subpoint array if the cap didnt play

							if((result.history[i].minutes == 0)&&(playerNum == captain)){
								(function(){

							 			$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + viceCaptain}, async:false})
							 			 .done(function(result){

							 			 	var addPoints = result.history[i].total_points
							 			 	theSubsScoresToAdd[subScoresIndex] = addPoints;
		 									subScoresIndex++;
												})	

											})()
							}
					//if the player did not play
								if(result.history[i].minutes == 0){


					//calc if keeper
									if (playerPos == 0){
										(function(){

							 			$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[0]}, async:false})
							 			 .done(function(result){
							 			 	// if(countInArray(gameWeeksWithSubs, i) > 2){ return}
							 			 	var addPoints = result.history[i].total_points
							 			 	theSubsScoresToAdd[subScoresIndex] = addPoints;
		 									subScoresIndex++;		
												})	

											})()
									}
					//calc for outfield
									if (playerPos > 0){
										(function(){

							 			$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[1]}, async:false})
							 			 .done(function(result){

							 			 		if(!result.history[i]){
							 			 		return;
							 			 		}

								 			 	if ((result.history[i].minutes == 0) || (countInArray(subsUsedInGameWeek, (subs[1] + i)) > 0)){
								 			 			(function(){

							 								$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[2]}, async:false})
							 			 					.done(function(result){

							 			 						if(!result.history[i]){
												 			 		return;
												 			 		}

							 			 						if ((result.history[i].minutes == 0) || (countInArray(subsUsedInGameWeek, (subs[2] + i)) > 0)){
								 			 						(function(){

										 								$.ajax({url:'/proxy.php', data:{csurl: "https://fantasy.premierleague.com/drf/element-summary/" + subs[3]}, async:false})
										 			 					.done(function(result){

										 			 						if(!result.history[i]){
															 			 		return;
															 			 		}

										 			 						if(countInArray(subsUsedInGameWeek, (subs[3] + i)) > 0){return}

										 			 						subsUsedInGameWeek[subsUsed] = (subs[3] + i);
														 			 		subsUsed++
										 			 						
														 			 		
										 			 						// if(countInArray(gameWeeksWithSubs, i) > 2){ return}
										 			 						var addPoints = result.history[i].total_points
							 			 									theSubsScoresToAdd[subScoresIndex] = addPoints;
		 																	subScoresIndex++;
																				
		 																	
										 			 						
										 			 					})
												 			 		})()
												 			 	}
												 			 	else{

												 			 		subsUsedInGameWeek[subsUsed] = (subs[2] + i);
												 			 		subsUsed++
												 			 		
												 			 		
												 			 		// if(countInArray(gameWeeksWithSubs, i) > 2){ return}
												 			 		var addPoints = result.history[i].total_points
							 			 							theSubsScoresToAdd[subScoresIndex] = addPoints;
		 															subScoresIndex++;

																
												 			 	}
							 			 					})
								 			 			})()
								 			 	}
								 			 	else{


								 			 		subsUsedInGameWeek[subsUsed] = (subs[1] + i);
								 			 		subsUsed++
								 			 		
								 			 		
								 			 		// if(countInArray(gameWeeksWithSubs, i) > 1){ return}

								 			 		var addPoints = result.history[i].total_points
							 			 			theSubsScoresToAdd[subScoresIndex] = addPoints;
		 											subScoresIndex++;

								 			 	}
							 			 
														
											})	

										})()
									}
								}
							}

	 				})

	 				
 				})(i);	
 			}


 			var subScores = theSubsScoresToAdd.reduce(function(a, b) { return a + b; }, 0);

 			 console.log(subScores);

 			var fieldedPlayersScore = thePlayersTotalScores.reduce(function(a, b) { return a + b; }, 0);

 			 console.log(fieldedPlayersScore);

 			var totalScore = subScores + fieldedPlayersScore; 


      $('.results').append("<p>If <strong>" + teamName + "</strong> hadn't made any transfers or captain changes since day 1, their score would be <strong> "+totalScore+"</strong></p>")

	    }, complete: function(){
	   	 // $('.ajax-loader').css("visibility", "hidden");
  		}});


	}); 

})