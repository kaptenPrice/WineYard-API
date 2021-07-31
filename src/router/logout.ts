export const get = async (req, res) => {
	try {
		await res.clearCookie('token');
		res.redirect('/login');
	} catch (error) {
		res.send({ error: error.message, message: `Couldn't log out user` });
	}
};
