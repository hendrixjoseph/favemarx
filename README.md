

Start the docker service on AWS:

    sudo systemctl restart docker.service

Docker commands to get the service up and running:

Run on localhost:

    docker compose --profile local build
    docker compose --profile local up

Run in production:

    docker compose --profile prod build
    docker compose --profile prod up