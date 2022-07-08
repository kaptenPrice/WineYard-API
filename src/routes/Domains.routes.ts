import { Application } from 'express';
import {
	createDomain,
	deleteDomain,
	getDomainById,
	getDomainByName,
	getDomains,
	updateDomainName
} from '../controller/Domain.controller';

export const domainsRoutes = (app: Application) => {
	app.post('/domain', createDomain);
	app.get('/domainbyname', getDomainByName);
	app.get('/domains', getDomains);
	app.get('/domainbyid', getDomainById);
	app.put('/domain', updateDomainName);
	app.delete('/domain', deleteDomain);
};
