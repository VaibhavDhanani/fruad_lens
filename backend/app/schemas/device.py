from pydantic import BaseModel
from typing import Optional

class DeviceCreate(BaseModel):
    device_id: str
    user_id: int
    device_type: str
    is_new_device: Optional[bool] = True

    class Config:
        from_attributes = True

class DeviceUpdate(BaseModel):
    device_type: Optional[str]
    is_new_device: Optional[bool]

    class Config:
        from_attributes = True

class DeviceOut(BaseModel):
    device_id: str
    user_id: int
    device_type: Optional[str]
    is_new_device: Optional[bool]

    class Config:
        from_attributes = True
