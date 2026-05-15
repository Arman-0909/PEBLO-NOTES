from pydantic import BaseModel


class UserAuth(BaseModel):
    username: str
    password: str


class PassUpdate(BaseModel):
    password: str


class NoteCreate(BaseModel):
    title: str
    content: str
    tags: str = ""
