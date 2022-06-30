

Start the docker service on AWS:

    sudo systemctl restart docker.service

Docker commands to get the service up and running:

Run on localhost:

    docker-compose build favemarx_local favemarx_db
    docker-compose up -d favemarx_local favemarx_db

Run in production:

    docker-compose build favemarx_prod favemarx_db
    docker-compose up -d favemarx_prod favemarx_db