import { Buffer } from 'buffer';
import { instanceToPlain } from 'class-transformer';
import { omitBy } from 'lodash';

import { AppBaseModel } from './AppBaseModel';

export class AppBaseDataModel extends AppBaseModel {
  constructor() {
    super();
  }

  get modelName() {
    return ''; // See child override
  }

  get firestoreCollectionName() {
    return ''; // See child override
  }

  get updateProps(): string[] {
    return []; // See child override
  }

  get updatePropsByAdmin(): string[] {
    return []; // See child override
  }

  get deleteProps(): string[] {
    return []; // See child override
  }

  update<Type extends this>(instance: Type) {
    const sanitizedObj = omitBy(instance, (value, key) => !this.updateProps.includes(key) || value === undefined);

    return Object.assign(this, sanitizedObj);
  }

  updateByAdmin<Type extends this>(instance: Type) {
    const sanitizedObj = omitBy(
      instance,
      (value, key) => !this.updatePropsByAdmin.includes(key) || value === undefined,
    );

    return Object.assign(this, sanitizedObj);
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  toObject<Type>(): Type {
    return JSON.parse(this.toJson());
  }

  toObjectWithoutBlankProps() {
    const withoutFunctions = JSON.parse(this.toJson());
    return omitBy(withoutFunctions, (value) => value === '');
  }

  toFirestoreDocument() {
    return instanceToPlain(this, { excludeExtraneousValues: true });
  }

  toAnalyticsDocument() {
    return instanceToPlain(this, { excludeExtraneousValues: true });
  }

  toFirestoreUpdateDocument() {
    const plainObj = instanceToPlain(this, { excludeExtraneousValues: true });

    return omitBy(plainObj, (_, key) => !this.updateProps.includes(key));
  }

  toFirestoreDeleteDocument() {
    const plainObj = instanceToPlain(this, { excludeExtraneousValues: true });

    return omitBy(plainObj, (_, key) => !this.deleteProps.includes(key));
  }

  toCustomClaim() {
    return instanceToPlain(this, { excludeExtraneousValues: true });
  }

  toPubSubData() {
    return { data: Buffer.from(this.toJson()) };
  }
}
