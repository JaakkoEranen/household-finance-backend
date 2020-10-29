require('dotenv/config');

const { GroupRepository } = require('../../repositories/group.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new GroupRepository(docClient);
const ok = withStatusCode(200);
const badRequest = withStatusCode(400);
const notFound = withStatusCode(404);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {

  const { body, pathParameters } = event;
  let { id } = pathParameters;
  id = parseInt(id);

  const existingGroup = await repository.getGroup(id);
  const group = parseJson(body);

  if (!existingGroup) {
    return notFound();
  }

  if (existingGroup.id !== group.id) {
    return badRequest();
  }

  await repository.putGroup(group);

  return ok(group);
};