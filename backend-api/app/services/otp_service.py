### backend-api/app/services/otp_service.py
import random

def generate_otp() -> str:
    return str(random.randint(1000, 9999))

def verify_otp(expected: str, received: str) -> bool:
    return expected == received
