# ![artifacter-logo](https://raw.githubusercontent.com/arthmoeros/artifacter-ui/master/src/assets/img/rsz_artifacter-logo.png)@artifacter/webapi

### Artifacter's artifacts webapi core connector

<!--### Checkout Github's parsed README for a better visualization! -> https://github.com/arthmoeros/artifacter-webapi-->

#### What's this? - Intro
This is Artifacter's Web API connector for the core (previously coupled with @artifacter/core), it makes use of the core module to expose all its API via a RESTful API.

#### How do I use this?
You can git clone this same repo and start it just like this
```bash
git clone https://github.com/arthmoeros/artifacter-webapi/
npm install
npm start
```

...or use it as a npm package, and start it using the provided bin
```bash
npm install --save @artifacter/webapi
node_modules/.bin/artifacter-serve
```

In both cases, by default the config and temporary directories are within the core base folder, you can customize these paths using the environment variables *ARTIFACTER_CONFIG* and *ARTIFACTER_TMP*, here is a unix example:

```bash
# Default is ./config
export ARTIFACTER_CONFIG=/etc/artifacter_custom
# Default is ./tmp
export ARTIFACTER_TMP=/var/artifacter_custom
```

#### What's in here? - API
Artifacter's Web API runs as an expressJS server, it has the same 4 services available in the API as the core, via RESTful.

---------------------------------
#### Get Form Configurations list

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/forms | GET | application/x-www-form-urlencoded | application/json

Retrieves a list of presumably valid form configurations ids on the configuration path of Artifacter. It returns a string array containing each form configuration ID (file name without extension).

#### Get Form Configuration

Resource | Method | Request ContentType   |    Response ContentType
-------- | ------ | --------------------- | -----------------------
/forms/:id | GET | application/x-www-form-urlencoded | application/json

Retrieves the contents of a identified form configuration file on Artifacter as a json string.

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
#### How do I handle all the Configuration? - Artifacter's Core Configuration
Check out the @artifacter/core [README](https://github.com/arthmoeros/artifacter-core#how-do-i-make-a-form-configuration---form-configuration-schema)

<!--
#### I don't want a RESTful API, I want an UI and everything working - UI and Docker Image
If you need an User Interface for this, use [@artifacter/ui](https://github.com/arthmoeros/artifacter-ui) and connect it to the Artifacter's API host.

Or if you want everything setup and ready to go, you can pull the docker image from Docker Hub and run it, if you want to run it with your own configuration, bind a volume to a host path with it.

[![dockeri.co](http://dockeri.co/image/arthmoeros/artifacter)](https://hub.docker.com/r/arthmoeros/artifacter/)

```bash
docker pull arthmoeros/artifacter
docker run -v <host-path>:/etc/artifacter/ -p <host-port>:8080 -d arthmoeros/artifacter
```

The Docker image stores the temporary files within the container, the config folder must be provided as a binded volume in the *docker run* command, otherwise it will start with the sample configuration.
-->
