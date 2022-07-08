import { Pool, Client } from 'pg';

const port = 3000;

export const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'BP_NW',
	password: 'Krabba30',
	port: 5432
});

const connectToPort = (server: any) => {
	server.listen(port, () => {
		console.log(`__ THE LONELY SERVER IS UP AND RUNNING ON __ ${port}`);
	});
};
export default { connectToPort };
