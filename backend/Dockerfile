# Use an official Python image from the Docker Hub
FROM python:3.11-slim-bookworm

# Set working directory
WORKDIR /app



# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

