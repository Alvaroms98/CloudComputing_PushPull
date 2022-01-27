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
          tag: "alvaromoure1998/cc_push_pull:worker"
        }

        mapping: {
          // Variables de entorno
          env: {
            NATS_ENDPOINT: value: "0.natsclient"
            DB_ENDPOINT: value: "tcp://0.dbclient"
          }
        }
      }
    }
  }
}