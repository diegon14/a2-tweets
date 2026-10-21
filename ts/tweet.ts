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

        let text = this.text.toLowerCase();
        
        switch (true){
            case text.includes('run '):
                return 'run';

            case text.includes('walk '):
                return 'walk';

            case text.includes('bike '):
                return 'bike';

            case text.includes('hike '):
                return 'hike';
            
            case text.includes('swim '):
                return 'swim';
            
            case text.includes('elliptical '):
                return 'elliptical';    

            case text.includes('skate '):
                return 'skate';
        }
            
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        let start = this.text.search(/[0-9]/);
        if (start == -1) {
            return 0;
        }

        let end = start;
        while (end < this.text.length &&
            (this.text[end] >= '0' && this.text[end] <= '9' || this.text[end] == '.')) {
            end++;
        }

        let value = Number(this.text.substring(start, end));
        let text = this.text.toLowerCase();

        if (text.includes('km') ||
            text.includes('kilometer') ||
            text.indexOf('kilometre') ) {
            return value / 1.609;
        }

        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        const linkifyText = (text:string) => {
            const regex = /(https?:\/\/[^\s]+)/g;
            return text.replace(regex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        }

        const displayedText:string = linkifyText(this.text);

        return `
            <tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${displayedText}</td>
            </tr>
        `;
    }
}