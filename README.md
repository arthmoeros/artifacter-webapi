# ![qsdt-logo](https://raw.githubusercontent.com/arthmoeros/qsdt-ui/master/src/assets/img/rsz_qsdt-logo.png)@qsdt/webapi

### QSDT's webapi core connector

<!--### Checkout Github's parsed README for a better visualization! -> https://github.com/arthmoeros/qsdt-webapi-->

#### What's this? - Intro
This is QSDT's Web API connector for the core (previously coupled with @qsdt/core), it makes use of the core module to expose all its API via a RESTful API.

#### How do I use this?
You can git clone this same repo and start it just like this
```bash
git clone https://github.com/arthmoeros/qsdt-webapi/
npm install
npm install -g typescript # if you dont have typescript installed
tsc -P .
npm start
```

...or use it as a npm package, and start it using the provided bin
```bash
npm install --save @qsdt/webapi
node_modules/.bin/qsdt-serve
```

In both cases, by default the config and temporary directories are within the core base folder, you can customize these paths using the environment variables *QSDT_CONFIG* and *QSDT_TMP*, here is a unix example:

```bash
# Default is ./config
export QSDT_CONFIG=/etc/qsdt_custom
# Default is ./tmp
export QSDT_TMP=/var/qsdt_custom
```

#### What's in here? - API
QSDT's Web API runs as an expressJS server, it has the same 4 services available in the API as the core, via RESTful.

---------------------------------
#### Get Form Configurations list

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/forms | GET | application/x-www-form-urlencoded | application/json

Retrieves a list of presumably valid form configurations ids on the configuration path of QSDT. It returns a string array containing each form configuration ID (file name without extension).

#### Get Form Configuration

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/forms/:id | GET | application/x-www-form-urlencoded | application/json

Retrieves the contents of a identified form configuration file on QSDT as a json string.

#### Request Artifact Generation

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/generatedArtifacts | POST | application/json | application/json

Requests an artifact generation and returns an uuid to retrieve the generated artifacts. The RESTful API responds with the location of the created resource (generated artifact) in the **Location** header.

#### Retrieve generated artifacts

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/generatedArtifacts/:uuid | GET | application/x-www-form-urlencoded | application/zip

Retrieves a generated artifact, once is retrieved it is deleted from the temporary folder, any subsequent try to get the same artifact will result in a 404 status code.

---------------------------------
#### How do I handle all the Configuration? - QSDT's Core Configuration
Check out the @qsdt/core [README](https://github.com/arthmoeros/qsdt-core#how-do-i-make-a-form-configuration---form-configuration-schema)

#### I don't want a RESTful API, I want an UI and everything working - UI and Docker Image
If you need an User Interface for this, use [@qsdt/ui](https://github.com/arthmoeros/qsdt-ui) and connect it to the QSDT's API host.

Or if you want everything setup and ready to go, you can pull the docker image from Docker Hub and run it, if you want to run it with your own configuration, bind a volume to a host path with it.

[![dockeri.co](http://dockeri.co/image/arthmoeros/qsdt)](https://hub.docker.com/r/arthmoeros/qsdt/)

```bash
docker pull arthmoeros/qsdt
docker run -v <host-path>:/etc/qsdt/ -p <host-port>:8080 -d arthmoeros/qsdt
```

The Docker image stores the temporary files within the container, the config folder must be provided as a binded volume in the *docker run* command, otherwise it will start with the sample configuration.
