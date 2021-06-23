"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendStack = void 0;
const cdk = require("@aws-cdk/core");
const LambdaBackendConstruct_1 = require("./1_backend/LambdaBackendConstruct");
class BackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // =========================================
        //
        //  Backend Architecture Creation
        //
        // =========================================
        new LambdaBackendConstruct_1.LambdaBackendConstruct(this, id, props);
    }
}
exports.BackendStack = BackendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhY2tlbmQtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLCtFQUc0QztBQUU1QyxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLDRDQUE0QztRQUM1QyxFQUFFO1FBQ0YsaUNBQWlDO1FBQ2pDLEVBQUU7UUFDRiw0Q0FBNEM7UUFDNUMsSUFBSSwrQ0FBc0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQVZELG9DQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQge1xuICBCYWNrZW5kQ29uZmlnRGVjb3JhdG9yLFxuICBMYW1iZGFCYWNrZW5kQ29uc3RydWN0LFxufSBmcm9tIFwiLi8xX2JhY2tlbmQvTGFtYmRhQmFja2VuZENvbnN0cnVjdFwiO1xuXG5leHBvcnQgY2xhc3MgQmFja2VuZFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBCYWNrZW5kQ29uZmlnRGVjb3JhdG9yKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBCYWNrZW5kIEFyY2hpdGVjdHVyZSBDcmVhdGlvblxuICAgIC8vXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBuZXcgTGFtYmRhQmFja2VuZENvbnN0cnVjdCh0aGlzLCBpZCwgcHJvcHMpO1xuICB9XG59XG4iXX0=