from sqlalchemy import Column, String, Boolean, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import uuid
from app.models.base import Base, TimestampMixin

class Dealership(Base, TimestampMixin):
    __tablename__ = 'dealerships'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    registration_number = Column(String(100), unique=True, nullable=True) # GST / Trade license
    is_verified = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    branches = relationship('DealershipBranch', back_populates='dealership', cascade='all, delete-orphan')
    listings = relationship('Listing', back_populates='dealership')

class DealershipBranch(Base, TimestampMixin):
    __tablename__ = 'dealership_branches'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dealership_id = Column(UUID(as_uuid=True), ForeignKey('dealerships.id', ondelete='CASCADE'), nullable=False)
    branch_name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    pin_code = Column(String(10), nullable=False, index=True)
    
    # PostGIS Point for geospatial radius search
    location_coordinates = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)

    dealership = relationship('Dealership', back_populates='branches')
