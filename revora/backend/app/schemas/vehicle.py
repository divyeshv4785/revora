from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class VehiclePublicPreview(BaseModel):
    id: UUID
    make: str
    model: str
    variant: str
    registration_year: int
    kilometres_driven: int
    fuel_type: str
    transmission: str
    asking_price_inr: float
    location: str
    city: str
    state: str
    seller_type: str
    seller_name: str
    is_verified: bool
    is_recent: Optional[bool] = False
    is_featured: Optional[bool] = False
    image_url: str
    badge: Optional[str] = None

    class Config:
        from_attributes = True

class VehicleFilterParams(BaseModel):
    keyword: Optional[str] = None
    location: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    sort_by: Optional[str] = 'relevance'
    page: int = 1
    page_size: int = 12
