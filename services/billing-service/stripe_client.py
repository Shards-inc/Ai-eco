import stripe
import os

class StripeClient:
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    def create_customer(self, email: str, name: str):
        return stripe.Customer.create(email=email, name=name)

    def report_usage(self, subscription_item_id: str, quantity: int):
        return stripe.SubscriptionItem.create_usage_record(
            subscription_item_id,
            quantity=quantity,
            timestamp='now',
            action='increment'
        )
