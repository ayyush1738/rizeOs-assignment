# job_match_service.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from sentence_transformers import SentenceTransformer, util
import os
from typing import List

app = FastAPI()

# Load the sentence embedding model
embedding_model = SentenceTransformer("BAAI/bge-large-en-v1.5")

# Retrieve RapidAPI credentials from environment variables
RAPID_API_KEY = os.getenv("RAPID_API_KEY")
RAPID_API_HOST = "jsearch.p.rapidapi.com"

class SearchInput(BaseModel):
    """Defines the expected input model for a job search."""
    query: str
    roles: List[str] = []

@app.post("/search-jobs")
async def search_jobs(data: SearchInput):
    """
    This endpoint receives a search query and a list of roles,
    and returns a list of job matches from the JSearch API.
    """
    search_query = data.query
    if data.roles:
        # Combine the main query with the selected roles for a more targeted search
        search_query += " " + " ".join(data.roles)

    # Fetch jobs from the JSearch RapidAPI
    api_url = f"https://{RAPID_API_HOST}/search"
    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST
    }
    params = {
        "query": search_query,
        "num_pages": "1"
    }

    try:
        response = requests.get(api_url, headers=headers, params=params)
        response.raise_for_status()  # Will raise an HTTPError for unsuccessful status codes
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching jobs from RapidAPI: {e}")

    jobs = response.json().get("data", [])

    if not jobs:
        return {"matches": []}

    # Encode the user's search query for similarity comparison
    query_embedding = embedding_model.encode(search_query, convert_to_tensor=True)

    # Calculate similarity and prepare the list of matched jobs
    matched_jobs = []
    for job in jobs:
        job_description = job.get("job_description", "")
        if job_description:
            job_embedding = embedding_model.encode(job_description, convert_to_tensor=True)
            similarity_score = util.cos_sim(query_embedding, job_embedding).item()

            matched_jobs.append({
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": job.get("job_city"),
                "url": job.get("job_apply_link"),
                "match_score": round(similarity_score * 100, 2)
            })

    # Sort jobs by match score in descending order and return the top 10
    matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return {"matches": matched_jobs[:10]}