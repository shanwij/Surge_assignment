# Surge_assignment

Instructions to Run the Docker Application

1. Extract the folder
2. Navigate to the folder 

    # cd <foldername> 

3. Install the dependencies for the back-end:

    #  cd server
    #  npm install

4. Install the dependencies for the front-end:
    
    #  cd client
    #  npm install 

5. Build server-api using Docker:

    # cd server
    # docker build -t docker-assignment-server .

6. Build front-end using Docker:

    # cd client
    # docker build -t docker-assignment-client .

7. To start the container, navigate to the folder where the docker-compose.yml file is located(root). then run. 
    
    # docker-compose up


