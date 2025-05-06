from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.postgre import get_db
from app.models.models import FraudDetails
from app.api.dependencies import get_current_user
from app.schemas.fraud_details import FraudDetailsOut, FraudDetailsCreate, FraudDetailsUpdate

router = APIRouter(prefix="/fraud-details", tags=["Fraud Details"],dependencies=[Depends(get_current_user)])


@router.post("/", response_model=FraudDetailsOut)
async def create_fraud_detail(
    fraud_detail: FraudDetailsCreate,
    db: AsyncSession = Depends(get_db)
):
    new_detail = FraudDetails(**fraud_detail.dict())
    db.add(new_detail)
    await db.commit()
    await db.refresh(new_detail)
    return new_detail


@router.get("/", response_model=List[FraudDetailsOut])
async def get_all_fraud_details(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FraudDetails))
    return result.scalars().all()


@router.get("/{fraud_id}", response_model=FraudDetailsOut)
async def get_fraud_detail_by_id(fraud_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FraudDetails).where(FraudDetails.fraud_id == fraud_id))
    detail = result.scalar_one_or_none()
    if not detail:
        raise HTTPException(status_code=404, detail="Fraud detail not found")
    return detail


@router.put("/{fraud_id}", response_model=FraudDetailsOut)
async def update_fraud_detail(
    fraud_id: int,
    update_data: FraudDetailsUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(FraudDetails).where(FraudDetails.fraud_id == fraud_id))
    detail = result.scalar_one_or_none()

    if not detail:
        raise HTTPException(status_code=404, detail="Fraud detail not found")

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(detail, field, value)

    await db.commit()
    await db.refresh(detail)
    return detail


@router.delete("/{fraud_id}")
async def delete_fraud_detail(fraud_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FraudDetails).where(FraudDetails.fraud_id == fraud_id))
    detail = result.scalar_one_or_none()

    if not detail:
        raise HTTPException(status_code=404, detail="Fraud detail not found")

    await db.delete(detail)
    await db.commit()
    return {"message": "Fraud detail deleted successfully"}
