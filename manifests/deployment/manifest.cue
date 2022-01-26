package push_pull_deployment

import (
  k "kumori.systems/kumori/kmv"
  s "kumori.systems/pushpull/service:pushpull_service"
)

#Manifest: k.#DeploymentManifest & {

  ref: {
    domain: "kumori.systems.pushpull"
    name: "pushpull_cfg"
    version: [0,0,1]
  }

  description: {

    service: s.#Manifest

    configuration: {
      // Assign the values to the service configuration parameters
      parameter: {}
      resource: {}
    }

    hsize: {
      frontend: {
        $_instances: 1
      }
      worker: {
        $_instances: 1
      }
      cola: {
        $_instances: 1
      }
      database: {
        $_instances: 1
      }
    }

  }
}

// Exposed to be used by kumorictl tool (mandatory)
deployment: (k.#DoDeploy & {_params:manifest: #Manifest}).deployment
