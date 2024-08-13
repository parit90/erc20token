# Build the Docker containers with no cache
build:
	docker-compose build --no-cache

# Start the Docker containers
up:
	docker-compose up -d

# Make the deploy script executable
chmod:
	chmod +x deploy.sh

# Run the deploy script
deploy:
	./deploy.sh

# Full sequence: build, up, chmod, and deploy
all: build up chmod deploy
