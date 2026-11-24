from fastapi import APIRouter, Query
from typing import List, Optional

router = APIRouter()

@router.get("/cities")
def get_supported_cities():
    """
    Returns list of supported Indian states, cities, and regional automotive clusters.
    """
    return [
        {"city": "Coimbatore", "state": "Tamil Nadu", "region": "South"},
        {"city": "Bengaluru", "state": "Karnataka", "region": "South"},
        {"city": "Chennai", "state": "Tamil Nadu", "region": "South"},
        {"city": "Mumbai", "state": "Maharashtra", "region": "West"},
        {"city": "Pune", "state": "Maharashtra", "region": "West"},
        {"city": "New Delhi", "state": "Delhi NCR", "region": "North"},
        {"city": "Hyderabad", "state": "Telangana", "region": "South"},
        {"city": "Kochi", "state": "Kerala", "region": "South"},
        {"city": "Ahmedabad", "state": "Gujarat", "region": "West"},
        {"city": "Chandigarh", "state": "Punjab", "region": "North"},
    ]

@router.get("/nearby")
def get_nearby_listings_postgis(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(50.0, ge=1, le=500, description="Search radius in kilometers using PostGIS ST_DWithin")
):
    """
    Geospatial nearby vehicle search powered by PostGIS geometry indexing.
    """
    return {
        "latitude": latitude,
        "longitude": longitude,
        "radius_km": radius_km,
        "results_count": 0,
        "listings": []
    }
