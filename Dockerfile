# Dockerfile for REVORA FastAPI backend
# -------------------------------------------------
# Use the official slim Python image (3.12) as base
FROM python:3.12-slim

# Set a non‑root user (optional but good practice)
ARG USERNAME=appuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN addgroup --gid $USER_GID $USERNAME \
    && adduser --uid $USER_UID --gid $USER_GID --disabled-password --gecos "" $USERNAME

# Create and set the working directory
WORKDIR /app

# Copy the whole project into the container
COPY . /app

# Install the Python dependencies – the requirements file lives under revora/backend
RUN pip install --no-cache-dir -r revora/backend/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Run as the non‑root user
USER $USERNAME

# Default command to start the FastAPI server
CMD ["uvicorn", "revora.backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
