package database

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "database"
    version: [0,0,1]
  }

  description: {

    srv: {
      server: {
        dbsrv: { protocol: "tcp", port: 3001 }
      }
      client: {}
    }

    size: {
      $_memory: "500Mi"
      $_cpu: "100m"
      $_bandwidth: "10M"
    }

    // POD con dos contenedores, uno para mariadb y otro para la lógica-endpoint
    code: {

      endpointdb: {
        name: "endpointdb"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "alvaromoure1998/push_pull2:database"
        }

        mapping: {
          // Variables de entorno
          env: {
            DB_PASSWORD: value: "cc-pushpull"
            DB_HOST: value: "localhost"
          }
        }
      }

      mariadb: {
        name: "mariadb"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "alvaromoure1998/push_pull2:mariadb"
        }
        mapping: {
          env: {
            MYSQL_ROOT_PASSWORD: value: "cc-pushpull"
          }
        }
      }

    }
  }
}

