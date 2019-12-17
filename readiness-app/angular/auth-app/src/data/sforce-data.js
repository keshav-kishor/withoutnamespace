var sforce = {
    opencti: {
        testing: 'success',
        getCallCenterSettings: function (param) {
            if (param.callback && typeof param.callback === 'function') {
                switch (this.testing) {
                    case 'success':
                        param.callback({
                            success: true,
                            errors: null,
                            returnValue: {
                                '/inContactSettings/icAuthorizationUrl': 'https://sc10.incontact.com/InContactAuthorizationServer/Token',
                                '/inContactSettings/authMode': 'incontact',
                                '/inContactSettings/evolveAuthUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/evolveNotificationUrl': 'https://na1-ws.nice-incontact.com/ws/notifications',
                                '/inContactSettings/evolveWebServerUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/icCustomDomain': '',
                                'forgotPassword': 'https://sc10.incontact.com/inContact/ForgotPassword.aspx'
                            }
                        });
                        break;
                    case 'success-openid':
                        param.callback({
                            success: true,
                            errors: null,
                            returnValue: {
                                '/inContactSettings/icAuthorizationUrl': 'https://sc10.incontact.com/InContactAuthorizationServer/Token',
                                '/inContactSettings/authMode': 'incontact',
                                '/inContactSettings/evolveAuthUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/evolveNotificationUrl': 'https://na1-ws.nice-incontact.com/ws/notifications',
                                '/inContactSettings/evolveWebServerUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/icCustomDomain': 'https://thirdpartyasidp.ucnlabext.com',
                                'forgotPassword': 'https://sc10.incontact.com/inContact/ForgotPassword.aspx'
                            }
                        });
                        break;
                    case 'success-userhub':
                        param.callback({
                            success: true,
                            errors: null,
                            returnValue: {
                                '/inContactSettings/icAuthorizationUrl': 'https://sc10.incontact.com/InContactAuthorizationServer/Token',
                                '/inContactSettings/authMode': 'evolve',
                                '/inContactSettings/evolveAuthUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/evolveNotificationUrl': 'https://na1-ws.nice-incontact.com/ws/notifications',
                                '/inContactSettings/evolveWebServerUrl': 'https://na1.nice-incontact.com',
                                '/inContactSettings/icCustomDomain': '',
                                'forgotPassword': 'https://sc10.incontact.com/inContact/ForgotPassword.aspx'
                            }
                        });
                        break;
                    case 'opencti error':
                        param.callback({
                            success: false,
                            errors: [{description: 'callcenter settings error'}],
                            returnValue: {}
                        });
                        break; 
                    case 'error':
                        param.callback({
                            success: false,
                            errors: true,
                            returnValue: {}
                        });
                        break;
                    case 'exception':
                        param.callback();
                        break;
                }
            }
        },
        runApex: function (param) {
            if (param.methodName === 'storeUserCredentials' || param.methodName === 'storeUserTokens' || param.methodName === 'getAuthenticationSettings') {
                if (param.callback && typeof param.callback === 'function') {
                    switch (this.testing) {
                        case 'success':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {"runApex": "{\"success\":\"true\",\"result\":\"{\\\"data\\\": \\\"\\\", \\\"error\\\": \\\"\\\"}\"}"}
                            });
                            break;
                        case 'error':
                            param.callback({
                                success: false,
                                errors: 'not able to store user credentials',
                                returnValue: {}
                            });
                            break;
                        case 'run apex error':
                            param.callback({
                                success: false,
                                errors: [{description: 'run apex error'}],
                                returnValue: {}
                            });
                            break;
                        case 'result error':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {"runApex": "{\"success\":\"false\", \"error\": true}"}
                            });
                            break;
                        case 'exception':
                            param.callback();
                            break;
                        default:
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: { "runApex": "{\"success\":\"true\",\"result\":\"{\\\"data\\\": \\\"\\\", \\\"error\\\": \\\"\\\"}\"}" }
                            });
                            break;
                    }
                }
            }
            if (param.methodName === 'authenticate' || param.methodName === 'refreshToken') {
                if (param.callback && typeof param.callback === 'function') {
                    switch (this.testing) {
                        case 'success':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {
                                    "runApex": "{\"statusText\":\"OK\",\"statusCode\":200,\"error\":null,\"data\":\"{\\\"access_token\\\":\\\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9\\\"," +
                                                "\\\"token_type\\\":\\\"bearer\\\",\\\"expires_in\\\":3600,\\\"refresh_token\\\":\\\"hNzwzl3o5EqtwyZpFj0SzA==\\\"," +
                                                "\\\"scope\\\":\\\"RealTimeApi AdminApi AgentApi ReportingApi\\\",\\\"resource_server_base_uri\\\":\\\"https://hc8.ucnlabext.com/InContactAPI/\\\"," +
                                                "\\\"refresh_token_server_uri\\\":\\\"https://hc8.ucnlabext.com/InContactAuthorizationServer/Token\\\"," +
                                                "\\\"agent_id\\\":28295,\\\"team_id\\\":1042,\\\"bus_no\\\":10001}\"}"
                                }
                            });
                            break;
                        case 'invalid credentials':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {
                                    "runApex": "{\"statusText\":\"OK\",\"statusCode\":401,\"error\":null,\"data\":\"\"}"
                                }
                            });
                            break;
                        case 'account locked':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {
                                    "runApex": "{\"statusText\":\"Login failed. The account has been locked. Contact your system administrator.\",\"statusCode\":401,\"error\":null,\"data\":\"\"}"
                                }
                            });
                            break;
                        case 'error':
                            param.callback({
                                success: false,
                                errors: true,
                                returnValue: {}
                            });
                            break;
                        case 'run apex error':
                            param.callback({
                                success: false,
                                errors: [{description: 'run apex error'}],
                                returnValue: {}
                            });
                            break;
                        case 'result error':
                            param.callback({
                                success: true,
                                errors: null,
                                returnValue: {"runApex": "{\"statusCode\": 400, \"error\": true}"}
                            });
                            break;
                        case 'exception':
                            param.callback();
                            break;
                    }
                }
            }
        }
    },
    apex: {
        test: 'success',
        execute: function (pkg, method, args, callback) {
            if(method == "authenticate") {
                switch (this.test) {
                    case 'success':
                    callback (["{\"statusText\":\"OK\",\"statusCode\":200,\"error\":null,\"data\":\"{\\\"access_token\\\":\\\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9\\\","+
                        "\\\"token_type\\\":\\\"bearer\\\",\\\"expires_in\\\":3600,"+
                        "\\\"refresh_token\\\":\\\"q1iPwaiOsUmzyJUMgNaTaw==\\\","+
                        "\\\"scope\\\":\\\"RealTimeApi AdminApi AgentApi PatronApi ReportingApi\\\","+
                        "\\\"resource_server_base_uri\\\":\\\"https://api-sc11.ucnlabext.com/InContactAPI/\\\","+
                        "\\\"refresh_token_server_uri\\\":\\\"https://api-sc11.ucnlabext.com/InContactAuthorizationServer/Token\\\","+
                        "\\\"agent_id\\\":14517,\\\"team_id\\\":2202,\\\"bus_no\\\":28}\"}"]);
                        break;
                    case 'error':
                    callback (["{\"statusText\":\"\",\"statusCode\":302,\"error\":\"run apex error\",\"data\":null}"]);
                        break;
                    case 'exception':
                    callback();
                        break;
                }
            }
        }
    }
};