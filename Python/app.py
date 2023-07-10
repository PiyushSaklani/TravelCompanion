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
openai.api_key = "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"
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
        print("destination:")
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
        prompt += "Generate itinerary day wise in detail with headings like DAY 1: Arrival in Destination\n"
        prompt += "Make sure the heading's DAY is in capital only rest everything normal\n"
        prompt += "If word Day anywhere else in itinerary make it all lowercase like day\n"
        prompt += "Each line should have small paragraphic details\n"
        prompt += "Also give a summary in the extreme end (after complete itinerary for all days) including just the name of all places visited. Format: Day 1: Place 1, Place 2, Place 3 in 1 line with heading SUMMARY:\n"
        prompt += "Detailed and strictly follow the format specified."
        prompt += "Give me. Max words 700"

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
        with open('Python/predefit.json') as json_file:
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
        with open('Python/details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)

    except Exception as e:
        # Handle any exceptions or errors
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500


@app.route('/initial_details', methods=['GET'])
def initial_details():
    try:
        with open('Python/initial_details.json') as json_file:
            data = json.load(json_file)
            return jsonify(data)

    except Exception as e:
        # Handle any exceptions or errors
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
