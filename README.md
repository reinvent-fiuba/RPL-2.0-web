# RPL-2.0-web

## How to run it in DEV

Set backend URL in `.env` file

```
nvm use
```

```
npm i
```

```
npm start
```

## How to run it in PROD in a Docker Image

- Be sure to have all environmental variables defined in .env.production
    - For the API_BASE_URL, either use localhost:80 and replace the upstream in the nginx config or use the backend URL
- Build bundle

```
npm run install
npm run build
```

- Modify nginx.conf with the correct upstream 
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


## How to run it in PROD in a Kubernetes Cluster

```
npm i
```

```
npm run build
```

This generates the minified static html and js in the `dist` folder. Then we have to serve `dist/index.html` it with our prefered static server (node serve, nginx, php, etc)


### Local with minikube
#### Configuration
- Download and install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- Download and install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)


YOU SHOULD FIRST HAVE RUNNING THE BACKEND SERVICE `producer`. Instructions in [rpl-2.0-backend](https://github.com/alelevinas/RPL-2.0)

#### Running the webapp service

If not set, set frontend minikube cluster ip and web app service port (`<cluster_ip>:<port>`) in `.env` file.

We are using a reverse_proxy nginx as a docker image so all requests to backend should be directed to the kubernetes cluser, webapp service.

Every api call directed to `webapp_service/api/whatever` will be redirected to `consumer_service/api/whatever`.

For example, to get the ip address of my webapp service one should do


- Create the message webapp service:
```shell script
kubectl create -f ./kubernetes/services/web.yaml
kubectl create -f ./kubernetes/deployments/web.yaml
```

- Get the ip address of the cluster:
```shell script
minikube ip
```

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

