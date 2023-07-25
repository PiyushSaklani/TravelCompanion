import re
itinerary = "DAY 1 this is first day. DAY 2 this is second day. DAY 3 this is third day. DAY 4 it is a good day with kids."
itinerary_split = re.findall(r'(DAY? \d.*?)\s*(?=(?:DAY? \d|\Z))', itinerary, re.IGNORECASE | re.DOTALL)
for day_string in itinerary_split:
    print(day_string)