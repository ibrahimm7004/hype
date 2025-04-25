from dateutil import parser
import pytz
from datetime import datetime

# Function to convert any given date or time string to PKT
def convert_to_pkt(date_string):
    # Define Pakistan timezone
    pakistan_tz = pytz.timezone("Asia/Karachi")
    
    # Check if date_string is already in datetime object format
    if isinstance(date_string, datetime):
        # If it's a datetime object, localize it to Pakistan time
        return date_string.astimezone(pakistan_tz)
    
    # Attempt to parse date_string (handles ISO, natural language, etc.)
    try:
        # Try parsing with dateutil's parser (handles a wide range of date formats)
        parsed_date = parser.isoparse(date_string)
    except ValueError:
        raise ValueError("Invalid date string format")
    
    # Convert the parsed date (in UTC by default) to PKT
    if parsed_date.tzinfo is None:
        # If no timezone is provided, assume it is UTC and localize
        parsed_date = pytz.utc.localize(parsed_date)
    
    # Convert to Pakistan Time Zone
    return parsed_date.astimezone(pakistan_tz)

