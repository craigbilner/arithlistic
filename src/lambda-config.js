module.exports = {
  region: 'us-east-1',
  handler: 'index.handler',
  role: '@@ROLE',
  functionName: 'Arithlistic',
  timeout: 10,
  memorySize: 128,
  publish: true,
  accessKeyId: '@@ACCESS_KEY_ID',
  secretAccessKey: '@@SECRET_ACCESS_KEY',
};

// accessKeyId: <access key id>,  // optional
// secretAccessKey: <secret access key>,  // optional
// sessionToken: <sessionToken for assuming roles>,  // optional
// profile: <shared credentials profile name>, // optional for loading AWS credientail from custom profile
// runtime: 'nodejs4.3', // default: 'nodejs4.3',
// vpc: { // optional
//   SecurityGroupIds: [<security group id>, ...],
//   SubnetIds: [<subnet id>, ...]
// },
// eventSource: {
//   EventSourceArn: <event source such as kinesis ARN>,
//   BatchSize: 200,
//   StartingPosition: "TRIM_HORIZON"
// }