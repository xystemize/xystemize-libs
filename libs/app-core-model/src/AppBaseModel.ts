
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';
import { capitalize, first, forEach, isEmpty, map } from 'lodash';

export interface ValidationInterface {
  isValid: boolean;
  errors: object | null;
  hasErrors: boolean;
}

export class AppBaseModel {
  // eslint-disable-next-line
  emptyFunction = async () => {};

  get isValid(): boolean {
    const errors = validateSync(this);
    return isEmpty(errors);
  }

  get isNotValid(): boolean {
    return !this.isValid;
  }

  transformAndAssign = <T, V>(classRef: ClassConstructor<T>, plain: V) => {
    Object.assign(
      this,
      plainToInstance(classRef, plain, {
        excludeExtraneousValues: true,
      }),
    );
  };

  validate = () => {
    const errorData = validateSync(this);
    const errorsObj:
      | {
          [k: string]:
            | {
                [type: string]: string;
              }
            | undefined;
        }
      | undefined
      | null = errorData.length ? {} : null;
    const errorsArray: string[] = [];

    let firstErrorMessage: string | null = null;

    forEach(errorData, (obj) => {
      const { property, constraints } = obj || {};

      const errors = map(constraints);
      errorsArray.push(...errors);

      if (errorsObj) {
        errorsObj[property] = constraints;
      }

      if (!firstErrorMessage) {
        const message = first(map(constraints));
        firstErrorMessage = message ? capitalize(message) : null;
      }
    });

    const isValid = errorsObj === null;
    const hasErrors = errorsObj !== null;

    return { isValid, errorsObj, errorsArray, hasErrors, firstErrorMessage };
  };

  isValidAsync = async (): Promise<boolean> => {
    const errors = await validate(this);
    return errors.length === 0;
  };

  validateAsync = async (): Promise<ValidationInterface> => {
    const errors = await validate(this);
    const isValid = errors.length === 0;
    const hasErrors = errors.length > 0;

    return { isValid, errors, hasErrors };
  };
}
