import { HandlerProps } from '../../server';
import { pool } from '../../config/PsqlDBConfig';
import StatusCode from '../../config/StatusCode';
import dotenv from 'dotenv';

dotenv.config();
/**  */
export const getCards: HandlerProps = async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM public."Cards"');
		res.status(StatusCode.OK).json(rows);
	} catch (error) {
		console.log(error);

		res.status(StatusCode.NOTFOUND).send(error.name);
	}
};
export const getCardsByNameOrId: HandlerProps = async (req, res) => {
	const { card_name, card_id } = req.body;
	let query;
	try {
		if (card_name) {
			query = {
				text: 'SELECT * FROM public."Cards" WHERE "card_name"=$1',
				values: [card_name]
			};
		} else if (card_id) {
			query = {
				text: 'SELECT * FROM public."Cards" WHERE "card_name"=$1',
				values: [card_id]
			};
		} else if (!card_id || !card_name) {
			res.status(StatusCode.BAD_REQUEST).json('Empty field');
		}

		const { rows } = await pool.query(query);
		res.status(StatusCode.OK).json(rows);
	} catch (error) {
		console.log(error);

		res.status(StatusCode.NOTFOUND).send(error.name);
	}
};

/* req: org_id */
export const getCardsByOrgId: HandlerProps = async (req, res) => {
	const { org_id } = req.body;
	const query = {
		// text: 'SELECT * FROM public."Cards" where "org_id"=$1',
		text: `SELECT C.card_id, C.card_name, C.card_description, C.card_price, C.card_original_price, C.card_url, OC.org_id,O.org_name 
		FROM public."Cards" as C
		JOIN public."Organization_cards" as OC 
		on C.card_id = OC.card_id
		JOIN public."Organizations" as O 
		on OC.org_id = O.org_id
		WHERE OC.org_id = $1 
		ORDER BY C.card_price NULLS FIRST `,
		values: [org_id]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.OK).json(rows);
	} catch (error) {
		console.log(error);

		res.status(StatusCode.NOTFOUND).send(error.name);
	}
};
/** req: name, description, price, original_price, url,
 * if org_id = links to organization   */
export const createCard: HandlerProps = async (req, res) => {
	const { card_name, card_description, card_price, card_original_price, card_url, org_id } =
		req.body;

	try {
		const query = {
			text: `INSERT INTO public."Cards" 
			("card_name", "card_description", "card_price","card_original_price" ,"card_url" ) 
			values($1,$2,$3, $4,$5)
			RETURNING *`,
			values: [card_name, card_description, card_price, card_original_price, card_url]
		};
		const { rows } = await pool.query(query);

		/*if (org_id) {
			const junktionQuery = {
				text: `INSERT INTO public."Organization_cards"
				("org_id", "card_id")
				 values ($1,$2)
				 RETURNING *`,
				values: [org_id, rows[0].card_id]
			};
			const { rows: connectedData } = await pool.query(junktionQuery);
			res.status(StatusCode.CREATED).json({
				data: rows[0],
				connectedData
			});
		} else {*/

		res.status(StatusCode.CREATED).json(rows[0]);
		// }
	} catch (error) {
		if (error.code == 23505) {
			//Name and price exists already
			try {
				const query = {
					text: `SELECT "card_id" from public."Cards" WHERE card_name =$1`,
					values: [card_name]
				};
				const { rows } = await pool.query(query);
				// const junktionQuery = {
				// 	text: `INSERT INTO public."Organization_cards"
				// 	("org_id", "card_id")
				// 	 values ($1,$2)
				// 	 RETURNING *`,
				// 	values: [org_id, rows[0].card_id]
				// };
				// const { rows: connectedData } = await pool.query(junktionQuery);
				res.status(StatusCode.BAD_REQUEST).json({
					message:
						'Card with same name and price exists already, link this card to organization',
					data: rows[0]
				});
			} catch (error) {
				// res.status(StatusCode.BAD_REQUEST).send(error.detail);
			}

			// console.log(error);
		}
		// res.status(StatusCode.BAD_REQUEST).json(error.detail);
		//console.log(error);
	}
};

export const linkOrganizationToCard: HandlerProps = async (req, res) => {
	const { org_id, card_id } = req.body;
	try {
		const query = {
			text: `INSERT INTO public."Organization_cards"
			 ("org_id", "card_id")
			  values ($1,$2)
			   RETURNING *`,
			values: [org_id, card_id]
		};
		const { rows } = await pool.query(query);
		res.status(StatusCode.CREATED).json(rows[0]);
	} catch (error) {
		if (error.code == '23505') {
			res.json('Duplicated Card');
		} else {
			console.log(error.code);
			res.sendStatus(StatusCode.BAD_REQUEST);
		}
	}
};

export const deleteCards: HandlerProps = async (req, res) => {
	try {
		if (req.body.id === process.env.DELETE_CODE) {
			const { rows } = await pool.query('DELETE FROM public."Cards"');
			res.status(StatusCode.OK).json(rows);
		} else {
			res.sendStatus(StatusCode.UNAUTHORIZED);
		}
	} catch (error) {
		console.log(error);

		res.status(StatusCode.NOTFOUND).json(error.name);
	}
};

export const deleteCardById: HandlerProps = async (req, res) => {
	const { card_id } = req.body;
	const query = {
		text: `DELETE FROM public."Cards" WHERE "card_id"=$1`,
		values: [card_id]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.OK).json(rows);
	} catch (error) {
		console.log(error);

		res.status(StatusCode.BAD_REQUEST).json(error.severity);
	}
};

export const getAllLinkedCards: HandlerProps = async (req, res) => {
	const query = {
		text: 'SELECT * FROM public."Organization_cards" '
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.FOUND).json(rows);
	} catch (error) {
		console.log(error);
	}
};
export const deleteLinkedCardsAll: HandlerProps = async (req, res) => {
	try {
		await pool.query('DELETE FROM public."Organization_cards"');
		res.sendStatus(StatusCode.OK);
	} catch (error) {
		console.log(error);
	}
};
//TODO SHOULD BE TESTED LIKE HELL
export const updateCardData: HandlerProps = async (req, res) => {
	const { card_price, card_url, card_description, card_id } = req.body;
	let query;
	if (!card_id) {
		res.status(StatusCode.BAD_REQUEST).json('cardId is mandatory');
	} else if (!card_price && !card_url && !card_description) {
		res.status(StatusCode.BAD_REQUEST).send('Please select column to update');
	}
	if (card_price && !card_url && !card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_price"=$2  WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_price]
		};
	}
	if (card_url && !card_price && !card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_url"=$2  WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_url]
		};
	}
	if (card_description && !card_price && !card_url) {
		query = {
			text: 'UPDATE public."Cards" SET "card_description"=$2  WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_description]
		};
	} else if (card_price && card_url && !card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_price"=$2 , "card_url"=$3 WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_price, card_url]
		};
	} else if (card_price && card_url && card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_price"=$2 , "card_url"=$3 , "card_description"=$4 WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_price, card_url, card_description]
		};
	} else if (card_price && card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_price"=$2, "card_description"=$3 WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_price, card_description]
		};
	} else if (card_url && card_description) {
		query = {
			text: 'UPDATE public."Cards" SET "card_url"=$2 "card_description"=$3 WHERE "card_id" = $1 RETURNING *',
			values: [card_id, card_url, card_description]
		};
	}

	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.OK).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.BAD_REQUEST).json(error);
		console.log(error);
	}
};
