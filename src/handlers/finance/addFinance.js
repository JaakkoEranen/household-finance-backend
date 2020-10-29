require('dotenv/config');

const { FinanceRepository } = require('../../repositories/finance.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new FinanceRepository(docClient);
const created = withStatusCode(201);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  
  const { body } = event;
  const finance = parseJson(body);

  await repository.putFinance(finance);

  return created();
};