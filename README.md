# Step to deploy this project 


# Rebuild locally
```
docker build -t ghcr.io/jamaah-it/fiqh:latest .
```
# Push to GHCR
```
docker push ghcr.io/jamaah-it/fiqh:latest
``` 

# Pull the new image
```
docker pull ghcr.io/jamaah-it/fiqh:latest
```

# Stop and remove old container
```
docker stop fiqh-web && docker rm fiqh-web
```

# Run new container

```
docker run -d -p 8000:8000 --name fiqh-web --env-file .env.fiqh ghcr.io/jamaah-it/fiqh:latest
```

