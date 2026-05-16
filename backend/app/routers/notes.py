from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Note, User
from app.schemas.schemas import NoteCreate
from app.services.ai_service import generate_note_ai

router = APIRouter()


@router.post("/")
def create_note(
    note: NoteCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_note = Note(
        title=note.title,
        content=note.content,
        tags=note.tags,
        owner=current_user
    )
    
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    
    return {
        "message": "Note created successfully",
        "note": new_note
    }


@router.get("/")
def get_notes(
    search: str = Query(default=""),
    tag: str = Query(default=""),
    is_archived: bool = Query(default=False),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Note).filter(
        Note.owner == current_user,
        Note.is_archived == is_archived
    )

    if search:
        query = query.filter(
            or_(
                Note.title.ilike(f"%{search}%"),
                Note.content.ilike(f"%{search}%")
            )
        )
        
    if tag:
        query = query.filter(Note.tags.ilike(f"%{tag}%"))

    notes = query.order_by(Note.updated_at.desc()).all()

    return {"notes": notes}


@router.get("/{note_id}")
def get_note(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return note


@router.put("/{note_id}")
def update_note(
    note_id: int,
    note: NoteCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db_note.title = note.title
    db_note.content = note.content
    db_note.tags = note.tags
    db_note.updated_at = datetime.utcnow()
    
    db.commit()

    return {"message": "Note updated successfully"}


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(db_note)
    db.commit()

    return {"message": "Note deleted successfully"}


@router.patch("/{note_id}/archive")
def archive_note(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db_note.is_archived = True
    db.commit()

    return {"message": "Note archived successfully"}

@router.patch("/{note_id}/unarchive")
def unarchive_note(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
        
    note.is_archived = False
    db.commit()
    
    return {"message": "Note unarchived successfully"}


@router.patch("/{note_id}/share")
def toggle_share(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db_note.is_public = not db_note.is_public
    db.commit()

    return {
        "public": db_note.is_public,
        "share_id": db_note.share_id
    }


@router.get("/share/{share_id}")
def public_note(
    share_id: str,
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.share_id == share_id,
        Note.is_public == True
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
        
    return note


@router.post("/{note_id}/generate-ai")
def generate_ai(
    note_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.owner == current_user
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
        

    user = db.query(User).filter(
        User.username == current_user
    ).first()
    
    if user:
        user.ai_usage_count = (user.ai_usage_count or 0) + 1
        db.commit()

    return {
        "ai_response": generate_note_ai(note.content)
    }
