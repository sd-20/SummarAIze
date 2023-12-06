from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)

CORS(app)
client = OpenAI()

@app.route("/")
def hello_world():
    print("Testing")
    return "<p>Hello, World!</p>"

@app.route('/submit', methods=['POST'])
def submit():

    print("Testing")

    try:
        data = request.json
        user_input = data['data']

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": user_input},
            ],
            max_tokens=50
        )

        result2 = completion.choices[0].message
        print(result2)
        return jsonify({'summary': result2.content})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # Set debug=False in production
