"""Password/Passphrase/PIN generation API endpoints"""

import secrets
import string

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/generator", tags=["generator"])


class PasswordRequest(BaseModel):
    length: int = 20
    uppercase: bool = True
    lowercase: bool = True
    numbers: bool = True
    symbols: bool = True
    exclude_similar: bool = False


class PassphraseRequest(BaseModel):
    word_count: int = 6
    separator: str = "-"
    capitalize: bool = True
    include_number: bool = True


class PinRequest(BaseModel):
    length: int = 6
    exclude_sequential: bool = True


class GeneratorResponse(BaseModel):
    result: str
    entropy: float
    strength: str


@router.post("/password", response_model=GeneratorResponse)
async def generate_password(request: PasswordRequest):
    """Generate a random password"""
    charset = ""
    if request.lowercase:
        charset += string.ascii_lowercase
    if request.uppercase:
        charset += string.ascii_uppercase
    if request.numbers:
        charset += string.digits
    if request.symbols:
        charset += string.punctuation

    if not charset:
        charset = string.ascii_lowercase

    password = "".join(secrets.choice(charset) for _ in range(request.length))

    import math
    entropy = request.length * math.log2(len(charset))
    strength = (
        "weak" if entropy < 40
        else "medium" if entropy < 60
        else "strong" if entropy < 80
        else "veryStrong"
    )

    return GeneratorResponse(result=password, entropy=entropy, strength=strength)


@router.post("/passphrase", response_model=GeneratorResponse)
async def generate_passphrase(request: PassphraseRequest):
    """Generate a random passphrase"""
    # Simplified wordlist for demo
    words = [
        "acid", "acme", "aged", "also", "area", "army", "away", "baby",
        "back", "bail", "bake", "ball", "band", "bank", "bare", "bark",
        "barn", "base", "bash", "bath", "beam", "bean", "bear", "beat",
        "bird", "blow", "blue", "boat", "bold", "bolt", "bond", "bone",
        "book", "born", "boss", "both", "bulk", "burn", "busy", "cafe",
    ]

    selected = [secrets.choice(words) for _ in range(request.word_count)]
    if request.capitalize:
        selected = [w.capitalize() for w in selected]

    passphrase = request.separator.join(selected)
    if request.include_number:
        passphrase += request.separator + str(secrets.randbelow(10000))

    import math
    entropy = request.word_count * math.log2(len(words))

    return GeneratorResponse(
        result=passphrase,
        entropy=entropy,
        strength="strong" if entropy > 60 else "medium",
    )


@router.post("/pin", response_model=GeneratorResponse)
async def generate_pin(request: PinRequest):
    """Generate a random PIN"""
    pin = "".join(str(secrets.randbelow(10)) for _ in range(request.length))

    import math
    entropy = request.length * math.log2(10)

    return GeneratorResponse(result=pin, entropy=entropy, strength="weak")
