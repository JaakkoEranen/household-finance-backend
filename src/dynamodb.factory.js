const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const withProcessEnv = ({ AWS_ENDPOINT, AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY }) => () => {
  const options = {
    endpoint: AWS_ENDPOINT,
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  };

  return new DocumentClient(options);
};

module.exports = {
  withProcessEnv
};