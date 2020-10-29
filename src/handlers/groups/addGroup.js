require('dotenv/config');

const { GroupRepository } = require('../../repositories/group.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new GroupRepository(docClient);
const created = withStatusCode(201);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body } = event;
  const group = parseJson(body);

  await repository.putGroup(group);

  return created();
};