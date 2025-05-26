from app.worker import celery
from typing import Dict, Any


@celery.task
def send_welcome_email(user_data: Dict[str, Any]) -> None:
    """
    Envia um email de boas-vindas para um usuário recém-registrado.
    Esta é uma tarefa simulada que apenas loga a ação.
    Em produção, integraria com um serviço de email real.
    """
    print(f"Enviando email de boas-vindas para {user_data['email']}")


@celery.task
def send_order_confirmation(order_id: int, user_email: str) -> None:
    """
    Envia um email de confirmação do pedido.
    Esta é uma tarefa simulada que apenas loga a ação.
    """
    print(f"Enviando confirmação do pedido {order_id} para {user_email}")
