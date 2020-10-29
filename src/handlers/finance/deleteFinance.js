require('dotenv/config');

const { FinanceRepository } = require('../../repositories/finance.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new FinanceRepository(docClient);
const noContent = withStatusCode(204);

exports.handler = async (event) => {
  let { id, date } = event.pathParameters;
  id = parseInt(id);

  await repository.deleteFinance(id, date);

  return noContent();
};