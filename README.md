# notebook-notes-app


## Build 

```shell script
$ skaffold build
```

## Deployment

See [notebook-deployment.git](https://github.com/fbyrne/notebook-deployment) for notes on deployment to a kubernetes cluster.

## Dev Cycle

```shell script
$ eval $(minikube docker-env)
$ skaffold build && kubectl -n notebook-dev rollout restart deployment notes-app
```