export const errorName = {
    EMAILTAKEN : 'EMAILTAKEN',
    HANDLETAKEN : "HANDLETAKEN",
    GMAILSUPPORT:"GMAILSUPPORT",
    EMAILNOTFOUND:"EMAILNOTFOUND",
    CREDENTIAL_INVALID:"CREDENTIAL_INVALID",
    UNAUTHORIZED:"UNAUTHORIZED",
    POST_NOT_FOUND :"POST_NOT_FOUND",
    COMMENT_NOT_FOUND:"COMMENT_NOT_FOUND"
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
    },
    POST_NOT_FOUND: {
        message : "Post does'nt exists",
        statusCode:401
    },
    COMMENT_NOT_FOUND : {
       message : "Comment not found!",
       statusCode:401
    }

}

export const getErrorCode = (errorName) => {
       return errorType[errorName]
}