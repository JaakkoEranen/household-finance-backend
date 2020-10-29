require('dotenv/config');

const { GroupRepository } = require('../../repositories/group.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new GroupRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);
const notFound = withStatusCode(404);

exports.handler = async (event) => {
  let { id } = event.pathParameters;
  id = parseInt(id);
  
  const group = await repository.getGroup(id);

  if (!group){
    return notFound();
  }

  return ok(group);
};