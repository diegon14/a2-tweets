function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const written_tweet_array = tweet_array.filter(
		tweet => tweet.written && tweet.source === 'completed_event');

	console.log(written_tweet_array);
	addEventHandlerForSearch(written_tweet_array);
}

function addEventHandlerForSearch(written_tweet_array) {
	const textFilter = document.getElementById('textFilter');
	const searchText = document.getElementById('searchText');
	const searchCount = document.getElementById('searchCount');
	const tweetTable = document.getElementById('tweetTable');

	searchCount.innerText = 0;
	searchText.innerText = '';
	tweetTable.innerHTML = '';

	textFilter.addEventListener('input', (event) => {
		const query = event.target.value;
		searchText.innerText = query;

		const results = written_tweet_array.filter(tweet => tweet.writtenText.toLowerCase().includes(query.toLowerCase()));
		
		if (query !== '') {
			searchCount.innerText = results.length;
			let tableRows = '';
			results.forEach((tweet, index) => {
				tableRows += tweet.getHTMLTableRow(index + 1);
			});

			tweetTable.innerHTML = tableRows;
		} else {
			searchCount.innerText = 0;
			tweetTable.innerHTML = '';
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	// addEventHandlerForSearch(); passed in parseTweets in order to get written_tweet_array
	loadSavedRunkeeperTweets().then(parseTweets);
});