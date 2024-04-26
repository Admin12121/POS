
from django.core.mail import EmailMessage
from decouple import config  # Make sure to import the config function

class Util:
    @staticmethod
    def send_email(data):
        try:
            subject = data['subject']
            body = data['body']
            to_email = data['to_email']
            
            # Using config function from decouple to read environment variables
            from_email = config('EMAIL_HOST_USER')

            if not all([subject, body, to_email, from_email]):
                raise ValueError("Incomplete email data")

            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=from_email,
                to=[to_email]
            )
            email.send()
            print('Email sent successfully')
        except Exception as e:
            print(f'Error sending email: {e}')
