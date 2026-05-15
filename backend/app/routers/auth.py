from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from jose import jwt

from app.core.database import get_db
from app.core.security import pwd_context, SECRET_KEY, ALGORITHM, get_current_user
from app.models.models import User
from app.schemas.schemas import UserAuth, PassUpdate

router = APIRouter()


@router.post("/register")
def register(
    user: UserAuth,
    db: Session = Depends(get_db)
):
    username = user.username.lower()

    existing_user = db.query(User).filter(
        User.username == username
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = pwd_context.hash(user.password)
    
    new_user = User(
        username=username,
        password=hashed_password
    )
    
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


@router.post("/login")
def login(
    user: UserAuth,
    db: Session = Depends(get_db)
):
    username = user.username.lower()

    db_user = db.query(User).filter(
        User.username == username
    ).first()
    
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = jwt.encode(
        {"username": username},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.put("/update-password")
def update_password(
    data: PassUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.username == current_user
    ).first()
    
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db_user.password = pwd_context.hash(data.password)
    db.commit()

    return {"message": "Password updated successfully"}


@router.delete("/delete")
def delete_user(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.username == current_user
    ).first()
    
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(db_user)
    db.commit()

    return {"message": "User deleted successfully"}
