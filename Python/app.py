import re
import os
from flask import Flask, jsonify, request
import openai
import requests
import json
import pymongo
from flask_cors import CORS
import spacy
from bson import json_util

app = Flask(__name__)
CORS(app)

openai.api_key = "YOUR KEY"
model = "gpt-3.5-turbo"

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['blog']  # Choose your database (e.g., 'blog')

# Define the blog post collection
blog_collection = db['blog_posts']  # Choose your collection name (e.g., 'blog_posts')

@app.route('/gen_it', methods=['GET'])
def generate_itinerary():
    try:
        string = request.args.get('string')
        destination = request.args.get('destination')
        num_days = int(request.args.get('num_days'))
        summary = request.args.get("summary")
        extracted_destination, extracted_num_days = extract_information(string)
        if extracted_destination:
            destination = extracted_destination
        if extracted_num_days:
            num_days = extracted_num_days
        destination_changed = (destination != request.args.get('destination'))
        prompt = f"Changes: {string}\n"
        if destination_changed:
            prompt += f"Make itinerary for {num_days} days in {destination}\n"
        else:
            prompt += f"Make itinerary for {num_days} days in {destination}\n"
            # prompt += f" Earlier itinerary Summary: {summary}\n"
        prompt += "Generate itinerary day wise in detail with headings like DAY 1: Place 1, Place 2, Place 3\n"
        prompt += "Make sure the heading's DAY is in capital only rest everything normal\n"
        prompt += "Each line should have small paragraphic details\n"
        # prompt += "Also give a summary in the extreme end (after complete itinerary for all days) including just the name of all places visited. Format: Day 1: Place 1, Place 2, Place 3 in 1 line with heading SUMMARY:\n"
        prompt += "Detailed and strictly follow the format specified.\n"
        prompt += "Give me max words 300\n"
        prompt += "give in bullet points"
        prompt += "don't add extra notes"
        print(prompt)
        print(" ")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "system", "content": "You are a helpful travel planner."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
            timeout=2
        )
        itinerary = response.choices[0].message['content'].strip()
        print(itinerary)
        # itinerary_split = itinerary.split('DAY ')
        itinerary_split = re.findall(r'(DAY? \d.*?)\s*(?=(?:DAY? \d|\Z))', itinerary, re.IGNORECASE | re.DOTALL)
        
        # itinerary_days = []
        # num = [str(i) for i in range(1, 16)]
        # for i in num:
        #     pattern = re.compile(f'Day {i}:', re.IGNORECASE)
        #     if re.search(pattern, itinerary):
        #         day_split = re.split(pattern, itinerary)
        #         itinerary_days.extend(day_split)
        # print("it_day: ",itinerary_days)
        # itinerary_split = [day.strip() for day in itinerary_days if day.strip()]
        # print("it_split: ",itinerary_split)
        
        # # itinerary_split = re.split(r'DAY \d+:', itinerary, flags=re.IGNORECASE)
        # for variation in ["SUMMARY:", "summary:", "Summary:"]:
        #     if variation in itinerary:
        #         sum = itinerary.split(variation)
        #         break
        itinerary_days = itinerary_split[0:]
        response_data = {
            "destination": destination,
            "num_days": num_days,
            "id": 9,
            "it": [],
            "summary": "",
            "header_image": ""
        }
        # response_data["summary"] = ' '.join(sum[1:])
        for i in range(num_days):
            day_data = {
                "day": f"Day {i+1}",
                "activities": [],
                "description": {},
                "image": ""
            }
            if i <= len(itinerary_days):
                day_activities = itinerary_days[i].strip().split('\n')
                k = day_activities[0]
                a = k.split(':')
                day_activities[0] = a[1]
                # for variation in ["SUMMARY:", "summary:", "Summary:"]:
                #     if variation in day_activities:
                #         summary_index = day_activities.index(variation)
                #         day_activities = day_activities[:summary_index]
                activities = [activity.strip()
                              for activity in day_activities[0].split(',')]
                day_data['activities'] = activities
                for j in range(len(activities)):
                    a = activities[j]
                    for activity in day_activities[1:]:
                        if activity:
                            if 'chatbot' in activity.lower() or 'chatgpt' in activity.lower():
                                raise ValueError("Error: Invalid activity. Please try again.")
                    day_data['description'][a] = [
                        activity for activity in day_activities[1:] if activity]
            response_data["it"].append(day_data)
        images = get_images(destination)
        for i, day in enumerate(response_data["it"]):
            if i < len(images):
                day["image"] = images[i]
        response_data["header_image"] = images[9]
        return jsonify(response_data)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

