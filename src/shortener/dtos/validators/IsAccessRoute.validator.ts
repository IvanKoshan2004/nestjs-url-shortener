import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAccessRouteConstraint implements ValidatorConstraintInterface {
    validate(accessRoute: any, args: ValidationArguments) {
        const length = accessRoute.length;
        if (accessRoute == '') return true;
        if (length < 5 || length > 20) return false;
        if (!/^[A-Za-z0-9]*$/.test(accessRoute)) return false;
        return true;
    }
}

export function IsAccessRoute(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions || { message: 'Invalid Access Route' },
            constraints: [],
            validator: IsAccessRouteConstraint,
        });
    };
}
