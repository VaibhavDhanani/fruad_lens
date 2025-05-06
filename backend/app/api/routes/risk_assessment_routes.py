# risk_assessment_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.postgre import get_db
from app.models.models import RiskAssessment
from app.schemas.risk_assessment import (
    RiskAssessmentOut,
    RiskAssessmentCreate,
    RiskAssessmentUpdate,
)

router = APIRouter(prefix="/risk-assessments", tags=["Risk Assessment"])


@router.post("/", response_model=RiskAssessmentOut)
async def create_risk_assessment(
    assessment: RiskAssessmentCreate, db: AsyncSession = Depends(get_db)
):
    new_assessment = RiskAssessment(**assessment.dict())
    db.add(new_assessment)
    await db.commit()
    await db.refresh(new_assessment)
    return new_assessment


@router.get("/", response_model=List[RiskAssessmentOut])
async def get_all_assessments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RiskAssessment))
    return result.scalars().all()


@router.get("/{assessment_id}", response_model=RiskAssessmentOut)
async def get_assessment_by_id(assessment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RiskAssessment).where(RiskAssessment.assessment_id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return assessment


@router.put("/{assessment_id}", response_model=RiskAssessmentOut)
async def update_assessment(
    assessment_id: int,
    assessment_data: RiskAssessmentUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(RiskAssessment).where(RiskAssessment.assessment_id == assessment_id)
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")

    for field, value in assessment_data.dict(exclude_unset=True).items():
        setattr(assessment, field, value)

    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.delete("/{assessment_id}")
async def delete_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RiskAssessment).where(RiskAssessment.assessment_id == assessment_id)
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")

    await db.delete(assessment)
    await db.commit()
    return {"message": "Risk assessment deleted successfully"}
