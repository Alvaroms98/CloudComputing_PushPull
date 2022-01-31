package frontend

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "frontend"
    version: [0,0,1]
  }

  description: {

    srv: {
      server: {
        restapi: { protocol: "http", port: 8080 }
      }
      client: {
        natsclient: { protocol: "tcp" }
        dbclient: { protocol: "tcp" }
      }
    }

    config: {
      resource: {}
    }

    size: {
      $_memory: "100Mi"
      $_cpu: "100m"
      $_bandwidth: "10M"
    }

    code: {

      frontend: {
        name: "frontend"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "alvaromoure1998/cc_push_pull:frontend"
        }

        mapping: {
          // Variables de entorno
          env: {
            HTTP_REST_API_PORT: value: strconv.FormatUint(srv.server.restapi.port, 10)
            WORKER_ENDPOINT: value: "0.natsclient"
            DB_ENDPOINT: value: "tcp://0.dbclient"
          }
        }
      }

    }
  }
}
