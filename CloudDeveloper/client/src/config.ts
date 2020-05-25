// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'm38zys0v4j'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev--iv2gmvh.auth0.com',            // Auth0 domain
  clientId: 'YZTnrVLPwAIm6evX7c0XNi43WkFFVi1O',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
