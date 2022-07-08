//200 errors
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
//300 errors
const FOUND = 302;
const TEMPORARY_REDIRECT = 307;

//400 errors
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOTFOUND = 404;
const METHOD_NOT_ALLOWED = 405;

//500 errors
const INTERNAL_SERVER_ERROR = 500;

export default {
	OK,
	CREATED,
	FOUND,
	TEMPORARY_REDIRECT,
	BAD_REQUEST,
	NOTFOUND,
	UNAUTHORIZED,
	FORBIDDEN,
	METHOD_NOT_ALLOWED,
	INTERNAL_SERVER_ERROR,
	NO_CONTENT
};
