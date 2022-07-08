import { HandlerProps } from '../../server';
import { pool } from '../../config/PsqlDBConfig';
import StatusCode from '../../config/StatusCode';

export const getOrganizations: HandlerProps = async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM public."Organizations"');
		res.status(StatusCode.OK).json(rows);
	} catch (error) {
		console.log(error);

		res.status(StatusCode.NOTFOUND).send(error.name);
	}
};
export const createOrganization: HandlerProps = async (req, res) => {
	const { name, logo, description } = req.body;
	try {
		const query = {
			text: 'INSERT INTO public."Organization" ("name", "logo", "description") values($1,$2,$3) RETURNING *',
			values: [name, logo, description]
		};
		const { rows } = await pool.query(query);
		res.status(StatusCode.CREATED).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.BAD_REQUEST).send('Somethin went wrong');
		console.log(error);
	}
};

export const getOrganizationById: HandlerProps = async (req, res) => {
	const { org_id } = req.body;
	const query = {
		text: 'SELECT * FROM public."Organization" WHERE "org_id" = $1',
		values: [org_id]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.FOUND).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
	}
};

export const updateOrganizationLogo: HandlerProps = async (req, res) => {
	const { org_id, logo } = req.body;

	const query = {
		text: 'UPDATE public."Organization" SET "logo"=$2  WHERE "org_id" = $1  RETURNING * ',
		values: [org_id, logo]
	};
	const { rows } = await pool.query(query);
	res.status(StatusCode.OK).json(rows[0]);
};
export const updateOrganizationImage: HandlerProps = async (req, res) => {
	const { org_id, background_image } = req.body;

	const query = {
		text: 'UPDATE public."Organization" SET "background_image"=$2 WHERE "org_id" = $1  RETURNING * ',
		values: [org_id, background_image]
	};
	const { rows } = await pool.query(query);
	res.status(StatusCode.OK).json(rows[0]);
};
export const updateOrganizationDescription: HandlerProps = async (req, res) => {
	const { org_id, description } = req.body;
	try {
		const query = {
			text: 'UPDATE public."Organization" SET "description"=$2 WHERE "org_id" = $1  RETURNING * ',
			values: [org_id, description]
		};
		const { rows } = await pool.query(query);
		res.status(StatusCode.OK).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.BAD_REQUEST).json(error);
	}
};
export const updateOrganizationData: HandlerProps = async (req, res) => {
	const { org_id, logo, background_image, description } = req.body;
	const query = {
		text: 'UPDATE public."Organization" SET "logo"=$2, "background_image"=$3 , "description"=§4 WHERE "org_id" = $1  RETURNING * ',
		values: [org_id, logo, background_image, description]
	};
	const { rows } = await pool.query(query);
	res.status(StatusCode.OK).json(rows[0]);
};
export const deleteOrganization: HandlerProps = async (req, res) => {
	const { org_id } = req.body;
	const query = {
		text: 'DELETE FROM public."Organization" WHERE "org_id" = $1',
		values: [org_id]
	};
	try {
		await pool.query(query);
		res.status(StatusCode.OK).send('Deleted organization');
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
	}
};

//INSERT INTO public."Organization" ("name", "logo", "description") values ('Volvo', 'https://volvo.se', 'Car manufactor')
