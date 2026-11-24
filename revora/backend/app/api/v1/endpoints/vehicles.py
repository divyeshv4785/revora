from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.schemas.vehicle import VehiclePublicPreview, VehicleFilterParams

router = APIRouter()

@router.get("/public-preview", response_model=List[VehiclePublicPreview])
def get_public_preview_listings(
    keyword: Optional[str] = Query(None, description="Search keyword"),
    location: Optional[str] = Query(None, description="City or State"),
    brand: Optional[str] = Query(None, description="Manufacturer/Make"),
    model: Optional[str] = Query(None, description="Model variant"),
    min_price: Optional[float] = Query(None, description="Minimum price in INR"),
    max_price: Optional[float] = Query(None, description="Maximum price in INR"),
    fuel_type: Optional[str] = Query(None, description="Petrol, Diesel, CNG, Electric, Hybrid"),
    transmission: Optional[str] = Query(None, description="Manual or Automatic"),
    sort_by: Optional[str] = Query("relevance", description="relevance, newest, price_asc, price_desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50)
):
    """
    Public discovery endpoint. Returns approved and available listings only.
    Sensitive documents (RC, Chassis, Owner contact) are masked.
    """
    return []

@router.get("/featured", response_model=List[VehiclePublicPreview])
def get_featured_vehicles():
    """
    Handpicked public showcase listings.
    """
    return []

@router.get("/recent", response_model=List[VehiclePublicPreview])
def get_recent_vehicles():
    """
    Fresh arrivals listed within the last 48 hours.
    """
    return []
