from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Note, User

router = APIRouter()


@router.get("/")
def dashboard(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_notes = db.query(Note).filter(
        Note.owner == current_user
    ).count()
    
    archived_notes = db.query(Note).filter(
        Note.owner == current_user,
        Note.is_archived == True
    ).count()
    
    public_notes = db.query(Note).filter(
        Note.owner == current_user,
        Note.is_public == True
    ).count()

    active_notes = total_notes - archived_notes


    recent_notes = db.query(Note).filter(
        Note.owner == current_user
    ).order_by(Note.updated_at.desc()).limit(5).all()


    one_week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_activity = db.query(Note).filter(
        Note.owner == current_user,
        Note.updated_at >= one_week_ago
    ).count()


    all_notes = db.query(Note).filter(
        Note.owner == current_user
    ).all()
    
    tag_counts = {}
    for note in all_notes:
        if note.tags:
            for t in [tag.strip() for tag in note.tags.split(",") if tag.strip()]:
                tag_counts[t] = tag_counts.get(t, 0) + 1
                
    sorted_tags = sorted(tag_counts.items(), key=lambda item: item[1], reverse=True)[:5]
    most_used_tags = [{"tag": k, "count": v} for k, v in sorted_tags]


    user = db.query(User).filter(
        User.username == current_user
    ).first()
    ai_usage = getattr(user, 'ai_usage_count', 0) if user else 0

    return {
        "username": current_user,
        "stats": {
            "total": total_notes,
            "active": active_notes,
            "archived": archived_notes,
            "public": public_notes,
            "ai_usage": ai_usage,
            "weekly_activity": weekly_activity
        },
        "recent_notes": recent_notes,
        "most_used_tags": most_used_tags
    }
