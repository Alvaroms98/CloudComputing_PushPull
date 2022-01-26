// Name of the CUE module defined in this workspace
// The workspace includes three packages:
// - Manifest definition of the Kumori Components "frontend" and "worker"
// - Manifest definition of the Kumori Service Application "calculator"
// - Manifest definition to deploy the Kumori Service Application "calculator"
//module: "kumori.systems/examples/calculator"
module: "kumori.systems/examples/pushpull"

// TODO: kumori service model should be opensource, whith no credentials
creds = {
  kumori: {
    type: "token",
    username: "cuacua",
    token: "xB17FTzNCsgko3533Mnf"
  }
}

dependencies: {
  // Kumori service model
  "kumori.systems/kumori": {
    repository: "https://gitlab.com/kumori/cuemodules/kumori"
    credentials: creds.kumori
    tag: "2.0.4"
  }
}
