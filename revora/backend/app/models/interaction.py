from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.models.base import Base, TimestampMixin

class EnquiryStatusEnum(str, enum.Enum):
    NEW = "new"
    RESPONDED = "responded"
    CLOSED = "closed"

class TestDriveStatusEnum(str, enum.Enum):
    REQUESTED = "requested"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Favourite(Base, TimestampMixin):
    __tablename__ = 'favourites'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    listing_id = Column(UUID(as_uuid=True), ForeignKey('listings.id', ondelete='CASCADE'), nullable=False)

class Enquiry(Base, TimestampMixin):
    __tablename__ = 'enquiries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey('listings.id', ondelete='CASCADE'), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Enum(EnquiryStatusEnum), default=EnquiryStatusEnum.NEW)

class TestDrive(Base, TimestampMixin):
    __tablename__ = 'test_drives'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey('listings.id', ondelete='CASCADE'), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    preferred_slot = Column(DateTime, nullable=False)
    status = Column(Enum(TestDriveStatusEnum), default=TestDriveStatusEnum.REQUESTED)
