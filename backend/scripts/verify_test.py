import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from middleware.auth_middleware import verify_password

hashed = "$2b$12$LEhldEQUCwoyKqM/BHGQwefH.RD4yjBMyFpcM2M/fo5P8/rKvgdvm"
plain = "adminpassword123"

if verify_password(plain, hashed):
    print("MATCH: Password verified!")
else:
    print("NO MATCH: Password verification failed.")
