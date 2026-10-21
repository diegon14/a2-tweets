function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// number of tweets
	const completed_tweets = tweet_array.filter(tweet => tweet.activityType !== 'unknown' && tweet.distance > 0);

	let activity_counts = {};
	let activity_distances = {};

	completed_tweets.forEach(tweet => {
		let type = tweet.activityType;

		activity_counts[type] = (activity_counts[type] || 0) + 1;

		if (!activity_distances[type]) {
			activity_distances[type] = { total: 0, count: 0 };
		}

		activity_distances[type].total += tweet.distance;
		activity_distances[type].count++;
	});

	document.getElementById('numberActivities').innerText = Object.keys(activity_counts).length;

	sorted_activities = Object.keys(activity_counts).sort((a, b) => activity_counts[b] - activity_counts[a]);
	document.getElementById('firstMost').innerText = sorted_activities[0];
	document.getElementById('secondMost').innerText = sorted_activities[1];
	document.getElementById('thirdMost').innerText = sorted_activities[2];

	// distances span
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';

	// longest day
	let weekday_total = 0;
	let weekday_count = 0;
	let weekend_total = 0;
	let weekend_count = 0;

	completed_tweets.forEach(tweet => {
		let day = tweet.time.getDay();

		if (day === 0 || day === 6) {
			weekend_total += tweet.distance;
			weekend_count++;
		} else {
			weekday_total += tweet.distance;
			weekday_count++;
		}
	});

	let weekday_avg = weekday_total / weekday_count;
	let weekend_avg = weekend_total / weekend_count;
	document.getElementById('weekdayOrWeekendLonger').innerText = weekday_avg > weekend_avg ? 'weekdays' : 'weekends';


	displayActivityVis(completed_tweets);

	// array of objects with the top 3 most common activities along with the day of the week and distance for plotting
	let top_three_tweets = completed_tweets
		.filter(tweet => sorted_activities.slice(0, 3).includes(tweet.activityType))
		.map(tweet => ({
			day: tweet.time.toLocaleDateString('en-US', { weekday: 'short' }),
			distance: tweet.distance,
			activityType: tweet.activityType
	}));

	displayDistanceVis(top_three_tweets);
	displayDistanceAggVis(top_three_tweets);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('aggregate');
    const distance_graph_div = document.getElementById('distanceVis');
    const distance_agg_graph_div = document.getElementById('distanceVisAggregated');

	button.innerText = 'Show means';
	distance_graph_div.style.display = 'block';
    distance_agg_graph_div.style.display = 'none';

    if (button && distance_graph_div && distance_agg_graph_div) {
        button.addEventListener('click', function() {
            if (distance_graph_div.style.display === 'none') {
				button.innerText = 'Show means';
                distance_graph_div.style.display = 'block';
                distance_agg_graph_div.style.display = 'none';
            } else {
				button.innerText = 'Show all activities';
                distance_graph_div.style.display = 'none';
                distance_agg_graph_div.style.display = 'block';
            }
        });
    } else {
        console.error("One or more DOM elements could not be found.");
    }
});


function displayActivityVis(completed_tweets){
	activity_vis_spec = {
	  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
	  description: "A graph of the number of Tweets containing each type of activity.",
	  data: {
	    values: completed_tweets.map(tweet => ({activityType: tweet.activityType}))
	  },
	  mark: 'bar',
	  encoding: {
		x: {
			field: 'activityType',
			type: 'nominal',
			title: 'Activity Type'
		},
		y: {
			aggregate: 'count',
			type: 'quantitative',
			title: 'Number of Tweets'
		}
	  }

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
}

function displayDistanceVis(top_three_tweets){
	distance_vis_spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		description: "Distances by day of the week for the three most-tweeted activities.",
		data: {
			values: top_three_tweets
		},
		mark: "point",
		encoding: {
			x: {
				field: "day",
				type: "ordinal",
				title: "Day of the Week",
				sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			y: {
				field: "distance",
				type: "quantitative",
				title: "Distance"
			},
			color: {
				field: "activityType",
				type: "nominal",
				title: "Activity Type"
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
}

function displayDistanceAggVis(top_three_tweets) {
	distance_vis_spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		description: "Distances by day of the week for the three most-tweeted activities.",
		data: {
			values: top_three_tweets
		},
		mark: "point",
		encoding: {
			x: {
				field: "day",
				type: "ordinal",
				title: "Day of the Week",
				sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
			},
			y: {
				field: "distance",
				type: "quantitative",
				aggregate: 'mean',
				title: "Distance"
			},
			color: {
				field: "activityType",
				type: "nominal",
				title: "Activity Type"
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_spec, {actions:false});
}