from app import db
from sqlalchemy import Float,Column,Integer,String,ForeignKey,DateTime,Time,Boolean

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
        for m in msg: resp.message(m)

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