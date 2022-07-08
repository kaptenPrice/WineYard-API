import { Application } from 'express';
import {
	getOrganizations,
	createOrganization,
	deleteOrganization,
	getOrganizationById,
	updateOrganizationLogo,
	updateOrganizationImage,
	updateOrganizationData,
	updateOrganizationDescription
} from '../controller/Organization.controller';

const organizationsRoutes = (app: Application) => {
	app.get('/organizations', getOrganizations);
	app.post('/organization', createOrganization);
	app.delete('/organization', deleteOrganization);
	app.get('/organization', getOrganizationById);
	app.put('/organizationlogo', updateOrganizationLogo);
	app.put('/organizationimage', updateOrganizationImage);
	app.put('/organizationdesc', updateOrganizationDescription);
	app.put('/organizationdata', updateOrganizationData);
};

export default organizationsRoutes;
