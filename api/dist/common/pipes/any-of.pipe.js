"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyOf = AnyOf;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
function AnyOf(properties) {
    return function (target) {
        for (const property of properties) {
            const otherProps = properties.filter((prop) => prop !== property);
            const decorators = [
                (0, class_validator_1.ValidateIf)((obj) => obj[property] !== undefined ||
                    otherProps.reduce((acc, prop) => acc && obj[prop] === undefined, true)),
            ];
            for (const decorator of decorators) {
                (0, common_1.applyDecorators)(decorator)(target.prototype, property);
            }
        }
    };
}
//# sourceMappingURL=any-of.pipe.js.map