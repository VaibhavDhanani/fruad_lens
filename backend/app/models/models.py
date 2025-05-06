from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer)
    aadhar_card = Column(String, unique=True, nullable=False)
    pan_card = Column(String, unique=True, nullable=False)
    
    # Relationships
    accounts = relationship("Account", back_populates="user")
    devices = relationship("Device", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")


class Account(Base):
    __tablename__ = "accounts"
    
    account_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_balance = Column(Float, nullable=False)
    card_type = Column(String)
    
    # Relationships
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class Device(Base):
    __tablename__ = "devices"
    
    device_id = Column(String, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    device_type = Column(String)
    is_new_device = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="devices")
    transactions = relationship("Transaction", back_populates="device")


class Location(Base):
    __tablename__ = "locations"
    
    location_id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Relationships
    origin_transactions = relationship("Transaction", foreign_keys="Transaction.origin_location_id", back_populates="origin_location")
    beneficiary_transactions = relationship("Transaction", foreign_keys="Transaction.beneficiary_location_id", back_populates="beneficiary_location")


class Transaction(Base):
    __tablename__ = "transactions"
    
    transaction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.account_id"), nullable=False)
    device_id = Column(String, ForeignKey("devices.device_id"))
    transaction_amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    transaction_hour = Column(Integer)
    is_weekend = Column(Boolean, default=False)
    beneficiary_account_number = Column(String)
    origin_location_id = Column(Integer, ForeignKey("locations.location_id"))
    beneficiary_location_id = Column(Integer, ForeignKey("locations.location_id"))
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
    device = relationship("Device", back_populates="transactions")
    origin_location = relationship("Location", foreign_keys=[origin_location_id], back_populates="origin_transactions")
    beneficiary_location = relationship("Location", foreign_keys=[beneficiary_location_id], back_populates="beneficiary_transactions")
    risk_assessment = relationship("RiskAssessment", back_populates="transaction", uselist=False)
    fraud_details = relationship("FraudDetails", back_populates="transaction", uselist=False)


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    assessment_id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.transaction_id"), unique=True)
    risk_score = Column(Float)
    ip_address_flag = Column(Boolean, default=False)
    transaction_location_flag = Column(Boolean, default=False)
    suspicious_ip_flag = Column(Boolean, default=False)
    multiple_account_login = Column(Boolean, default=False)
    
    # Relationships
    transaction = relationship("Transaction", back_populates="risk_assessment")


class TransactionMetrics(Base):
    __tablename__ = "transaction_metrics"
    
    metric_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    daily_transaction_count = Column(Integer, default=0)
    weekly_transaction_count = Column(Integer)
    monthly_transaction_count = Column(Integer)
    avg_transaction_amount_7d = Column(Float)
    failed_transaction_count_7d = Column(Integer)
    avg_transaction_distance = Column(Float)
    time_since_last_transaction = Column(Float)
    transaction_distance = Column(Float)
    
    # Relationship
    user = relationship("User")


class FraudDetails(Base):
    __tablename__ = "fraud_details"
    
    fraud_id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.transaction_id"), unique=True)
    fraud_label = Column(Boolean, default=False)
    fraud_type = Column(String)
    previous_fraudulent_activity = Column(Boolean, default=False)
    
    # Relationship
    transaction = relationship("Transaction", back_populates="fraud_details")