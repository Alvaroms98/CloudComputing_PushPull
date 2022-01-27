package mariadb

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "mariadb"
    version: [0,0,1]
  }

  description: {

    srv: {
      server: {
        mariasrv: { protocol: "tcp", port: 3306 }
      }
      client: {}
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