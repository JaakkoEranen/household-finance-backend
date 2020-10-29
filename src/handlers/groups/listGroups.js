require('dotenv/config');

const { GroupRepository } = require('../../repositories/group.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new GroupRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);

exports.handler = async (event) => {
  const group = await repository.listGroups();

  return ok(group);
};