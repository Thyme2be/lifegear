# ---- Build stage ----
FROM python:3.13.7 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install dependencies in venv
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Final stage ----
FROM python:3.13.7-slim

WORKDIR /app

# Copy virtual environment
COPY --from=builder /venv /venv
ENV PATH="/venv/bin:$PATH"

# Copy backend code
COPY . .

EXPOSE 8000

# Run FastAPI app
CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]