from app import db
from sqlalchemy import Float,Column,Integer,String,ForeignKey,DateTime,Time,Boolean
import re

GOOD_BOY_URL = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"

class Email(db.Model):
    __tablename__ = "email"

    id          = Column(Integer(),primary_key=True)
    email       = Column(Integer(),nullable=False,unique=True)

    def __init__(self,email):
        self.email = email

    def save(self):
        db.session.add(self)
        db.session.commit()    



class Perguntas(db.Model):
    __tablename__ = "perguntas"

    id          = Column(Integer(),primary_key=True)
    ordem       = Column(Integer(),nullable=False,unique=True)
    pergunta    = Column(String(),nullable=False)
    opcoes      = Column(String(),nullable=False)

    def __init__(self):
        pass

    @property
    def text(self):
        return self.pergunta.replace("\\n","\n")

    def send(self,resp):
        msg = self.text.split("\\s")
        for m in msg:
            if "Link:" in m:
                url = m.replace("Link:","")
                #resp.message("a").media(url)
                resp.message("").media(url)
            else:
                resp.message(m)

    def getResponse(self,value):
        filtr = lambda x,y: bool(re.findall("\d\s?-",x)) and y in x
        msg = [x for x in self.text.split("\n") if filtr(x,value)]
        if not msg: return value
        return msg[-1]

    def __repr__(self):
        return "<Msg %r>" % self.id



class Status(db.Model):
    __tablename__ = "status"

    id          = Column(Integer,primary_key=True)
    id_msg      = Column(Integer,ForeignKey('perguntas.id'),nullable=False)
    resposta    = Column(String)

    msg         = db.relationship("Perguntas",foreign_keys=id_msg)

    def __init__(self,id_msg,resposta=None):
        self.id_msg = id_msg
        self.resposta = resposta

    def save(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return "<Sts %r>" % self.msg.ordem