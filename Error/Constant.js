export const errorName = {
    EMAILTAKEN : 'EMAILTAKEN',
    HANDLETAKEN : "HANDLETAKEN",
    GMAILSUPPORT:"GMAILSUPPORT",
    EMAILNOTFOUND:"EMAILNOTFOUND",
    CREDENTIAL_INVALID:"CREDENTIAL_INVALID",
    UNAUTHORIZED:"UNAUTHORIZED"
}

export const errorType = {
    EMAILTAKEN : {
        message:'User Already Exists.',
        statusCode:401
    },
    HANDLETAKEN: {
        message : 'User Handle Already Taken.',
        statusCode: 401
    },
    GMAILSUPPORT : {
        message : "We only support Gmail address",
        statusCode:401
    },
    EMAILNOTFOUND: {
        message : "Email Not Registered!",
        statusCode :401
    },
    CREDENTIAL_INVALID: {
        message:"Wrong Information!",
        statusCode:401
    },
    UNAUTHORIZED: {
        message:"Access Denied!",
        statusCode:400
    }

}

export const getErrorCode = (errorName) => {
       return errorType[errorName]
}