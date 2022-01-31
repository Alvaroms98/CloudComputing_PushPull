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
      client: {
        mariadbclient: { protocol: "tcp" }
      }
    }

    // config: {
    //   }
    // }

    size: {
      $_memory: "300Mi"
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
            DB_HOST: value: "0.mariadbclient"
          }
        }
      }

    }
  }
}
