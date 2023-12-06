# api to format/send requests to the OpenAI API, and handle responses

from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "Hello, you are testing."},
    {"role": "user", "content": "Hello, what is your name"}
  ]
)

print(completion.choices[0].message)