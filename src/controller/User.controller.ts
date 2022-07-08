import { HandlerProps } from '../../server';
import { pool } from '../../config/PsqlDBConfig';
import StatusCode from '../../config/StatusCode';

export const getUsers: HandlerProps = async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM public."Users"');
		res.status(StatusCode.OK).json(rows);
		// pool.end();
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error.name);
		console.log(error);
	}
};
export const getUserById: HandlerProps = async (req, res) => {
	const { user_id } = req.body;
	if (!user_id) {
		res.status(StatusCode.BAD_REQUEST).send('Missing request details');
	}
	const query = {
		text: 'SELECT * FROM public."Users" WHERE "user_id" = $1',
		values: [user_id]
	};
	console.log(query);

	try {
		const { rows } = await pool.query(query);

		res.status(StatusCode.OK).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send('Could not find ');
	}
};

export const createUser: HandlerProps = async (req, res) => {
	const { brp_id, org_id } = req.body;
	const query = {
		text: 'INSERT INTO public."Users" (brp_id ,org_id ) VALUES ($1, $2) RETURNING *',
		values: [brp_id, org_id]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.CREATED).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.BAD_REQUEST).send('Somethin went wrong');
		console.log(error);
	}
};

export const deleteUser: HandlerProps = async (req, res) => {
	const { user_id } = req.body;
	const query = {
		text: 'DELETE FROM public."Users" WHERE "user_id" = $1',
		values: [user_id]
	};
	try {
		await pool.query(query);
		res.status(StatusCode.OK).send(`User deleted with "user_id": ${user_id}`);
	} catch (error) {
		res.sendStatus(StatusCode.FORBIDDEN).send('Impossible');
		console.log(error);
	}
};

export const updateUser: HandlerProps = async (req, res) => {
	const { user_id, active } = req.body;

	const query = {
		text: 'UPDATE public."Users" SET "active"=$2 WHERE "user_id" = $1  RETURNING * ',
		values: [user_id, active]
	};
	const { rows } = await pool.query(query);
	res.status(StatusCode.OK).json(rows[0]);
};

// user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
/**CREATE TABLE "Cards" (
    "card_id" uuid Primary Key NOT NULL DEFAULT uuid_generate_v4(),
"name" Varchar(50) ,
    "description" text ,
    "price" Numeric, 
    "original_price" Numeric,
    "url" text,
    "org_id" uuid [] ,
 FOREIGN KEY (EACH ELEMENT OF "org_id") REFERENCES public."Organizations"

) */
