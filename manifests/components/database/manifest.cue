package database

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.pushpull"
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

    config: {
      resource: {
        objetos: {
          volume: "/var/lib/mysql"
        }
      }
    }

    size: {
      $_memory: "100Mi"
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
          tag: "alvaromoure1998/cc_push_pull:logicadb"
        }

        mapping: {
          // Variables de entorno
          env: {
            DB_PASSWORD: value: "cc-pushpull"
            DB_HOST: value: "mariadb"
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
          tag: "alvaromoure1998/cc_push_pull:mariadb"
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