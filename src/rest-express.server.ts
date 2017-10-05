import { Application, Router, Response } from "express";
import { Annotation, RestMethod } from "@qsdt/common";

import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import * as fs from "fs";
import * as col from "colors/safe";
import * as path from "path";

import { RestApi } from "./rest.api";
import { ServerConfig } from "./server-config";
import { tmpFilesFolder, configurationsFolder } from "@qsdt/core";

/**
 * @class WorkerHttpApiServer
 * @see npm @qsdt/worker
 * @author arthmoeros (Arturo Saavedra) artu.saavedra@gmail.com
 * 
 * This singleton class starts up a nodejs express server, serving the REST api available
 * to request artifact generation to the Worker
 * 
 */
export class RestExpressServer {

    /**
     * Singleton instance
     */
    private static readonly instance: RestExpressServer = new RestExpressServer();

    public static start() {
    }

    /**
     * Express.js reference
     */
    private expressApp: Application;

    /**
     * Node server reference
     */
    private server: http.Server;

    /**
     * Server port
     */
    private port: number;

    /**
     * Creates the singleton
     */
    private constructor() {
        console.info(col.green("Starting REST express server"));
        console.info(col.gray("Temp files folder is in: " + tmpFilesFolder));
        if (process.env.QSDT_TMP == null) {
            console.info(col.yellow("If you want to set your own Temp files path, set the QSDT_TMP env variable"));
        }
        console.info(col.gray("Config files folder is in: " + configurationsFolder));
        if (process.env.QSDT_CONFIG == null) {
            console.info(col.yellow("If you want to set your own Config files path, set the QSDT_CONFIG env variable"));
        }

        console.info(col.cyan("Setting up express.js"));
        this.expressApp = express();
        console.info(col.cyan("Setting up Middleware"));
        this.setupMiddleware();
        console.info(col.cyan("Setting up routes"));
        this.setupRoutes();
        this.port = ServerConfig.readConfig.listenPort;
        this.expressApp.set("port", (process.env.PORT || this.port));
        console.info(col.cyan("Creating node.js HTTP Server"));
        this.server = http.createServer(this.expressApp);
        this.server.listen(this.expressApp.get("port"));
        this.server.on("error", (error) => this.onError(error));
        this.server.on("listening", () => this.onListening());
        console.info(col.green("Server started"));
    }

    /**
     * Setups de Middleware, CORS uses allowed hosts to invoke this API
     */
    private setupMiddleware() {
        console.info(col.cyan("Setting up CORS to accept only XHR requests from " + ServerConfig.readConfig.corsOptions.origin));
        this.expressApp.use(cors(ServerConfig.readConfig.corsOptions));
        this.expressApp.use(logger("dev"));
    }

    /**
     * Sets the routes using the decorator @RestService
     * on the methods contained into the RestApi class
     */
    private setupRoutes() {
        let router: Router = express.Router();
        let restApi: RestApi = new RestApi();
        let members: string[] = Object.getOwnPropertyNames(RestApi.prototype);

        members.forEach(member => {
            if (typeof restApi[member] == "function") {
                let restMetadata = Annotation.getRestServiceMetadata(restApi, member);
                if (restMetadata) {
                    let routeFunction = this.resolveRouteFunction(router, restMetadata.method);
                    routeFunction.apply(router, [restMetadata.resource, this.resolveBodyParser(restMetadata.requestContentType.value), (req, res, next) => {
                        res.contentType(restMetadata.responseContentType.value);
                        let restMethod = restApi[member];
                        try {
                            restMethod.apply(restApi, [req, res, next]);
                        } catch (error) {
                            this.handleHttpError(error, res);
                        }
                    }]);
                    console.info(col.yellow("Setup route for method RestApi#" + member + " on path '" + restMetadata.resource + "', expects a '" + restMetadata.requestContentType.value + "' on request and a '" + restMetadata.responseContentType.value + "' on response"));
                }
            }
        });
        if (process.env.EMBEDDED_UI) {
            this.expressApp.use('/ui/assets', express.static(path.resolve(__dirname + '/../ui/assets')));
            this.expressApp.use('/ui/js', express.static(path.resolve(__dirname + '/../ui/js')));
            router.get('/ui/*', function (req, res) {
                res.sendFile(path.resolve(__dirname + '/../ui/index.html'));
            });
            console.log(col.green('Embedded UI Flag is present, you can access @qsdt/ui on path \'/ui/\''));
        }
        this.expressApp.use(router);
    }

	/**
	 * Handles a thrown error, if this informs in its message an HTTP status
	 * code, it will handle it within the express.js Response object.
	 * 
	 * If the error cannot be handled, it will be rethrown to get a 500 status code
	 * @param error Error caught
	 * @param res express.js Response object
	 */
    private handleHttpError(error: Error, res: Response) {
        if (/400/.test(error.message)) {
            res.status(400);
            res.end();
        } else if (/404/.test(error.message)) {
            res.status(404);
            res.end();
        } else {
            throw error;
        }
    }

    private resolveRouteFunction(router: Router, method: RestMethod) {
        if (method == RestMethod.POST) {
            return router.post;
        } else if (method == RestMethod.GET) {
            return router.get;
        } else if (method == RestMethod.PUT) {
            return router.put;
        } else if (method == RestMethod.DELETE) {
            return router.delete;
        } else {
            throw Error("Undefined RestMethod");
        }
    }

    private resolveBodyParser(contentType: string): express.RequestHandler {
        if (contentType == "application/json") {
            return bodyParser.json();
        } else if (contentType == "text/plain") {
            return bodyParser.text();
        } else if (contentType == "application/x-www-form-urlencoded") {
            return bodyParser.urlencoded({ extended: true });
        } else {
            return bodyParser.raw();
        }
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    private onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        var bind = typeof this.port === "string"
            ? "Pipe " + this.port
            : "Port " + this.port;

        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    private onListening() {
        var addr = this.server.address()
        var bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port;
        console.info(col.green("Listening on " + bind));
    }

}