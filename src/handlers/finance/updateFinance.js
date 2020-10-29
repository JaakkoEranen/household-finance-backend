require('dotenv/config');

const { FinanceRepository } = require('../../repositories/finance.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new FinanceRepository(docClient);
const ok = withStatusCode(200);
const badRequest = withStatusCode(400);
const notFound = withStatusCode(404);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {

  const { body, pathParameters } = event;
  let { id, date } = pathParameters;
  id = parseInt(id);

  const existingFinance = await repository.getFinance(id, date);
  const finance = parseJson(body);

  if (!existingFinance) {
    return notFound();
  }

  if (existingFinance.id !== finance.id && existingFinance.date !== finance.date) {
    return badRequest();
  }

  await repository.putFinance(finance);

  return ok(finance);
};