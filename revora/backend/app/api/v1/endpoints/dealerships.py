from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get("/verified-network")
def get_verified_dealerships():
    """
    Returns verified dealership partners and branch locations.
    """
    return [
        {
            "id": "deal-01",
            "name": "Kovai Autohaus",
            "location": "Avinashi Road, Coimbatore, Tamil Nadu",
            "city": "Coimbatore",
            "state": "Tamil Nadu",
            "vehicle_count": 48,
            "is_verified": True,
            "rating": 4.9,
            "brands": ["Toyota", "Honda", "Lexus"]
        },
        {
            "id": "deal-02",
            "name": "Apex Prestige Motors",
            "location": "BKC, Bandra East, Mumbai, Maharashtra",
            "city": "Mumbai",
            "state": "Maharashtra",
            "vehicle_count": 64,
            "is_verified": True,
            "rating": 4.8,
            "brands": ["BMW", "Mercedes-Benz", "Audi", "Porsche"]
        },
        {
            "id": "deal-03",
            "name": "Bangalore Motor Works",
            "location": "Indiranagar, Bengaluru, Karnataka",
            "city": "Bengaluru",
            "state": "Karnataka",
            "vehicle_count": 52,
            "is_verified": True,
            "rating": 4.9,
            "brands": ["Tata", "Hyundai", "Volkswagen", "Skoda"]
        }
    ]
