"""
Email Service Module for STUFF Intercâmbio
Handles all transactional emails: payment confirmations, notifications, etc.
"""

import os
import asyncio
import logging
import resend
from datetime import datetime

logger = logging.getLogger(__name__)

# Initialize Resend
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@stuffintercambio.com')
STUFF_ADMIN_EMAIL = os.environ.get('STUFF_ADMIN_EMAIL', 'admin@stuffintercambio.com')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ============== EMAIL TEMPLATES ==============

def get_base_template(content: str, title: str = "STUFF Intercâmbio") -> str:
    """Base HTML template for all emails"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">STUFF Intercâmbio</h1>
                                <p style="color: #fed7aa; margin: 5px 0 0 0; font-size: 14px;">Sua jornada para Dublin</p>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                {content}
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px; text-align: center;">
                                    STUFF Intercâmbio - Conectando estudantes às melhores escolas de Dublin
                                </p>
                                <p style="margin: 0; color: #94a3b8; font-size: 11px; text-align: center;">
                                    Este email foi enviado automaticamente. Em caso de dúvidas, responda este email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_payment_confirmation_student_email(
    student_name: str,
    course_name: str,
    school_name: str,
    amount: float,
    start_date: str,
    enrollment_id: str
) -> str:
    """Email template for student payment confirmation"""
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px; color: white;">✓</span>
            </div>
            <h2 style="color: #059669; margin: 0; font-size: 24px;">Pagamento Confirmado!</h2>
        </div>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Olá <strong>{student_name}</strong>,
        </p>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Parabéns! Seu pagamento foi processado com sucesso e sua matrícula está confirmada. 
            Você está um passo mais perto do seu sonho de estudar em Dublin! 🎉
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <tr>
                <td style="padding: 15px;">
                    <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">📋 Detalhes da Matrícula</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Curso:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{course_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Escola:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{school_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Data de início:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{start_date}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Valor pago:</td>
                            <td style="color: #059669; font-size: 18px; font-weight: bold; text-align: right;">€{amount:,.2f}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">ID da Matrícula:</td>
                            <td style="color: #1e293b; font-size: 12px; text-align: right; font-family: monospace;">{enrollment_id}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📄 Próximos Passos</h4>
            <ol style="color: #78350f; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>A escola <strong>{school_name}</strong> foi notificada do seu pagamento</li>
                <li>Você receberá a <strong>Carta de Matrícula (Enrollment Letter)</strong> em até 5 dias úteis</li>
                <li>Esta carta é necessária para o seu visto de estudante</li>
                <li>Guarde este email como comprovante de pagamento</li>
            </ol>
        </div>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Se tiver alguma dúvida, não hesite em nos contactar. Estamos aqui para ajudá-lo em cada etapa da sua jornada!
        </p>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Boa sorte no seu intercâmbio! 🍀
        </p>
        
        <p style="color: #334155; font-size: 16px;">
            Atenciosamente,<br>
            <strong>Equipe STUFF Intercâmbio</strong>
        </p>
    """
    return get_base_template(content, "Pagamento Confirmado - STUFF Intercâmbio")


