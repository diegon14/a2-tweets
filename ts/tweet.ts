class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed ") || this.text.startsWith("Just posted ") ||
	        this.text.startsWith("I just ran ")) {
	        return "completed_event";
	    }
	    if (this.text.startsWith("Watch my ")) {
	        return "live_event";
	    }
	    if (this.text.startsWith("Achieved a new personal record") ||
	        this.text.startsWith("I just set a goal")) {
	        return "achievement";
	    }
	    return "miscellaneous";
	}

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes('-')) {
            return true;
        }

        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        
        return this.text.substring(this.text.indexOf('-'), this.text.indexOf('https://'));
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}