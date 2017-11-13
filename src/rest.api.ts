import { RestService, RestMethod, ContentType } from "@qsdt/common";
import { Request, Response, NextFunction } from "express";

import { QSDT } from "@qsdt/core";

/**
 * @class RestApi
 * @see npm @qsdt/worker
 * @author arthmoeros (Arturo Saavedra) artu.saavedra@gmail.com
 * 
 * This class defines the methods available as a REST API, each method for this
 * purpose must be decorated with @RestService
 * 
 */
export class RestApi {

	private readonly api: QSDT = new QSDT();

	/**
	 * Requests an artifact generation and responds synchronously with an uuid
	 * to retrieve the generated artifacts
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	@RestService({
		method: RestMethod.POST,
		resource: "/generatedArtifacts",
		requestContentType: ContentType.applicationJson,
		responseContentType: ContentType.applicationJson
	})
	public postArtifactGeneration(req: Request, res: Response, next: NextFunction) {
		this.api.requestArtifactGeneration(req.body).then((tmpName) => {
			res.location("/generatedArtifacts/" + tmpName);
			res.status(201);
			res.end();
		});
	}

	/**
	 * Retrieves a generated artifacts file using an uuid, once is retrieved it expires
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	@RestService({
		method: RestMethod.GET,
		resource: "/generatedArtifacts/:uuid",
		requestContentType: ContentType.urlEncoded,
		responseContentType: ContentType.applicationZip
	})
	public getGeneratedArtifacts(req: Request, res: Response, next: NextFunction) {
		let uuid: string = req.params['uuid'];
		let zipFile: Buffer = this.api.getGeneratedArtifacts(uuid);
		res.setHeader('Content-disposition', 'attachment; filename=generatedArtifacts.zip');
		res.status(200);
		res.end(zipFile);
	}

	/**
	 * Retrieves a list of available forms configurations for QSDT
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	@RestService({
		method: RestMethod.GET,
		resource: "/forms",
		requestContentType: ContentType.urlEncoded,
		responseContentType: ContentType.applicationJson
	})
	public getConfigurations(req: Request, res: Response, next: NextFunction) {
		console.log("holi");
		this.api.getForms().then((response) => {
			res.status(200);
			res.end(JSON.stringify(response));
		}).catch((err) => {
			console.log(err)
		});
	}

	/**
	 * Retrieves a specific forms configuration for QSDT with the id provided
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	@RestService({
		method: RestMethod.GET,
		resource: "/forms/:id",
		requestContentType: ContentType.urlEncoded,
		responseContentType: ContentType.applicationJson
	})
	public getConfiguration(req: Request, res: Response, next: NextFunction) {
		let id: string = req.params['id'];
		this.api.getForm(id).then((configuration) => {
			res.status(200);
			res.end(configuration);
		});
	}

}