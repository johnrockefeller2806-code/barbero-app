from twilio.rest import Client
import os
import logging
import random
import string

logger = logging.getLogger(__name__)

class SMSDeliveryError(Exception):
    pass

def get_twilio_client():
    """Get Twilio client with credentials from environment"""
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    
    if not account_sid:
        raise SMSDeliveryError("TWILIO_ACCOUNT_SID not configured")
    if not auth_token:
        raise SMSDeliveryError("TWILIO_AUTH_TOKEN not configured")
    
    return Client(account_sid, auth_token)

def generate_verification_code(length=6):
    """Generate a random numeric verification code"""
    return ''.join(random.choices(string.digits, k=length))

def format_phone_number(phone: str) -> str:
    """
    Format phone number to E.164 format
    Handles Brazilian and Irish numbers
    """
    # Remove all non-numeric characters
    cleaned = ''.join(filter(str.isdigit, phone))
    
    # If already has country code (starts with +)
    if phone.startswith('+'):
        return '+' + cleaned
    
    # Brazilian number (11 digits: 2 DDD + 9 digits)
    if len(cleaned) == 11 and cleaned[2] == '9':
        return '+55' + cleaned
    
    # Brazilian number with country code already
    if len(cleaned) == 13 and cleaned.startswith('55'):
        return '+' + cleaned
    
    # Irish number (starts with 353)
    if cleaned.startswith('353'):
        return '+' + cleaned
    
    # Irish mobile (08x xxx xxxx) - 10 digits
    if len(cleaned) == 10 and cleaned.startswith('08'):
        return '+353' + cleaned[1:]  # Remove leading 0
    
    # Default: assume Brazilian number
    if len(cleaned) >= 10:
        return '+55' + cleaned
    
    return '+' + cleaned

def send_sms(to: str, message: str) -> bool:
    """
    Send SMS via Twilio
    
    Args:
        to: Recipient phone number
        message: SMS message content
    
    Returns:
        bool: True if SMS was sent successfully
    """
    try:
        client = get_twilio_client()
        from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not from_number:
            raise SMSDeliveryError("TWILIO_PHONE_NUMBER not configured")
        
        # Format the recipient number
        formatted_to = format_phone_number(to)
        
        message_response = client.messages.create(
            body=message,
            from_=from_number,
            to=formatted_to
        )
        
        logger.info(f"SMS sent to {formatted_to}, SID: {message_response.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send SMS to {to}: {str(e)}")
        raise SMSDeliveryError(f"Failed to send SMS: {str(e)}")

def send_verification_code(phone: str, code: str) -> bool:
    """
    Send verification code via SMS for password recovery
    """
    message = f"""🔐 STUFF Intercâmbio

Seu código de recuperação de senha é:

{code}

Este código expira em 10 minutos.

Se você não solicitou isso, ignore esta mensagem."""

    return send_sms(phone, message)

def send_welcome_sms(phone: str, name: str) -> bool:
    """
    Send welcome SMS to new user
    """
    message = f"""🌍 Bem-vindo(a) ao STUFF Intercâmbio, {name}!

Sua jornada para Dublin começa agora!

Qualquer dúvida, estamos aqui para ajudar.

Equipe STUFF"""

    return send_sms(phone, message)
