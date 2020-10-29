require('dotenv/config');

const { FinanceRepository } = require('../../repositories/finance.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new FinanceRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);
const notFound = withStatusCode(404);

exports.handler = async (event) => {

  let { id, date, month } = event.pathParameters;
  id = parseInt(id);
  
  let finance = null;

  if (date) {
    finance = await repository.getFinance(id, date);
  } else if (month) {
    finance = await repository.getFinanceMonth(id, month);
  }

  if (!finance){
    return notFound();
  }

  return ok(finance);
};