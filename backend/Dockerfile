# Use the official Python image with a specific version
FROM python:3.9.21-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libpq-dev \
    libffi-dev \
    gcc \
    g++ \
    musl-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size




# Copy only the requirements file first (for better caching)
COPY requirements.txt .

# RUN pip install blis
# RUN pip install blis==0.7.9

# Upgrade pip, setuptools, and wheel
RUN pip install --upgrade pip setuptools wheel

# Install dependencies separately to leverage Docker caching
# RUN pip install --no-cache-dir setuptools cython numpy murmurhash cymem preshed blis
# RUN pip install --no-cache-dir blis==0.7.9
# RUN pip install --no-cache-dir spacy==3.7.2


RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8000


# Set environment variables (these will be overridden by .env)
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Run the application
CMD ["python", "app.py"]