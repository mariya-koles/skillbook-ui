export class Course {
    constructor(
        id = null,
        title = '',
        description = '',
        longDescription = '',
        category = '',
        durationMinutes = 0,
        instructor = null,
        startTime = null
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.longDescription = longDescription;
        this.category = category;
        this.durationMinutes = durationMinutes;
        this.instructor = instructor;
        this.startTime = startTime;
    }

    // Method to convert to plain object for JSON serialization
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            longDescription: this.longDescription,
            category: this.category,
            durationMinutes: this.durationMinutes,
            instructor: this.instructor,
            startTime: this.startTime
        };
    }

    // Method to create a Course instance from JSON data
    static fromJSON(json) {
        let startTime = json.startTime;
        // If startTime is an array, convert to JS Date string
        if (Array.isArray(startTime) && startTime.length >= 5) {
            // Java LocalDateTime: [year, month, day, hour, minute]
            // JS Date: months are 0-based, so subtract 1 from month
            const [year, month, day, hour, minute] = startTime;
            startTime = new Date(year, month - 1, day, hour, minute).toISOString();
        }
        return new Course(
            json.id,
            json.title,
            json.description,
            json.longDescription,
            json.category,
            json.durationMinutes,
            json.instructor,
            startTime
        );
    }

    // Helper method to format duration
    getFormattedDuration() {
        const hours = Math.floor(this.durationMinutes / 60);
        const minutes = this.durationMinutes % 60;
        
        if (hours === 0) {
            return `${minutes} minutes`;
        } else if (minutes === 0) {
            return `${hours} hours`;
        } else {
            return `${hours} hours ${minutes} minutes`;
        }
    }

    // Helper method to format start time
    getFormattedStartTime() {
        if (!this.startTime) return 'TBD';
        const date = new Date(this.startTime);
        if (isNaN(date.getTime())) return 'TBD';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
} 