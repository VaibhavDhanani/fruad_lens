# transaction_routes.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from typing import List

from app.db.postgre import get_db
from app.models.models import Transaction
from app.schemas.transaction import (
    TransactionOut,
    TransactionCreate,
    TransactionOut,
    TransactionUpdate,
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionOut)
async def create_transaction(
    transaction: TransactionCreate, db: AsyncSession = Depends(get_db)
):
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    await db.commit()
    await db.refresh(new_transaction)
    return new_transaction


@router.get("/", response_model=List[TransactionOut])
async def get_all_transactions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Transaction))
    transactions = result.scalars().all()
    return transactions


@router.get("/{transaction_id}", response_model=TransactionOut)
async def get_transaction_by_id(
    transaction_id: int, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Transaction).where(Transaction.transaction_id == transaction_id)
    )
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.put("/{transaction_id}", response_model=TransactionOut)
async def update_transaction(
    transaction_id: int,
    transaction_data: TransactionUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Transaction).where(Transaction.transaction_id == transaction_id)
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for field, value in transaction_data.dict(exclude_unset=True).items():
        setattr(transaction, field, value)

    await db.commit()
    await db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction).where(Transaction.transaction_id == transaction_id)
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    await db.delete(transaction)
    await db.commit()
    return {"message": "Transaction deleted successfully"}
