from app import app
from flask import request
from app.models import *
from twilio.twiml.messaging_response import MessagingResponse
import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart


@app.route("/")
def home():
    return "OK"


def sendEmail():
    msgRoot = MIMEMultipart('related')
    msgRoot['From'] = "memelyma@gmail.com"
    msgRoot['To'] = Email.query.first().email
    msgRoot['Subject'] = "Respostas Colhidas pelo chatBot"
    msg = MIMEMultipart('alternative')

    lst = Status.query.all()
    style= "<style>table {{font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}}td, th {{border: 1px solid #dddddd;text-align: left;padding: 8px;}}tr:nth-child(even) {{background-color: #dddddd;}}</style>"
    header = style + "<table><thead><tr>{}</tr></thead><tbody>{}</tbody></table>"
    mask1 = "<th>{}</th>"
    mask2 = "<td>{}</td>\n<td>{}</td>"
    mask3 = "<tr>{}</tr>"
    head = "\n".join([mask1.format(x) for x in ['pergunta','resposta']])
    body = "\n".join([mask3.format(y) for y in [mask2.format(x.msg.text.replace("\n","<br>"),x.resposta) for x in lst]])

    bd = header.format(head,body).replace("\n","")
    message = bd.replace("Perfeito! Senguem minhas sugestões:\\sLink:https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80\\sLink:https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80\\s","")
    message = "Segue o resumo das respostas colhidas pelo chatbot<br><br><br><br>" + message

    msg.attach(MIMEText(message, 'html'))
    msgRoot.attach(msg)

    server = smtplib.SMTP_SSL('smtp.gmail.com')
    server.login("memelyma@gmail.com", "qwerty333")
    
    server.sendmail(msgRoot['From'],msgRoot['To'],msgRoot.as_string())
    # server.sendmail("memelyma@gmail.com", "melque_ex@yahoo.com.br", bd.encode('utf-8'))
    server.quit()

    return 


@app.route("/sms", methods=['GET', 'POST'])
def sms_reply():
    resp = MessagingResponse()
    received_message = request.form.get("Body")
    if "@" in received_message :
        Email.query.delete()
        Email(received_message).save()
        resp.message(f"email '{received_message}' cadastrado com sucesso!")
        return str(resp)




    last = Status.query.order_by(Status.id.desc()).first()
    if (last and last.msg.opcoes == "end") or received_message == "*":
        Status.query.delete()
        db.session.commit()
        last = None
        resp.message("chat resetado!")
        return str(resp)

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
                r = last.msg.getResponse(received_message)
                last.resposta = r
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
    if p.opcoes == 'end':
        sendEmail()
        

