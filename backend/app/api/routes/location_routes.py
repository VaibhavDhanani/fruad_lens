# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from app.models.models import Location
# from app.schemas.location import LocationCreate, LocationUpdate, LocationOut
# from app.db.postgre import get_db
# from app.api.dependencies import get_current_user

# router = APIRouter(prefix="/locations", tags=["Locations"],dependencies=[Depends(get_current_user)])

# # Get all locations
# @router.get("/", response_model=list[LocationOut])
# async def get_all_locations(db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Location))
#     return result.scalars().all()

# # Create a new location
# @router.post("/", response_model=LocationOut)
# async def create_location(location: LocationCreate, db: AsyncSession = Depends(get_db)):
#     new_location = Location(**location.dict())
#     db.add(new_location)
#     await db.commit()
#     await db.refresh(new_location)
#     return new_location

# # Get location by ID
# @router.get("/{location_id}", response_model=LocationOut)
# async def get_location(location_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Location).where(Location.location_id == location_id))
#     location = result.scalar_one_or_none()
#     if not location:
#         raise HTTPException(status_code=404, detail="Location not found")
#     return location

# # Update location
# @router.put("/{location_id}", response_model=LocationOut)
# async def update_location(location_id: int, location_data: LocationUpdate, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Location).where(Location.location_id == location_id))
#     location = result.scalar_one_or_none()
#     if not location:
#         raise HTTPException(status_code=404, detail="Location not found")

#     for field, value in location_data.dict(exclude_unset=True).items():
#         setattr(location, field, value)

#     await db.commit()
#     await db.refresh(location)
#     return location

# # Delete location
# @router.delete("/{location_id}")
# async def delete_location(location_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Location).where(Location.location_id == location_id))
#     location = result.scalar_one_or_none()
#     if not location:
#         raise HTTPException(status_code=404, detail="Location not found")

#     await db.delete(location)
#     await db.commit()
#     return {"detail": "Location deleted successfully"}
