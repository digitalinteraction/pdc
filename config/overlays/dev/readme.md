# PDC dev

**setup database**

```sh
# ssh openlab@dig-wing
# cd /srv/apps/openlab/postgres
# docker-compose exec postgres su - root

createdb -U openlab pdc_2022_dev
createuser -PU openlab pdc_2022_dev
psql -U openlab
> grant all privileges on database pdc_2022_dev to pdc_2022_dev;
```

**setup auth**

```sh
# cd to/this/folder
# kubectx openlab
# kubens pdc-2022

kubectl create secret generic dev-basic-auth --from-file secrets/auth
```
