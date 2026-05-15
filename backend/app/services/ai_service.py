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
        return {"error": "OPENROUTER_API_KEY not set"}

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

            Return format:
            {{
              "summary": "short summary here",
              "action_items": ["item 1", "item 2"],
              "suggested_title": "Suggested Title Here"
            }}

            If there are no action items, return an empty list.

            NOTE:
            {content}
            """

        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash:free",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        return {"error": f"AI failed: {str(e)}"}