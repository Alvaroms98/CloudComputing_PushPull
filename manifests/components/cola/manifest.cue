package cola

import (
  k "kumori.systems/kumori/kmv"
  "strconv"
)

#Manifest : k.#ComponentManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "cola"
    version: [0,0,1]
  }

  description: {

    srv: {
      server: {
        natsserver: { protocol: "tcp", port: 4222 }
      }
      client: {}
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

      cola: {
        name: "cola"

        image: {
          hub: {
            name: "registry.hub.docker.com"
            secret: ""
          }
          tag: "sanreinoso96/cc_push_pull:nats"
        }

        mapping: {
          // Variables de entorno
          env: {}
        }
      }

    }
  }
}
