import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJNXcQaxNakbb8MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0taXYyZ212aC5hdXRoMC5jb20wHhcNMjAwNTIxMTAxMzQ0WhcNMzQw
MTI4MTAxMzQ0WjAhMR8wHQYDVQQDExZkZXYtLWl2MmdtdmguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtzL2yqE6kff7f4hiasTtXT80
vEU0EOZs8T6+ZDobyMfVy5GDhNVliG4L+0VEAySYiv6ajtvTNcPWf686SbkC8B/+
XNWFDB+h1sv5mXKaSK8PW1A2y5FP/BKNfCRdZGVvxl0iar2z1vq53lytXXz2DCKm
H/2LL3Fhq7ZtNDLqM5247NkKNColcJdPe6wjZjfnPO3mpkQyklmsIjkyvhynchEH
MlZiGUtFu5Jpxx3xtLL6Pj2b6iV9o4qyOB8LQ+t7RTK8WpYmSYl/Nu1moZOxZTjc
981uz4TFjlkLb82826RPd6+OaEnXfTvBJJju7iuABiulKl9dCHx3UfCxv6LiewID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSS3OfgHTrx/GpcoF+c
rnFCchOnUzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJWnzLuV
XBIpQNGn6zSlPXSKHKN8T0TOU0bWNp5q7LGmZlm1xwFeXilTQ00GLd1sZP/qM+mY
EoRMDDz4AJ7q9DRLhyX410f8BaXDRWqgMFA/cUESLRrno30i5P7Qnx6L42oPmgcL
3lm0qsfq3hpul6YKjPKTRxhRvQM6bOojtxcRKeplvhijJFOL5qKuobQY4SY9AraW
kYg5oTcRhx6F59ifHqudanjYMUJqOo0dt4B1bJCmuC+aWeKW8NAaS4EUgcT3Eje2
2Y6fSYyojDdkdzKhI75oco2PiYB4gDoK3YBrVZilLRi42Wo1b6Ipr3Z9KO8jqcLs
PI7f0ayCPa0q4O4=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken)
        console.log('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        console.log('User authorized', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

function verifyToken(authHeader: string): JwtPayload {
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}