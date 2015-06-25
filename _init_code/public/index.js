		var artistResultTemplate = "<div id='artist_[[ID]]'>" +
										"<a href='http://www.discogs.com[[HREF]]' target='_blank'><img src='[[SRC]]' alt=''></a>" +
										"<br>" +
										"<a href='http://www.discogs.com[[HREF]]' target='_blank'>[[NAME]]</a><br><br>" +
									"</div>";

		var mastersResultTemplate = "<div id='artist_[[ID]]'>" +
										"<a href='http://www.discogs.com[[HREF]]' target='_blank'><img src='[[SRC]]' alt=''></a>" +
										"<br>" +
										"<a href='http://www.discogs.com[[HREF]]' target='_blank'>[[NAME]] <br>HAVE:[[HAVE]] WANT:[[WANT]]</a><br><br>" +
									"</div>";


			
	    var searchRequest = function(term){	
            $.get('http://localhost:8080/search/' + escape(term), function(data) {
                console.log(data);
              	renderResults(data);                
            });
	    };

	    var renderResults = function(results){
	    	//console.log(results);
			$resultDisplay.html("");

			//DISPLAY ARTISTS
			$resultDisplay.append("<h3>Artists</h3>");
	    	$.each(results.artists, function(i, artist){
	    		console.log(artist);

				$resultDisplay.append(artistResultTemplate.replace(/\[\[HREF\]\]/g, artist.uri)
														  .replace("[[SRC]]", artist.thumb)
														  .replace("[[NAME]]", artist.title)
														  .replace("[[ID]]", artist.id));
	    	});


			//DISPLAY MASTERS
			$resultDisplay.append("<h3>Masters</h3>");
	    	$.each(results.masters, function(i, masters){
	    		console.log(masters);

				$resultDisplay.append(mastersResultTemplate.replace("[[HREF]]", masters.uri)
														  .replace("[[SRC]]", masters.thumb)
														  .replace("[[NAME]]", masters.title)
														  .replace("[[ID]]", masters.id)
														  .replace("[[WANT]]", masters.community.want)
														  .replace("[[HAVE]]", masters.community.have));
	    	});

	    	

	    };

	    $(document).ready(function() {

	    	$resultDisplay = $("#resultDisplay");

	    	$("#searchRequest input[type='button']").on('click', function(){
				$resultDisplay.html("loading");
	    		searchRequest($("#searchRequest input[type='text']").val());
	    	});


	    });