def get_payment_notification_school_email(
    school_name: str,
    student_name: str,
    student_email: str,
    course_name: str,
    amount: float,
    school_amount: float,
    platform_fee: float,
    start_date: str,
    enrollment_id: str
) -> str:
    """Email template for school notification of new payment"""
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #3b82f6; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px; color: white;">💰</span>
            </div>
            <h2 style="color: #1d4ed8; margin: 0; font-size: 24px;">Nova Matrícula Paga!</h2>
        </div>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Olá <strong>{school_name}</strong>,
        </p>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Um novo aluno acabou de efetuar o pagamento através da plataforma STUFF Intercâmbio. 
            Segue abaixo os detalhes da matrícula:
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <tr>
                <td style="padding: 15px;">
                    <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">👤 Dados do Aluno</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Nome:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{student_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Email:</td>
                            <td style="color: #1e293b; font-size: 14px; text-align: right;">
                                <a href="mailto:{student_email}" style="color: #2563eb; text-decoration: none;">{student_email}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Curso:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{course_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Data de início:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{start_date}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <tr>
                <td style="padding: 15px;">
                    <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">💶 Detalhes do Pagamento</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Valor total:</td>
                            <td style="color: #1e293b; font-size: 14px; text-align: right;">€{amount:,.2f}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Taxa STUFF (15%):</td>
                            <td style="color: #dc2626; font-size: 14px; text-align: right;">-€{platform_fee:,.2f}</td>
                        </tr>
                        <tr style="border-top: 2px solid #10b981;">
                            <td style="color: #166534; font-size: 16px; font-weight: bold; padding: 12px 0;">Você receberá:</td>
                            <td style="color: #059669; font-size: 20px; font-weight: bold; text-align: right;">€{school_amount:,.2f}</td>
                        </tr>
                    </table>
                    <p style="color: #64748b; font-size: 12px; margin: 15px 0 0 0; text-align: center;">
                        💳 O valor será transferido automaticamente para sua conta Stripe
                    </p>
                </td>
            </tr>
        </table>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ Ação Necessária</h4>
            <p style="color: #78350f; font-size: 14px; line-height: 1.6; margin: 0;">
                Por favor, envie a <strong>Carta de Matrícula (Enrollment Letter)</strong> para o aluno 
                o mais rápido possível. Esta carta é essencial para o processo de visto do estudante.
            </p>
        </div>
        
        <p style="color: #334155; font-size: 14px;">
            ID da Matrícula: <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px;">{enrollment_id}</code>
        </p>
    """
    return get_base_template(content, "Nova Matrícula Paga - STUFF Intercâmbio")


def get_payment_notification_stuff_email(
    student_name: str,
    student_email: str,
    school_name: str,
    course_name: str,
    amount: float,
    platform_fee: float,
    enrollment_id: str
) -> str:
    """Email template for STUFF admin notification of new payment"""
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px; color: white;">🎉</span>
            </div>
            <h2 style="color: #059669; margin: 0; font-size: 24px;">Nova Venda Realizada!</h2>
        </div>
        
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Uma nova matrícula foi paga através da plataforma STUFF Intercâmbio.
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <tr>
                <td style="padding: 15px;">
                    <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">📊 Resumo da Transação</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Aluno:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{student_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Email:</td>
                            <td style="color: #1e293b; font-size: 14px; text-align: right;">{student_email}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Escola:</td>
                            <td style="color: #1e293b; font-size: 14px; font-weight: bold; text-align: right;">{school_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Curso:</td>
                            <td style="color: #1e293b; font-size: 14px; text-align: right;">{course_name}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Valor total:</td>
                            <td style="color: #1e293b; font-size: 14px; text-align: right;">€{amount:,.2f}</td>
                        </tr>
                        <tr style="background-color: #d1fae5; border-radius: 8px;">
                            <td style="color: #166534; font-size: 16px; font-weight: bold; padding: 12px 8px;">Comissão STUFF (15%):</td>
                            <td style="color: #059669; font-size: 20px; font-weight: bold; text-align: right; padding: 12px 8px;">€{platform_fee:,.2f}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <p style="color: #334155; font-size: 14px;">
            ID da Matrícula: <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px;">{enrollment_id}</code>
        </p>
        
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            Data/Hora: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
        </p>
    """
    return get_base_template(content, "Nova Venda - STUFF Intercâmbio")


# ============== EMAIL SENDING FUNCTIONS ==============

async def send_email(to: str, subject: str, html_content: str) -> dict:
    """Send an email using Resend API"""
    if not RESEND_API_KEY:
        logger.warning(f"RESEND_API_KEY not configured. Email to {to} not sent.")
        return {"status": "skipped", "reason": "API key not configured"}
    
    params = {
        "from": SENDER_EMAIL,
        "to": [to],
        "subject": subject,
        "html": html_content
    }
    
    try:
        # Run sync SDK in thread to keep FastAPI non-blocking
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to}: {subject}")
        return {"status": "success", "email_id": email.get("id")}
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        return {"status": "error", "error": str(e)}


async def send_payment_confirmation_emails(
    student_name: str,
    student_email: str,
    school_name: str,
    school_email: str,
    course_name: str,
    amount: float,
    start_date: str,
    enrollment_id: str
):
    """Send all payment confirmation emails (student, school, and STUFF admin)"""
    
    platform_fee = amount * 0.15
    school_amount = amount * 0.85
    
    results = {}
    
    # 1. Email to Student
    student_html = get_payment_confirmation_student_email(
        student_name=student_name,
        course_name=course_name,
        school_name=school_name,
        amount=amount,
        start_date=start_date,
        enrollment_id=enrollment_id
    )
    results['student'] = await send_email(
        to=student_email,
        subject=f"✅ Pagamento Confirmado - {course_name}",
        html_content=student_html
    )
    
    # 2. Email to School
    school_html = get_payment_notification_school_email(
        school_name=school_name,
        student_name=student_name,
        student_email=student_email,
        course_name=course_name,
        amount=amount,
        school_amount=school_amount,
        platform_fee=platform_fee,
        start_date=start_date,
        enrollment_id=enrollment_id
    )
    results['school'] = await send_email(
        to=school_email,
        subject=f"💰 Nova Matrícula Paga - {student_name}",
        html_content=school_html
    )
    
    # 3. Email to STUFF Admin
    stuff_html = get_payment_notification_stuff_email(
        student_name=student_name,
        student_email=student_email,
        school_name=school_name,
        course_name=course_name,
        amount=amount,
        platform_fee=platform_fee,
        enrollment_id=enrollment_id
    )
    results['stuff'] = await send_email(
        to=STUFF_ADMIN_EMAIL,
        subject=f"🎉 Nova Venda: €{amount:,.2f} - {school_name}",
        html_content=stuff_html
    )
    
    logger.info(f"Payment confirmation emails sent for enrollment {enrollment_id}")
    return results
