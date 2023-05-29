import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../1-users/enums/role.enum';
import { HttpMethod } from './enum/http-method';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'endpoints',
})
export class Endpoint {
  @Prop({ type: String, default: '' })
  readonly name: string;

  @Prop({ type: String, default: '' })
  readonly path: string;

  @Prop({ type: String, enum: HttpMethod, default: HttpMethod.GET })
  readonly method: HttpMethod;

  @Prop({ type: Number, default: 1 })
  readonly position: number;

  @Prop({ type: String, default: '' })
  readonly description?: string;

  @Prop({ type: [{ type: String, enum: Role }], default: [Role.SUPER_ADMIN] })
  readonly userRoles: Role[];

  @Prop({ type: Boolean, default: false })
  readonly isPublic: boolean;
}

type EndpointDocument = HydratedDocument<Endpoint>;
const EndpointSchema = SchemaFactory.createForClass(Endpoint);

EndpointSchema.index({ path: 1, method: 1 }, { unique: true });

export { EndpointDocument, EndpointSchema };
