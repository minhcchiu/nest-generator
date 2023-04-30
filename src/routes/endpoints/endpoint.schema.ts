import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../users/enums/role.enum';
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
  readonly url: string;

  @Prop({ type: String, enum: HttpMethod, default: HttpMethod.GET })
  readonly method: HttpMethod;

  @Prop({ type: Number, default: 1 })
  readonly position: number;

  @Prop({ type: String, default: '' })
  readonly description?: string;

  @Prop({ type: [{ type: String, enum: Role }], default: [] })
  readonly userRoles: Role[];
}

export type EndpointDocument = HydratedDocument<Endpoint>;
export const EndpointSchema = SchemaFactory.createForClass(Endpoint);
