from fastapi import APIRouter
from app.api.v1.endpoints import vehicles, auth, locations, dealerships

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & OTP"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles & Discovery"])
api_router.include_router(locations.router, prefix="/locations", tags=["Geospatial & Locations"])
api_router.include_router(dealerships.router, prefix="/dealerships", tags=["Dealership Partners"])
