from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from scrapeWebpage import get_text

app = Flask(__name__)

CORS(app)
client = OpenAI()
SUMMARY_QUERY = "summarize a page with these words: "


@app.route("/")
def hello_world():
    print("Testing")
    return "<p>Hello, World!</p>"


@app.route("/summary", methods=["POST"])
def summary():
    try:
        data = request.json
        url = data.get("url")
        if url:
            print("Received URL:", url)
            page_text = get_text(url)
            print("Top 150 words:", page_text)
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": SUMMARY_QUERY + page_text,
                    },
                ],
                max_tokens=50,
            )
            response = completion.choices[0].message
            print(f"GPT 3.5 Response {response.content}")
            return jsonify({"summary": response.content})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})


@app.route("/submit", methods=["POST"])
def submit():
    try:
        data = request.json
        user_input = data["data"]
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": user_input},
            ],
            max_tokens=50,
        )
        result2 = completion.choices[0].message
        print(result2)
        return jsonify({"summary": result2.content})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=5000, debug=True)  # Set debug=False in production
