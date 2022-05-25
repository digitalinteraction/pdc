# PDC dev

**setup database**

```sh
# ssh openlab@dig-wing
# cd /srv/apps/openlab/postgres
# docker-compose exec postgres su - root

createdb -U openlab pdc_2022_prod
createuser -PU openlab pdc_2022_prod
psql -U openlab
> grant all privileges on database pdc_2022_prod to pdc_2022_prod;
```
