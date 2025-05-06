# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from app.models.models import Account
# from app.api.dependencies import get_current_user
# from app.schemas.account import AccountCreate, AccountUpdate, AccountOut
# from app.db.postgre import get_db

# router = APIRouter(prefix="/accounts", tags=["Accounts"],dependencies=[Depends(get_current_user)])

# # Get All Accounts
# @router.get("/", response_model=list[AccountOut])
# async def get_accounts(db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Account))
#     accounts = result.scalars().all()
#     return accounts

# # Create Account
# @router.post("/", response_model=AccountOut)
# async def create_account(account: AccountCreate, db: AsyncSession = Depends(get_db)):
#     new_account = Account(**account.dict())
#     db.add(new_account)
#     await db.commit()
#     await db.refresh(new_account)
#     return new_account

# # Get Single Account
# @router.get("/{account_id}", response_model=AccountOut)
# async def get_account(account_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Account).where(Account.account_id == account_id))
#     account = result.scalar_one_or_none()
#     if not account:
#         raise HTTPException(status_code=404, detail="Account not found")
#     return account

# # Update Account
# @router.put("/{account_id}", response_model=AccountOut)
# async def update_account(account_id: int, account_data: AccountUpdate, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Account).where(Account.account_id == account_id))
#     account = result.scalar_one_or_none()
#     if not account:
#         raise HTTPException(status_code=404, detail="Account not found")

#     for field, value in account_data.dict(exclude_unset=True).items():
#         setattr(account, field, value)

#     await db.commit()
#     await db.refresh(account)
#     return account

# # Delete Account
# @router.delete("/{account_id}")
# async def delete_account(account_id: int, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(Account).where(Account.account_id == account_id))
#     account = result.scalar_one_or_none()
#     if not account:
#         raise HTTPException(status_code=404, detail="Account not found")

#     await db.delete(account)
#     await db.commit()
#     return {"detail": "Account deleted successfully"}
