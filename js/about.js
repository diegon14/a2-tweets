function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	tweet_count = tweet_array.length;
	document.getElementById('numberTweets').innerText = tweet_count;	

	displayDateRange(tweet_array, tweet_count);
	displayTweetCategories(tweet_array, tweet_count);
	displayUserWrittenTweets(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function displayDateRange(tweet_array, tweet_count) {
	if (tweet_count === 0) {
		return
	}

	const earliestTweet = tweet_array.reduce((earliest, tweet) => tweet.time < earliest.time ? tweet : earliest);
	const latestTweet = tweet_array.reduce((latest, tweet) => tweet.time > latest.time ? tweet : latest);

	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC' // reflecting the timezone offset on the data
	};

	document.getElementById('firstDate').innerText = 
		earliestTweet.time.toLocaleDateString('en-US', options);

	document.getElementById('lastDate'). innerText =
		latestTweet.time.toLocaleDateString('en-US', options);

}

function displayTweetCategories(tweet_array, tweet_count) {
	const categories = [
		{ type: 'completed_event', countClass: 'completedEvents', percentageClass: 'completedEventsPct' },
		{ type: 'live_event', countClass: 'liveEvents', percentageClass: 'liveEventsPct' },
		{ type: 'achievement', countClass: 'achievements', percentageClass: 'achievementsPct' },
		{ type: 'miscellaneous', countClass: 'miscellaneous', percentageClass: 'miscellaneousPct' }
	];

	categories.forEach(function(category) {
		let category_count = tweet_array.filter(tweet => tweet.source === category.type).length;

		document.querySelector('.' + category.countClass).innerText = category_count;

		document.querySelector('.' + category.percentageClass).innerText =
			math.format(tweet_array.length === 0 ? 0 : (category_count / tweet_count) * 100, 2) + '%';
	});
}

function displayUserWrittenTweets(tweet_array) {
	let completed_event_tweet_array = tweet_array.filter(tweet => tweet.source === 'completed_event');

	let completed_event_user_written_test_array = completed_event_tweet_array.filter(
		tweet => tweet.written);

	let completed_event_tweet_array_length = completed_event_tweet_array.length;
	document.querySelectorAll('.completedEvents')[1].innerText = completed_event_tweet_array_length;

	let completed_event_user_written_test_array_length = completed_event_user_written_test_array.length
	document.querySelector('.written').innerText = completed_event_user_written_test_array_length;

	document.querySelector('.writtenPct').innerText =
		math.format(completed_event_tweet_array_length === 0 ? 0 : (completed_event_user_written_test_array_length / completed_event_tweet_array_length) * 100, 2) + '%';

}