def get_images(location):
    url = 'https://api.unsplash.com/search/photos'
    headers = {
        'Accept-Version': 'v1',
        'Authorization': f'Client-ID Tc2sZLtfIUiVdZwP5mQZQe_0dQbF5d9ek5CSc8KP5TU'
    }
    params = {
        'query': location,
        'per_page': 10
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    image_urls = [result['urls']['regular'] for result in data['results']]
    return image_urls

def extract_information(string):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(string)
    destination = None
    num_days = None

    num_mapping = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9
    }
    india_states_cities = [
    "andhra pradesh", "visakhapatnam", "vijayawada", "guntur", "tirupati", "rajahmundry",
    "arunachal pradesh", "itanagar", "tawang", "naharlagun",
    "assam", "guwahati", "silchar", "dibrugarh", "tezpur",
    "bihar", "patna", "gaya", "muzaffarpur", "bhagalpur",
    "chhattisgarh", "raipur", "bhilai", "bilaspur",
    "goa", "panaji", "vasco da gama", "margao",
    "gujarat", "ahmedabad", "surat", "vadodara", "rajkot",
    "haryana", "chandigarh", "faridabad", "gurgaon", "panipat",
    "himachal pradesh", "shimla", "manali", "dharamshala",
    "jharkhand", "ranchi", "jamshedpur", "dhanbad",
    "karnataka", "bengaluru", "mysuru", "hubli", "mangaluru",
    "kerala", "thiruvananthapuram", "kochi", "kozhikode", "thrissur",
    "madhya pradesh", "bhopal", "indore", "gwalior", "jabalpur",
    "maharashtra", "mumbai", "pune", "nagpur", "thane",
    "manipur", "imphal", "thoubal", "bishnupur",
    "meghalaya", "shillong", "tura", "nongpoh",
    "mizoram", "aizawl", "lunglei", "champhai",
    "nagaland", "kohima", "dimapur", "wokha", "mauritius"
    "odisha", "bhubaneswar", "cuttack", "rourkela",
    "punjab", "chandigarh", "ludhiana", "amritsar",
    "rajasthan", "jaipur", "jodhpur", "udaipur", "kota",
    "sikkim", "gangtok", "namchi", "gyalshing",
    "tamil nadu", "chennai", "coimbatore", "madurai", "salem",
    "telangana", "hyderabad", "warangal", "karimnagar",
    "tripura", "agartala", "dharmanagar", "kailasahar",
    "uttar pradesh", "lucknow", "kanpur", "varanasi", "agra","noida", "ghaziabad",
    "uttarakhand", "dehradun", "haridwar", "roorkee",
    "west bengal", "kolkata", "howrah", "asansol", "siliguri", "delhi", "new delhi"
    "afghanistan", "kabul", "herat", "kandahar",
    "albania", "tirana", "durres", "vlore",
    "algeria", "algiers", "oran", "constantine",
    "andorra", "andorra la vella", "escaldes-engordany",
    "angola", "luanda", "lobito", "huambo",
    "argentina", "buenos aires", "cordoba", "rosario",
    "armenia", "yerevan", "gyumri", "vanadzor",
    "australia", "sydney", "melbourne", "brisbane",
    "austria", "vienna", "graz", "salzburg",
    "azerbaijan", "baku", "ganja", "sumqayit",
    "bahamas", "nassau", "freeport", "abaco islands",
    "bahrain", "manama", "muharraq", "rifar",
    "bangladesh", "dhaka", "chittagong", "khulna",
    "barbados", "bridgetown", "speightstown", "holetown",
    "belarus", "minsk", "gomel", "mogilev",
    "belgium", "brussels", "antwerp", "ghent",
    "belize", "belmopan", "san ignacio", "orange walk",
    "benin", "porto-novo", "cotonou", "parakou",
    "bhutan", "thimphu", "punakha", "paro",
    "bolivia", "sucre", "la paz", "santa cruz",
    "bosnia and herzegovina", "sarajevo", "banja luka", "tuzla",
    "botswana", "gaborone", "francistown", "maun",
    "brazil", "rio de janeiro", "sao paulo", "salvador",
    "brunei", "bandar seri begawan", "kuala belait", "seria",
    "bulgaria", "sofia", "plovdiv", "varna",
    "burkina faso", "ouagadougou", "bobodioulasso", "koudougou",
    "burundi", "bujumbura", "gitega", "rumonge",
    "cambodia", "phnom penh", "siem reap", "battambang",
    "cameroon", "yaounde", "douala", "bamenda",
    "canada", "ottawa", "toronto", "vancouver",
    "cape verde", "praia", "mindelo", "sao filipe",
    "central african republic", "bangui", "bimbo", "bambari",
    "chad", "n'djamena", "moundou", "sagh",
    "chile", "santiago", "valparaiso", "concepcion",
    "china", "beijing", "shanghai", "guangzhou",
    "colombia", "bogota", "medellin", "cali",
    "comoros", "moroni", "mutsamudu", "fomboni",
    "congo", "kinshasa", "lubumbashi", "mbuji-mayi",
    "costa rica", "san jose", "limon", "alajuela",
    "croatia", "zagreb", "split", "rijeka",
    "cuba", "havana", "santiago de cuba", "camaguey",
    "cyprus", "nicosia", "limassol", "larnaca",
    "czech republic", "prague", "brno", "ostrava",
    "denmark", "copenhagen", "aarhus", "odense",
    "djibouti", "djibouti", "ali sabieh", "tadjoura",
    "dominica", "roseau", "portsmouth", "marigot",
    "dominican republic", "santo domingo", "santiago", "la romana",
    "east timor", "dili", "baucau", "maliana",
    "ecuador", "quito", "guayaquil", "cuenca",
    "egypt", "cairo", "alexandria", "giza",
    "el salvador", "san salvador", "santa ana", "soyapango",
    "equatorial guinea", "malabo", "bata", "eko",
    "eritrea", "asmara", "massawa", "keren",
    "estonia", "tallinn", "tartu", "narva",
    "ethiopia", "addis ababa", "dire dawa", "mekelle",
    "fiji", "suva", "nadi", "lautoka",
    "finland", "helsinki", "espoo", "tampere",
    "france", "paris", "marseille", "lyon",
    "gabon", "libreville", "port-gentil", "masuku",
    "gambia", "banjul", "serrekunda", "brikama",
    "georgia", "tbilisi", "kutaisi", "batumi",
    "germany", "berlin", "hamburg", "munich",
    "ghana", "accra", "kumasi", "tamale",
    "greece", "athens", "thessaloniki", "patras",
    "grenada", "st. george's", "grenville", "sauteurs",
    "guatemala", "guatemala city", "mixco", "villa nueva",
    "guinea", "conakry", "nzerekore", "kindia",
    "guinea-bissau", "bissau", "bafata", "gabu",
    "guyana", "georgetown", "linden", "new amsterdam",
    "haiti", "port-au-prince", "carrefour", "delmas",
    "honduras", "tegucigalpa", "san pedro sula", "choloma",
    "hungary", "budapest", "debrecen", "szeged",
    "iceland", "reykjavik", "kopavogur", "hafnarfjordur",
    "india",
    "indonesia", "jakarta", "surabaya", "bandung",
    "iran", "tehran", "mashhad", "isfahan",
    "iraq", "baghdad", "mosul", "basra",
    "ireland", "dublin", "cork", "galway",
    "israel", "jerusalem", "tel aviv", "haifa",
    "italy", "rome", "milan", "naples",
    "jamaica", "kingston", "montego bay", "mandeville",
    "japan", "tokyo", "osaka", "kyoto",
    "jordan", "amman", "zarqa", "irbid",
    "kazakhstan", "almaty", "nur-sultan", "shymkent",
    "kenya", "nairobi", "mombasa", "kisumu",
    "kiribati", "tarawa", "betio", "bikenibeu",
    "north korea", "pyongyang", "chongjin", "hamhung",
    "south korea", "seoul", "busan", "incheon",
    "kosovo", "pristina", "peje", "prizren",
    "kuwait", "kuwait city", "al ahmadi", "hawalli",
    "kyrgyzstan", "bishkek", "osh", "jalalabad",
    "laos", "vientiane", "savannakhet", "luang prabang",
    "latvia", "riga", "daugavpils", "liepaja",
    "lebanon", "beirut", "tripoli", "sidon",
    "lesotho", "maseru", "tysowane", "leribe",
    "liberia", "monrovia", "gbarnga", "buchanan",
    "libya", "tripoli", "benghazi", "misrata",
    "liechtenstein", "vaduz", "schaan", "triesen",
    "lithuania", "vilnius", "kaunas", "klaipeda",
    "luxembourg", "luxembourg city", "esch-sur-alzette", "differdange",
    "macedonia", "skopje", "bitola", "kumanovo",
    "madagascar", "antananarivo", "toamasina", "antsirabe",
    "malawi", "lilongwe", "blantyre", "mzuzu",
    "malaysia", "kuala lumpur", "george town", "johor bahru",
    "maldives", "male", "addu city", "fuvahmulah",
    "mali", "bamako", "sikasso", "segou",
    "malta", "valletta", "birkirkara", "qormi",
    "marshall islands", "majuro", "ebeye", "arno",
    "mauritania", "nouakchott", "nouadhibou", "kiffa",
    "mauritius", "port louis", "vacoas", "curepipe",
    "mexico", "mexico city", "guadalajara", "monterrey",
    "micronesia", "palikir", "weno", "kolonia",
    "moldova", "chisinau", "balti", "tiraspol",
    "monaco", "monaco", "monte carlo", "la condamine",
    "mongolia", "ulaanbaatar", "erdenet", "darkhan",
    "montenegro", "podgorica", "niksic", "pljevlja",
    "morocco", "rabat", "casablanca", "fes",
    "mozambique", "maputo", "matola", "beira",
    "myanmar", "naypyidaw", "yangon", "mandalay",
    "namibia", "windhoek", "riemanns", "walvis bay",
    "nauru", "yaren", "denigomodu", "meneng",
    "nepal", "kathmandu", "pokhara", "lalitpur",
    "netherlands", "amsterdam", "rotterdam", "the hague",
    "new zealand", "wellington", "auckland", "christchurch",
    "nicaragua", "managua", "leon", "masaya",
    "niger", "niamey", "zinder", "maradi",
    "nigeria", "abuja", "lagos", "kano",
    "norway", "oslo", "bergen", "trondheim",
    "oman", "muscat", "seeb", "salalah",
    "pakistan", "islamabad", "karachi", "lahore",
    "palau", "ngerulmud", "koror", "meketii",
    "palestine", "jerusalem", "gaza", "ramallah",
    "panama", "panama city", "san miguelito", "tocumen",
    "papua new guinea", "port moresby", "lae", "madang",
    "paraguay", "asuncion", "ciudad del este", "san lorenzo",
    "peru", "lima", "arequipa", "trujillo",
    "philippines", "manila", "quezon city", "davao city",
    "poland", "warsaw", "krakow", "lodz",
    "portugal", "lisbon", "porto", "vila nova de gaia",
    "qatar"
]


    for entity in doc.ents:
        if entity.label_ == "GPE":  # Geopolitical Entity (location)
            destination = entity.text
            break
    for token in doc:
        if token.like_num:
            try:
                num_days = int(token.text)                
            except ValueError:
                if token.text.lower() in num_mapping:
                    num_days = num_mapping[token.text.lower()]
            break
        
    # if destination:
    #     for item in india_states_cities:
    #         if item.lower() in destination.lower():
    #             destination = item
    #             break
    if not destination:
        for token in doc:
            if token.text.lower() in india_states_cities:
                destination = token.text
                break

    return destination, num_days

