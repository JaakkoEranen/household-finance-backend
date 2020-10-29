require('dotenv/config');

const { ShoppingListRepository } = require('../../repositories/shopping-list.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ShoppingListRepository(docClient);
const ok = withStatusCode(200);
const badRequest = withStatusCode(400);
const notFound = withStatusCode(404);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {

  const { body, pathParameters } = event;
  let { id, date } = pathParameters;
  id = parseInt(id);

  const existingShoppingList = await repository.getShoppingList(id, date);

  const shoppingList = parseJson(body);

  if (!existingShoppingList) {
    return notFound();
  }

  if (existingShoppingList.id !== shoppingList.id && existingShoppingList.date !== shoppingList.date) {
    return badRequest();
  }

  await repository.putShoppingList(shoppingList);

  return ok(shoppingList);
};