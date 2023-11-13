from cloudharness.middleware import get_authentication_token
from cloudharness_django.models import Team, Member
from django.contrib.auth.models import User
import jwt

def get_current_user():
    token = get_authentication_token()
    if token is None:
        return None
    token = token.replace("Bearer ", "")
    try:
        decoded_token =  jwt.decode(token, options={"verify_signature": False}, algorithms='RS256')['sub']
        member = Member.objects.get(kc_id=str(decoded_token))
        user = User.objects.get(id=member.user_id)
    except Exception as e:
        return None
    
    return user