@app.route('/predef_itinerary', methods=['GET'])
def predef_itinerary():
    try:
        destination = request.args.get('destination')
        with open('Python/predefit.json') as json_file:
            data = json.load(json_file)
            if destination in data:
                return jsonify(data[destination])
            else:
                return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/details', methods=['GET'])
def details():
    try:
        with open('Python/details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/initial_details', methods=['GET'])
def initial_details():
    try:
        with open('Python/initial_details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    # search_text = request.args.get('text')
    client = pymongo.MongoClient("mongodb://localhost:27017/") #add connection string
    db1 = client['Autofill']
    collection1 = db1['countries']
    with open('Python\country_name.txt', 'r') as file:
        country_names = file.read().splitlines()
    for country in country_names:
        existing_country = collection1.find_one({'name': country})
        if existing_country is None:
            collection1.insert_one({'name': country})
    # query = { 'name': { '$regex': '^' + search_text, '$options': 'i' } }
    # countries = collection.find(query)#.limit(5)
    suggestions = [country['name'] for country in collection1.find({})]
    return jsonify(suggestions)


@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data['title']
    content = data['content']

    # Increment the counter and get the next ID
    counter = db['counters'].find_one_and_update(
        {"_id": "blogpost"}, {"$inc": {"count": 1}}, upsert=True, return_document=True
    )

    next_id = counter['count']

    post = {"post_id": next_id, "title": title, "content": content}
    blog_collection.insert_one(post)

    return jsonify({'message': 'Post created successfully'})

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = list(blog_collection.find())

    serialized_posts = json_util.dumps(posts)
    # Return the JSON response
    return serialized_posts, 200, {'Content-Type': 'application/json'}

@app.route('/api/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    post = blog_collection.find_one({"post_id": int(post_id)})
    if post:

        serialized_posts = json_util.dumps(post)
    # Return the JSON response
        return serialized_posts, 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({'message': 'Post not found'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
