import re
import os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import openai
import requests
import json


app = Flask(__name__)
CORS(app)

# Initialize OpenAI GPT-3.5 Turbo
openai.api_key = "OPENAI_API_KEY"
model = "gpt-3.5-turbo"


@app.route('/')
def index():
    return "Welcome to the API!"


@app.route('/gen_it', methods=['GET'])
def generate_itinerary():
    try:
        string = request.args.get('string')
        destination = request.args.get('destination')
        num_days = int(request.args.get('num_days'))
        summary = request.args.get("summary")
        print(num_days)
        print(destination)
        extracted_destination, extracted_num_days = extract_information(string)
        
        # Update destination and num_days if extracted
        if extracted_destination:
            destination = extracted_destination
        if extracted_num_days:
            num_days = extracted_num_days
        destination_changed = (destination != request.args.get('destination'))
        prompt = f"Preexisting Itinerary: {summary}\n"
        prompt = f"Changes: {string}\n"
        if destination_changed:
            prompt = f"Make itinerary for {num_days} days in {destination}\n"
        else:
            prompt = f"Make itinerary for {num_days} days in {destination}\n"
            prompt += f" Earlier itinerary Summary: {summary}\n"
        
        # prompt = f"Preexisting Itinerary: {summary}\n"
        prompt += f"Changes: {string}\n"
        prompt += f"Make itinerary for {num_days} days in {destination}\n"
        prompt += "Generate itinerary day wise in detail with headings like DAY 1: Arrival in Destination\n, DAY 2: Sightseeing in Destination\n, DAY 3: Departure from Destination\n"
        prompt += "Make sure the heading's DAY is in capital only rest everything normal\n"
        prompt += "Each line should have small paragraphic details\n"
        prompt += "Also give a summary in the extreme end (after complete itinerary for all days) including just the name of all places visited. Format: Day 1: Place 1, Place 2, Place 3 in 1 line with heading SUMMARY:\n"
        prompt += "Detailed and strictly follow the format specified."
        prompt += "Give me. Max words 300"
        prompt += "give in bullet points"
        from datetime import datetime
        now = datetime.now()
        print("now =", now)
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        print("date and time =", dt_string)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "system", "content": "You are a helpful travel planner."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
            # timeout=2
        )
        itinerary = response.choices[0].message['content'].strip()
        now = datetime.now()
        print("now =", now)
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        print("date and time =", dt_string)
        print(itinerary)
        
        # Split itinerary into separate days
        itinerary_split = itinerary.split('DAY ')
        for variation in ["SUMMARY:", "summary:", "Summary:"]:
            if variation in itinerary:
                sum = itinerary.split(variation)
                break

        # Skip the first element since it doesn't contain a day
        itinerary_days = itinerary_split[1:]
        response_data = {
            "destination": destination,
            "num_days": num_days,
            "id": 9,
            "it": [],
            "summary": [],
            "header_image": ""
            # "summary": summary
        }
        response_data["summary"] = sum[1:]

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
                #         day_activities.remove(variation)
                for variation in ["SUMMARY:", "summary:", "Summary:"]:
                    if variation in day_activities:
                        summary_index = day_activities.index(variation)
                        day_activities = day_activities[:summary_index]
                        # day_activities.remove(variation)

                activities = [activity.strip()
                              for activity in day_activities[0].split(',')]
                day_data['activities'] = activities
                for j in range(len(activities)):
                    a = activities[j]
                    day_data['description'][a] = [
                        activity for activity in day_activities[1:] if activity]
            response_data["it"].append(day_data)

        # Get images for the destination
        images = get_images(destination)

        # Assign images to each day
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

import spacy

def extract_information(string):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(string)
    
    destination = None
    num_days = None
    
    # Extract destination
    for entity in doc.ents:
        if entity.label_ == "GPE":  # Geopolitical Entity (location)
            destination = entity.text
            break
    
    # Extract number of days
    for token in doc:
        if token.like_num:
            num_days = int(token.text)
            break
    
    return destination, num_days


