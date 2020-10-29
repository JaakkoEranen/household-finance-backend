require('dotenv/config');

const { GroupRepository } = require('../../repositories/group.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new GroupRepository(docClient);
const noContent = withStatusCode(204);

exports.handler = async (event) => {
  let { id } = event.pathParameters;
  id = parseInt(id);

  await repository.deleteGroup(id);

  return noContent();
};