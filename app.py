import requests
from flask import Flask, render_template, jsonify

app = Flask(__name__)

def fetch_data():
    url = "https://leetcode.com/contest/api/ranking/weekly-contest-379/?pagination=1&region=global"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route('/')
def get_text():
    return jsonify({"text": "My Name is Atanu Nayak."})

@app.route('/get_data')
def get_data():
    data = fetch_data()
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Failed to fetch data"})

if __name__ == '__main__':
    app.run(debug=True)