@app.route('/predef_itinerary', methods=['GET'])
def predef_itinerary():
    try:
        # Get user input from request
        destination = request.args.get('destination')
        with open('TravelCompanion\Python\predefit.json') as json_file:
            data = json.load(json_file)
            if destination in data:
                return jsonify(data[destination])
            else:
                return jsonify(data)
    except Exception as e:
        # Handle any exceptions or errors
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/details', methods=['GET'])
def details():
    try:
        with open('TravelCompanion\Python\details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)

    except Exception as e:
        # Handle any exceptions or errors
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500


@app.route('/initial_details', methods=['GET'])
def initial_details():
    try:
        with open('TravelCompanion\Python\initial_details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)

    except Exception as e:
        # Handle any exceptions or errors
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

# import mysql.connector

# connection = mysql.connector.connect(
#     host="localhost",
#     user="try",
#     password="try_1234",
#     database="autofill"
# )
# @app.route('/autocomplete')
# def autocomplete():
#     user_input = request.args.get('query')

#     # Query the MySQL database to retrieve matching country names
#     cursor = connection.cursor()
#     cursor.execute("SELECT name FROM countries WHERE name LIKE %s", (f"{user_input}%",))

#     results = cursor.fetchall()
#     country_names = [result[0] for result in results]

#     return jsonify(country_names)
import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['Autofill']
collection = db['countries']
# insert = [
#         {'name': 'Afghanistan'},
#         {'name': 'Albania'},
#         {'name': 'Algeria'},
#         {'name': 'Andorra'},
#         {'name': 'Angola'},
#         {'name': 'Antigua and Barbuda'},
#         {'name': 'Argentina'},
#         {'name': 'Armenia'},
#         {'name': 'Australia'},
#         {'name': 'Austria'},
#         {'name': 'Azerbaijan'},
#         {'name': 'Bahamas'},
#         {'name': 'Bahrain'},
#         {'name': 'Bangladesh'},
#         {'name': 'Barbados'},
#         {'name': 'Belarus'},
#         {'name': 'Belgium'},
#         {'name': 'Belize'},
#         {'name': 'Benin'},
#         {'name': 'Bhutan'},
#         {'name': 'Bolivia'},
#         {'name': 'Bosnia and Herzegovina'},
#         {'name': 'Botswana'},
#         {'name': 'Brazil'},
#         {'name': 'Brunei'},
#         {'name': 'Bulgaria'},
#         {'name': 'Burkina Faso'},
#         {'name': 'Burundi'},
#         {'name': 'Cabo Verde'},
#         {'name': 'Cambodia'},
#         {'name': 'Cameroon'},
#         {'name': 'Canada'},
#         {'name': 'Central African Republic'},
#         {'name': 'Chad'},
#         {'name': 'Chile'},
#         {'name': 'China'},
#         {'name': 'Colombia'},
#         {'name': 'Comoros'},
#         {'name': 'Congo, Democratic Republic of the'},
#         {'name': 'Congo, Republic of the'},
#         {'name': 'Costa Rica'},
#         {'name': 'Côte d’Ivoire'},
#         {'name': 'Croatia'},
#         {'name': 'Cuba'},
#         {'name': 'Cyprus'},
#         {'name': 'Czech Republic'},
#         {'name': 'Denmark'},
#         {'name': 'Djibouti'},
#         {'name': 'Dominica'},
#         {'name': 'Dominican Republic'},
#         {'name': 'East Timor (Timor-Leste)'},
#         {'name': 'Ecuador'},
#         {'name': 'Egypt'},
#         {'name': 'El Salvador'},
#         {'name': 'Equatorial Guinea'},
#         {'name': 'Eritrea'},
#         {'name': 'Estonia'},
#         {'name': 'Eswatini'},
#         {'name': 'Ethiopia'},
#         {'name': 'Fiji'},
#         {'name': 'Finland'},
#         {'name': 'France'},
#         {'name': 'Gabon'},
#         {'name': 'The Gambia'},
#         {'name': 'Georgia'},
#         {'name': 'Germany'},
#         {'name': 'Ghana'},
#         {'name': 'Greece'},
#         {'name': 'Grenada'},
#         {'name': 'Guatemala'},
#         {'name': 'Guinea'},
#         {'name': 'Guinea-Bissau'},
#         {'name': 'Guyana'},
#         {'name': 'Haiti'},
#         {'name': 'Honduras'},
#         {'name': 'Hungary'},
#         {'name': 'Iceland'},
#         {'name': 'India'},
#         {'name': 'Indonesia'},
#         {'name': 'Iran'},
#         {'name': 'Iraq'},
#         {'name': 'Ireland'},
#         {'name': 'Paris'},
#         {'name': 'Rome'},
#         {'name': 'Tokyo'},
#         {'name': 'Japan'},
#         {'name': 'London'}
#     ]
# collection.insert_many(insert)
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    search_text = request.args.get('text')
    query = { 'name': { '$regex': '^' + search_text, '$options': 'i' } }
    countries = collection.find(query).limit(5)  # Limit to 10 suggestions
    suggestions = [country['name'] for country in countries]
    return jsonify(suggestions)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
