require('dotenv/config');

const { ShoppingListRepository } = require('../../repositories/shopping-list.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ShoppingListRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);
const notFound = withStatusCode(404);

exports.handler = async (event) => {
  let { id, date, month } = event.pathParameters;
  id = parseInt(id);
  let shoppingList = null;

  if (date) {
    shoppingList = await repository.getShoppingList(id, date);
  } else if (month) {
    shoppingList = await repository.getShoppingListMonth(id, month);
  }

  if (!shoppingList){
    return notFound();
  }

  return ok(shoppingList);
};