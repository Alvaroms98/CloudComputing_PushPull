package pushpull_service

import (
  k "kumori.systems/kumori/kmv"
  f "kumori.systems/examples/pushpull/components/frontend"
  w "kumori.systems/examples/pushpull/components/worker"
  c "kumori.systems/examples/pushpull/components/cola"
  db "kumori.systems/examples/pushpull/components/database"
)

#Manifest: k.#ServiceManifest & {

  ref: {
    domain: "kumori.systems.examples"
    name: "pushpull_service"
    version: [0,0,1]
  }

  description: {

    //
    // Kumori Component roles and configuration
    //

    // Configuration (parameters and resources) to be provided to the Kumori
    // Service Application.
    config: {
      parameter: {}
      resource: {}
    }

    // List of Kumori Components of the Kumori Service Application.
    role: {
      frontend: k.#Role
      frontend: artifact: f.#Manifest

      worker: k.#Role
      worker: artifact: w.#Manifest

      cola: k.#Role
      cola: artifact: c.#Manifest

      database: k.#Role
      database: artifact: db.#Manifest
    }

    // Configuration spread:
    // Using the configuration service parameters, spread it into each role
    // parameters
    role: {
      frontend: {
        cfg: {
          parameter: {}
          resource: {}
        }
      }

      worker: {
        cfg: {
          parameter: {
            appconfig: {}
          }
          resource: {}
        }
      }

      cola: {
        cfg: {
          parameter: {
            appconfig: {}
          }
          resource: {}
        }
      }

      database: {
        cfg: {
          parameter: {
            appconfig: {}
          }
          resource: {}
        }
      }
    }

    //
    // Kumori Service topology: how roles are interconnected
    //

    // Connectivity of a service application: the set of channels it exposes.
    srv: {
      server: {
        api: { protocol: "http", port: 80 }
      }
    }

    // Connectors, providing specific patterns of communication among channels.
    connector: {
      serviceconnector: { kind: "lb" }
      natsconnector: { kind: "full" }
      dbconnector: { kind: "full" }
    }

    // Links specify the topology graph.
    link: {

      // Outside -> FrontEnd (LB connector)
			self: api: to: "serviceconnector"
      serviceconnector: to: frontend: "restapi"


      // ******** Clientes de la cola ************

      // FrontEnd -> Cola (FULL connector)
      frontend: natsclient: to: "natsconnector"

      // Worker -> Cola (Full connector)
      worker: natsclient: to: "natsconnector"

      // proxy inverso de nats
      natsconnector: to: cola: "natsserver"

      // ********************************************



      // ******** Clientes de la base de datos ************

      // FrontEnd -> Database (FULL connector)
      frontend: dbclient: to: "dbconnector"

      // Worker -> Database (Full connector)
      worker: dbclient: to: "dbconnector"

      // proxy inverso de database
      dbconnector: to: database: "dbsrv"

      // ********************************************

    }
  }
}
