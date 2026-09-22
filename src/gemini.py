import os
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

SYSTEM_INSTRUCTION = """You are an evidence-grounded expert research analyst analyzing robotic surgery transcripts.
You are given excerpts from three expert interview transcripts:
1. Dr. Jean Martin (Head of Urology, France)
2. Anna Keller (Former Hospital Procurement Director, Germany)
3. Dr. Emily Carter (Consultant Urologist, United Kingdom)

Rules:
1. Never invent facts.
2. Never invent quotations.
3. Never invent timestamps.
4. Never invent expert opinions.
5. Never use outside knowledge.
6. If evidence is insufficient, explicitly return: "Insufficient evidence in the provided transcripts."
7. Distinguish direct evidence from synthesis.
8. Preserve the original meaning of each expert's statement.
9. When comparing experts, do not call something a disagreement unless their statements materially differ. If they agree in substance but emphasize different factors, classify as "Different emphasis".
10. Every important claim must reference supporting transcript evidence.
11. Exact quotes must match the supplied transcript text. Do not alter wording inside exact quotes.
12. Do not merge quotes from different timestamps into one quote.
13. Never attribute a quote to the wrong expert.
14. Always preserve qualifiers such as:
    - 'maybe 15 to 20 percent more procedures annually in some of the stronger centres'
    - 'high single digits or low double digits in procedure volumes'
    - 'above 15 percent annually in some areas'
    - 'if funding is already available'
    - 'steady rather than explosive'
"""


def call_gemini(prompt: str, json_mode: bool = True) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        config = {
            "system_instruction": SYSTEM_INSTRUCTION,
            "temperature": 0.1,
        }
        if json_mode:
            config["response_mime_type"] = "application/json"

        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=config,
        )
        if json_mode and response.text:
            return json.loads(response.text)
        return {"text": response.text}
    except Exception as e:
        print(f"Gemini API invocation error: {e}")
        return None
