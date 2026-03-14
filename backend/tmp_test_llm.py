import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

load_dotenv()

def test_initialization():
    print("Testing LLM Initialization...")
    
    # 1. Test Gemini Init
    try:
        gemini = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
        print("✅ Gemini initialized successfully.")
    except Exception as e:
        print(f"❌ Gemini initialization failed: {e}")

    # 2. Test Groq Init
    try:
        groq = ChatGroq(model="llama-3.3-70b-versatile")
        print("✅ Groq initialized successfully.")
    except Exception as e:
        print(f"❌ Groq initialization failed: {e}")

    # 3. Test Fallback logic structure
    try:
        combined = gemini.with_fallbacks([groq])
        print("✅ Combined fallback LLM created successfully.")
    except Exception as e:
        print(f"❌ Fallback creation failed: {e}")

if __name__ == "__main__":
    test_initialization()
