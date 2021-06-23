"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileNumbers = exports.Backend = void 0;
var Backend;
(function (Backend) {
    Backend["solution"] = "backend-predicting-lambda";
    Backend["environment"] = "production";
    Backend[Backend["memory"] = 10240] = "memory";
    Backend["parameterStoreCredentialsGoogle"] = "/google/admin/credentials";
    Backend["codeLocation"] = "images";
    Backend["profilingGroupPermissions"] = "AmazonCodeGuruProfilerFullAccess";
    Backend["predictingLambdaExportName"] = "predictingLambda";
    Backend[Backend["timeout"] = 8] = "timeout";
})(Backend = exports.Backend || (exports.Backend = {}));
exports.mobileNumbers = ["+359898913413"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tDb25maWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3RhY2tDb25maWdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksT0FTWDtBQVRELFdBQVksT0FBTztJQUNqQixpREFBc0MsQ0FBQTtJQUN0QyxxQ0FBMEIsQ0FBQTtJQUMxQiw2Q0FBYyxDQUFBO0lBQ2Qsd0VBQTZELENBQUE7SUFDN0Qsa0NBQXVCLENBQUE7SUFDdkIseUVBQThELENBQUE7SUFDOUQsMERBQStDLENBQUE7SUFDL0MsMkNBQVcsQ0FBQTtBQUNiLENBQUMsRUFUVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFTbEI7QUFFWSxRQUFBLGFBQWEsR0FBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIEJhY2tlbmQge1xuICBzb2x1dGlvbiA9IFwiYmFja2VuZC1wcmVkaWN0aW5nLWxhbWJkYVwiLFxuICBlbnZpcm9ubWVudCA9IFwicHJvZHVjdGlvblwiLFxuICBtZW1vcnkgPSAxMDI0MCxcbiAgcGFyYW1ldGVyU3RvcmVDcmVkZW50aWFsc0dvb2dsZSA9IFwiL2dvb2dsZS9hZG1pbi9jcmVkZW50aWFsc1wiLFxuICBjb2RlTG9jYXRpb24gPSBcImltYWdlc1wiLFxuICBwcm9maWxpbmdHcm91cFBlcm1pc3Npb25zID0gXCJBbWF6b25Db2RlR3VydVByb2ZpbGVyRnVsbEFjY2Vzc1wiLFxuICBwcmVkaWN0aW5nTGFtYmRhRXhwb3J0TmFtZSA9IFwicHJlZGljdGluZ0xhbWJkYVwiLFxuICB0aW1lb3V0ID0gOCxcbn1cblxuZXhwb3J0IGNvbnN0IG1vYmlsZU51bWJlcnM6IEFycmF5PHN0cmluZz4gPSBbXCIrMzU5ODk4OTEzNDEzXCJdO1xuIl19