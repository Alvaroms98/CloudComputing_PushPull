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

      worker: {
        name: "worker"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "alvaromoure1998/push_pull2:worker"
        }

        mapping: {
          // Variables de entorno
          env: {
            NATS_ENDPOINT: value: "0.natsclient:4222"
            DB_ENDPOINT: value: "tcp://0.dbclient:80"
          }
        }
      }
    }
  }
}
