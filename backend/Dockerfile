FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==1.6.1

COPY pyproject.toml /app/

RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi

COPY . /app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]