from app import app
from flask import request
from app.models import *
from twilio.twiml.messaging_response import MessagingResponse

@app.route("/sms", methods=['GET', 'POST'])
def sms_reply():
    resp = MessagingResponse()
    received_message = request.form.get("Body")

    last = Status.query.order_by(Status.id.desc()).first()
    if last and last.msg.opcoes == "end":
        Status.query.delete()
        db.session.commit()
        last = None

    if not last:
        p = Perguntas.query.filter_by(ordem=0).first()
        p.send(resp)
        p = Perguntas.query.filter_by(ordem=1).first()
        p.send(resp)
        Status(p.id).save()
    else:
        if last.resposta is None:
            aceitas = last.msg.opcoes.split(",")
            if received_message in aceitas or "*" in aceitas:
                last.resposta = received_message
                last.save()
                nextQuestion(last,resp)
            else:
                resp.message("Opção Inválida!")
                last.msg.send(resp)
        else:
            nextQuestion(last,resp)


    return str(resp)


def nextQuestion(last,resp):
    p = Perguntas.query.filter_by(ordem=last.msg.ordem + 1 ).first()
    p.send(resp)
    Status(p.id).save()