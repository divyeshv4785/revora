from sqlalchemy import Column, String, Boolean, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.models.base import Base, TimestampMixin

user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', UUID(as_uuid=True), ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True)
)

class Role(Base, TimestampMixin):
    __tablename__ = 'roles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False) # e.g. buyer, seller, dealer_owner, dealer_employee, admin
    description = Column(String(255), nullable=True)

class User(Base, TimestampMixin):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    display_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    is_phone_verified = Column(Boolean, default=False)
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    roles = relationship('Role', secondary=user_roles, backref='users')
    listings = relationship('Listing', back_populates='seller_user')
