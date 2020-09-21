# RPL-2.0-web

* [How to contribute](#how-to-contribute)
    - [Coding](#coding)
    - [Deploying](#deploying)
* [How to run it in DEV](#how-to-run-it-in-dev)
* [How to run it in PROD local with minikube](#how-to-run-it-in-prod-local-with-minikube)
    - [Configuration](#configuration)
    - [Starting minikube](#starting-minikube)
    - [Running the webapp service](#running-the-webapp-service)
* [How to run it in PROD local with a Docker Image](#how-to-run-it-in-prod-local-with-a-docker-image)

## How to contribute

### Coding

1. Clone the repo
2. Create a branch with the following format:
    - `feature/*`: If you are developing a new feature.
    - `bug/*`: If you are fixing a bug.
    - `chore/*`: If you are working on other kind of task.
3. When the code is ready and was properly tested, create a descriptive Pull Request, assign a reviewer and wait for some feedback.
4. Once the Pull Request is approved, merge it with _**"Squash and Merge"**_ (please check that everything is working find before merging).

### Deploying

The repo has Continuous Deployment, so everything merged to `master` is deployed to prod. Please, when you merge to master, follow the GitHub action to make sure that the deployment was successful.

If you want to test a branch in prod env, you can create a `test/*` branch, this will trigger a deployment to prod. It's important to be careful while using test branches because that code will go to prod :smile:.

## How to run it in DEV

For installing all dependencies, you shouzld run:

```
nvm use
npm i
```

It's possible to run the frontend against a prod environment or a local environment. In both cases, you need to set the backend URL in a `.env.development` file (create this file at root of the project if you don't have it). 

For running RPL-2.0-web against prod you should set the prod url:

```
API_BASE_URL=http://www.rpl.codes
```

For running RPL-2.0-web against a local environment you should set the local URL where you have the backend running:

```
API_BASE_URL=http://localhost:8080
```

Once you have this set, you could start the service running:

```
npm start
```

Note: For testing image upload features locally, you will need to also set the `CLOUDINARY_UPLOAD_PRESET` and `CLOUDINARY_URL` env variables in `.env.development` file. Ask these values to another contributor.

## How to run it in PROD local with minikube

### Configuration

- Download and install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- Download and install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Starting minikube

Run the following command for starting the cluster:

```
minikube start \
  --memory 8096 \
  --extra-config=controller-manager.horizontal-pod-autoscaler-upscale-delay=1m \
  --extra-config=controller-manager.horizontal-pod-autoscaler-downscale-delay=2m \
  --extra-config=controller-manager.horizontal-pod-autoscaler-sync-period=10s
```

Note: If you are running on mac you will need the flag `--vm-driver hyperkit`.

After that, you should get something like this:

```
😄  minikube v1.12.1 on Darwin 10.14.6
    ▪ MINIKUBE_ACTIVE_DOCKERD=minikube
✨  Using the hyperkit driver based on user configuration
👍  Starting control plane node minikube in cluster minikube
🔥  Creating hyperkit VM (CPUs=2, Memory=8096MB, Disk=20000MB) ...
🐳  Preparing Kubernetes v1.18.3 on Docker 19.03.12 ...
    ▪ controller-manager.horizontal-pod-autoscaler-upscale-delay=1m
    ▪ controller-manager.horizontal-pod-autoscaler-downscale-delay=2m
    ▪ controller-manager.horizontal-pod-autoscaler-sync-period=10s
🔎  Verifying Kubernetes components...
🌟  Enabled addons: default-storageclass, storage-provisioner
🏄  Done! kubectl is now configured to use "minikube"
```

After creating the cluster with minikube, it is necessary to run the following command to set the `task=core` label to the `minikube` node:

```
kubectl label nodes minikube task=core
```

### Running the webapp service

- **First of all, you have to run the backend service `producer` before starting the frontend.** Instructions in [rpl-2.0-backend](https://github.com/alelevinas/RPL-2.0).

- If you don't have the queue up and running in the cluster, you will have to comment some lines in the `nginx.conf`:
  - https://github.com/reinvent-fiuba/RPL-2.0-web/blob/9ca141f0108b48d4bd2e2297b7bfa4d3c5b10e3a/nginx.conf#L29..L32
  - https://github.com/reinvent-fiuba/RPL-2.0-web/blob/9ca141f0108b48d4bd2e2297b7bfa4d3c5b10e3a/nginx.conf#L72..L91


- Get the ip address of the cluster:

```shell script
minikube ip
```

- Set the backend cluster url in the `.env.development`,

```
API_BASE_URL=http://<cluster_ip>:30020
```

- Build the minified static html and js in the `dist` folder (then we have to serve `dist/index.html` it with our prefered static server (node serve, nginx, php, etc)):

```shell script
npm i
npm run build-dev # This command is the same as build but using the .env.development instead of the .env.production
```

- Build the docker image with:

```shell script
eval $(minikube docker-env)
docker build -t gcr.io/fiuba-rpl/rpl-web:latest .
```

- Create the kubernetes webapp service and deployment:
```shell script
kubectl apply -f ./kubernetes/services/web.yaml
kubectl apply -f kubernetes/deployments/web.yaml
```

Note: If you are having issues with the Docker image in kubernetes, maybe you should add the `imagePullPolicy: IfNotPresent` to the `kubernetes/deployments/web.yaml`

Now we should have RPL-2.0-web up and running with kubernetes :rocket:

We are using a reverse_proxy nginx as a docker image so all requests to backend should be directed to the kubernetes cluser, webapp service.

Every api call directed to `<webapp_service>/api/*` will be redirected to `<producer_service>/api/*`.

For example, to get the ip address of my webapp service one should do

- Get ports of each service:
```shell script
kubectl get services
```

> Output:
```
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                         AGE
consumer     NodePort    10.99.192.154   <none>        8888:31000/TCP                                                  6s
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP                                                         27m
producer     NodePort    10.101.10.198   <none>        80:32000/TCP                                                    29s
queue        NodePort    10.105.128.2    <none>        15671:30000/TCP,15672:31157/TCP,5671:31353/TCP,5672:32440/TCP   27m
webapp       NodePort    10.102.219.139   <none>       80:30022/TCP                                                    33m
```

- If you must, you should change the `API_BASE_URL` env to `<cluster_ip>:30022`.

You may need to update the docker image and force a pod restart.

You can restart a deployment with the following command:

```shell script
kubectl rollout restart deployment webapp
```

## How to run it in PROD local with a Docker Image

- Be sure to have all environment variables defined in `.env.development`
    - For the API_BASE_URL, either use localhost:80 and replace the upstream in the nginx config or use the backend URL
- Build bundle

```
npm run install
npm run build-dev
```

- Modify `nginx.conf` with the correct upstream
- For localhost add:

```
upstream producer {
	      server 127.0.0.1:8080;
	}
```

- Build docker image

```
docker build -t rpl-web  -f Dockerfile .
```

- Run image
    - [Linux] For localhost make sure to add `--network="host"` flag so that `127.0.0.1:8080` points to the host machine where you are running the server
    - [Mac OS] Create a docker network

```
docker run --network="host"  rpl-web:latest
```

- open localhost:80
