from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.models.base import Base, TimestampMixin

class ListingApprovalState(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_CORRECTION = "needs_correction"

class ListingAvailabilityState(str, enum.Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"

class FuelTypeEnum(str, enum.Enum):
    PETROL = "Petrol"
    DIESEL = "Diesel"
    CNG = "CNG"
    ELECTRIC = "Electric"
    HYBRID = "Hybrid"

class TransmissionEnum(str, enum.Enum):
    MANUAL = "Manual"
    AUTOMATIC = "Automatic"

class Vehicle(Base, TimestampMixin):
    __tablename__ = 'vehicles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    make = Column(String(50), nullable=False, index=True)
    model = Column(String(100), nullable=False, index=True)
    variant = Column(String(100), nullable=False)
    manufacturing_year = Column(Integer, nullable=False)
    registration_year = Column(Integer, nullable=False, index=True)
    body_type = Column(String(50), nullable=False, index=True) # Sedan, SUV, Hatchback, etc.
    fuel_type = Column(Enum(FuelTypeEnum), nullable=False, index=True)
    transmission = Column(Enum(TransmissionEnum), nullable=False, index=True)
    
    # Engine & specifications
    engine_displacement_cc = Column(Integer, nullable=True)
    power_bhp = Column(Integer, nullable=True)
    colour = Column(String(50), nullable=False)
    
    # Seller-declared details (Section 5.2)
    declared_kilometres_driven = Column(Integer, nullable=False, index=True)
    declared_ownership_count = Column(Integer, default=1)
    declared_condition = Column(String(50), nullable=True)
    
    # Sensitive fields (Masked in public responses)
    chassis_number = Column(String(100), nullable=True)
    engine_number = Column(String(100), nullable=True)
    rc_number = Column(String(50), nullable=True)

    listings = relationship('Listing', back_populates='vehicle')
    verification_records = relationship('VerificationRecord', back_populates='vehicle')

class Listing(Base, TimestampMixin):
    __tablename__ = 'listings'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey('vehicles.id'), nullable=False)
    
    # Enforce exactly one source: either seller_user_id OR dealership_id (Section 5.3)
    seller_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    dealership_id = Column(UUID(as_uuid=True), ForeignKey('dealerships.id'), nullable=True)
    branch_id = Column(UUID(as_uuid=True), ForeignKey('dealership_branches.id'), nullable=True)
    
    asking_price_inr = Column(Numeric(12, 2), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    
    # State management
    approval_state = Column(Enum(ListingApprovalState), default=ListingApprovalState.PENDING, index=True)
    availability_state = Column(Enum(ListingAvailabilityState), default=ListingAvailabilityState.AVAILABLE, index=True)
    is_featured = Column(Boolean, default=False)
    
    vehicle = relationship('Vehicle', back_populates='listings')
    seller_user = relationship('User', back_populates='listings')
    dealership = relationship('Dealership', back_populates='listings')
    media = relationship('ListingMedia', back_populates='listing', cascade='all, delete-orphan')

class ListingMedia(Base, TimestampMixin):
    __tablename__ = 'listing_media'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey('listings.id', ondelete='CASCADE'), nullable=False)
    media_url = Column(String(500), nullable=False)
    media_type = Column(String(20), default='image') # image, video, 360_view
    display_order = Column(Integer, default=0)
    is_cover = Column(Boolean, default=False)

    listing = relationship('Listing', back_populates='media')

class VerificationRecord(Base, TimestampMixin):
    __tablename__ = 'verification_records'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey('vehicles.id'), nullable=False)
    inspector_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    score_out_of_180 = Column(Integer, nullable=False) # REVORA 180-Point Inspection
    accident_history_verified = Column(Boolean, default=False)
    odometer_verified = Column(Boolean, default=False)
    title_clear = Column(Boolean, default=True)
    inspection_report_url = Column(String(500), nullable=True)

    vehicle = relationship('Vehicle', back_populates='verification_records')
