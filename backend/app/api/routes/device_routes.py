from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import Device
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceOut
from app.db.postgre import get_db
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/devices", tags=["Devices"],dependencies=[Depends(get_current_user)])

# Get all devices
@router.get("/", response_model=list[DeviceOut])
async def get_all_devices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device))
    devices = result.scalars().all()
    return devices

# Create a device
@router.post("/", response_model=DeviceOut)
async def create_device(device: DeviceCreate, db: AsyncSession = Depends(get_db)):
    new_device = Device(**device.dict())
    db.add(new_device)
    await db.commit()
    await db.refresh(new_device)
    return new_device

# Get a single device by ID
@router.get("/{device_id}", response_model=DeviceOut)
async def get_device(device_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).where(Device.device_id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

# Update a device
@router.put("/{device_id}", response_model=DeviceOut)
async def update_device(device_id: str, device_data: DeviceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).where(Device.device_id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    for field, value in device_data.dict(exclude_unset=True).items():
        setattr(device, field, value)

    await db.commit()
    await db.refresh(device)
    return device

# Delete a device
@router.delete("/{device_id}")
async def delete_device(device_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).where(Device.device_id == device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    await db.delete(device)
    await db.commit()
    return {"detail": "Device deleted successfully"}
