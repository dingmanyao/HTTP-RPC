//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Creates a new web RPC service.
 * 
 * @param baseURL The base URL of the service.
 */
var WebRPCService = function(baseURL) {
    this.baseURL = baseURL;
}

/**
 * Invokes a web RPC service method.
 *
 * @param methodName The name of the method to invoke.
 * @param resultHandler A callback that will be invoked upon completion of the method.
 *
 * @return An XMLHttpRequest object representing the invocation request.
 */
WebRPCService.prototype.invoke = function(methodName, resultHandler) {
    return invokeWithArguments(methodName, {}, resultHandler);
}

/**
 * Invokes a web RPC service method.
 *
 * @param methodName The name of the method to invoke.
 * @param arguments The method arguments.
 * @param resultHandler A callback that will be invoked upon completion of the method.
 *
 * @return An XMLHttpRequest object representing the invocation request.
 */
WebRPCService.prototype.invokeWithArguments = function(methodName, arguments, resultHandler) {
    var url = this.baseURL + "/" + methodName;

    var parameters = "";

    for (key in arguments) {
        var value = arguments[key];

        var values = (value instanceof Array) ? value : [value];

        for (var i = 0; i < values.length; i++) {
            var argument = values[i];

            if (parameters.length > 0) {
                parameters += "&";
            }

            parameters += key + "=" + encodeURIComponent(argument);
        }
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var status = request.status;

            if (status == 200) {
                var responseText = request.responseText;

                resultHandler((responseText.length > 0) ? JSON.parse(responseText) : null, null);
            } else {
                resultHandler(null, status);
            }
        }
    }

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(parameters);

    return request;
}