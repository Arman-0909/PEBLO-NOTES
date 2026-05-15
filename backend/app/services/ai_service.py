import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


def generate_note_ai(content: str) -> dict:

    if not os.getenv("OPENROUTER_API_KEY"):
        return {
            "error": "OPENROUTER_API_KEY not set"
        }

    try:

        prompt = f"""
            You are an AI note summarizer.

            Your task:
            - Read the note carefully
            - Create a SHORT concise summary
            - Maximum 1-2 sentences
            - Reduce unnecessary detail
            - DO NOT rewrite the full note
            - DO NOT paraphrase line-by-line
            - Compress the meaning

            Return ONLY valid JSON.

            Example:
            {{
            "summary": "your summary here"
            }}

            NOTE:
            {content}
            """

        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash:free",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            response_format={
                "type": "json_object"
            }
        )

        result = response.choices[0].message.content

        return json.loads(result)

    except Exception as e:
        return {
            "error": f"AI failed: {str(e)}"
        }