package worker

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "worker"
    version: [0,0,1]
  }

  description: {

    srv: {
      server: {}
      client: {
        dbclient: { protocol: "tcp" }
        natsclient: { protocol: "tcp" }
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

      worker: {
        name: "worker"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "sanreinoso96/cc_push_pull:worker"
        }

        mapping: {
          // Variables de entorno
          env: {
            NATS_ENDPOINT: value: "0.natsclient:4222"
            DB_ENDPOINT: value: "0.dbclient:3001"
          }
        }
      }
    }
  }
}
