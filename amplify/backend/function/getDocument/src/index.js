const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({
  accessKeyId: 'AKIAIU5JQXYYOIHRYZTQ',
  secretAccessKey: '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',
  region: 'ap-southeast-2'
});

const API_IDs = {
  master: 'upsw7nqiy5bl3hb4a3ckl77odi',
  dev: '7ojdef6dhjfg7fwfhv4q5nc5a4',
  khoi: 'd3mylzyfxjdgxgwrmyy3gt4gzu',
  question: '42kttme6tjb65lbyuzoyvtv7sy',
  bruno: 'm3gag7yt5jb4lexvpkqvi2geem'
};

exports.handler = async (event, context) => {
  let user, requestedDocument;

  const documentId = event.id;
  const environment = process.env.ENV;
  const identityProvider = event.identity.cognitoIdentityAuthProvider;

  if (identityProvider) {
    const userIdRe = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
    const userId = identityProvider.match(userIdRe)[0];

    // get the email of the user from the request
    user = await getUser(userId);
  }

  // get the document requested
  requestedDocument = await getDocument(documentId);

  const error = await checkAuthorisation(user, requestedDocument);

  if (error) {
    context.done(error, null);
  } else {
    context.done(null, requestedDocument);
  }

  async function getUser(userId) {
    const params = {
      TableName: `User-${API_IDs[environment]}-${environment}`,
      Key: {
        "id": userId
      }
    };

    return await query(params);
  }

  async function getDocument(documentId) {
    const params = {
      TableName: `Document-${API_IDs[environment]}-${environment}`,
      Key: {
        "id": documentId
      }
    };

    return await query(params);

  }

  async function query(params) {
    return new Promise((resolve, reject) => {
      dynamodb.get(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Item);
        }
      });
    });
  }

  async function checkAuthorisation(user, document) {
    if (document.sharingStatus === "PUBLIC" ||
      document.ownerId === user.id ||
      document.recipientEmail === user.username
    ) {
      return;
    } else {
      return new Error('Not authorised to access document.');
    }

  }
};
