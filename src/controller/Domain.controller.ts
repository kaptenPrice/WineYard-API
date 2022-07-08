import { HandlerProps } from '../../server';
import { pool } from '../../config/PsqlDBConfig';
import StatusCode from '../../config/StatusCode';

export const createDomain: HandlerProps = async (req, res) => {
	const { domain_name, org_id } = req.body;
	try {
		const query = {
			text: 'INSERT INTO public."Allowed_domains" ("domain_name", "org_id") values($1,$2) RETURNING *',
			values: [domain_name, org_id]
		};
		const { rows } = await pool.query(query);
		res.status(StatusCode.CREATED).json(rows[0]);
	} catch (error) {
		if (error.code === '23505') {
			res.status(StatusCode.BAD_REQUEST).send(error.detail);
		}
		res.status(StatusCode.BAD_REQUEST).send('Something went wrong');
		console.log(error);
	}
};

export const getDomains: HandlerProps = async (req, res) => {
	const query = {
		text: 'select * from public."Allowed_domains" '
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.FOUND).json(rows);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
		console.log(error);
	}
};
export const getDomainByName: HandlerProps = async (req, res) => {
	const { domain_name } = req.body;
	const query = {
		text: 'select * from public."Allowed_domains" WHERE "domain_name" = $1',
		values: [domain_name]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.FOUND).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
		console.log(error);
	}
};

export const getDomainById: HandlerProps = async (req, res) => {
	const { domain_id } = req.body;
	const query = {
		text: 'select * from public."Allowed_domains" WHERE "domain_id" = $1',
		values: [domain_id]
	};
	try {
		const { rows } = await pool.query(query);
		rows.length
			? res.status(StatusCode.FOUND).json(rows[0])
			: res.status(StatusCode.NOTFOUND).send(rows);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
		console.log(error);
	}
};
export const updateDomainName: HandlerProps = async (req, res) => {
	const { domain_id, domain_name } = req.body;
	const query = {
		text: 'UPDATE public."Allowed_domains" SET "domain_name"=$2  WHERE "domain_id" = $1 RETURN *',
		values: [domain_id, domain_name]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.FOUND).json(rows[0]);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send(error);
		console.log(error);
	}
};

export const deleteDomain: HandlerProps = async (req, res) => {
	const { domain_id } = req.body;
	const query = {
		text: 'DELETE from public."Allowed_domains" WHERE "domain_id" = $1',
		values: [domain_id]
	};
	try {
		const { rows } = await pool.query(query);
		res.status(StatusCode.NO_CONTENT).json(rows);
	} catch (error) {
		res.status(StatusCode.NOTFOUND).send('NOT FOUND');
		console.log(error);
	}
};
