import { Application } from 'express';
import {
	createCard,
	linkOrganizationToCard,
	deleteCards,
	getCards,
	getCardsByOrgId,
	getAllLinkedCards,
	deleteLinkedCardsAll,
	deleteCardById,
	getCardsByNameOrId,
	updateCardData
} from '../controller/Card.controller';

export const cardRoutes = (app: Application) => {
	app.get('/cards', getCards);
	app.get('/card', getCardsByNameOrId);
	app.put('/card', updateCardData);
	app.post('/card', createCard);
	app.delete('/deletecards', deleteCardById);
	app.get('/organizationcards', getCardsByOrgId);
	app.post('/companycard', linkOrganizationToCard);
	app.get('/linkedcards', getAllLinkedCards);
	app.post('/linkcard', linkOrganizationToCard);
	app.delete('/deletelinkedcardsall', deleteLinkedCardsAll);

	// app.delete('/deletecards', deleteCardById);
	// app.put("/card",updateCard)
};

//"id":"developerDearFriendsGöteborg"
