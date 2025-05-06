# # transaction_metrics_routes.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from typing import List

# from app.db.postgre import get_db
# from app.api.dependencies import get_current_user
# from app.models.models import TransactionMetrics
# from app.schemas.transaction_metrics import TransactionMetricsBase,TransactionMetricsCreate,TransactionMetricsUpdate,TransactionMetricsOut

# router = APIRouter(prefix="/transaction-metrics", tags=["Transaction Metrics"],dependencies=[Depends(get_current_user)])


# @router.post("/", response_model=TransactionMetricsOut)
# async def create_metrics(
#     metrics: TransactionMetricsCreate,
#     db: AsyncSession = Depends(get_db)
# ):
#     new_metrics = TransactionMetrics(**metrics.dict())
#     db.add(new_metrics)
#     await db.commit()
#     await db.refresh(new_metrics)
#     return new_metrics


# @router.get("/", response_model=List[TransactionMetricsOut])
# async def get_all_metrics(db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(TransactionMetrics))
#     return result.scalars().all()


# @router.get("/{metric_id}", response_model=TransactionMetricsOut)
# async def get_metrics_by_id(metric_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(TransactionMetrics).where(TransactionMetrics.metric_id == metric_id))
#     metrics = result.scalar_one_or_none()
#     if not metrics:
#         raise HTTPException(status_code=404, detail="Metrics not found")
#     return metrics


# @router.put("/{metric_id}", response_model=TransactionMetricsOut)
# async def update_metrics(
#     metric_id: int,
#     update_data: TransactionMetricsUpdate,
#     db: AsyncSession = Depends(get_db)
# ):
#     result = await db.execute(select(TransactionMetrics).where(TransactionMetrics.metric_id == metric_id))
#     metrics = result.scalar_one_or_none()

#     if not metrics:
#         raise HTTPException(status_code=404, detail="Metrics not found")

#     for field, value in update_data.dict(exclude_unset=True).items():
#         setattr(metrics, field, value)

#     await db.commit()
#     await db.refresh(metrics)
#     return metrics


# @router.delete("/{metric_id}")
# async def delete_metrics(metric_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(TransactionMetrics).where(TransactionMetrics.metric_id == metric_id))
#     metrics = result.scalar_one_or_none()

#     if not metrics:
#         raise HTTPException(status_code=404, detail="Metrics not found")

#     await db.delete(metrics)
#     await db.commit()
#     return {"message": "Transaction metrics deleted successfully"}
