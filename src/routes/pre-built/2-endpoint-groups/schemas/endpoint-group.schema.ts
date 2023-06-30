import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '~routes/pre-built/1-users/enums/role.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'endpointgroups',
})
export class EndpointGroup {
  @Prop({ type: String, required: true, index: true, unique: true })
  readonly prefix: string;

  @Prop({ type: String, default: null })
  readonly title: string;

  @Prop({
    type: [{ type: String, ref: 'Endpoint' }],
    default: [],
  })
  readonly endpoints: string[];

  @Prop({ type: String, default: null })
  readonly description?: string;

  @Prop({ type: [{ type: String, enum: Role }], default: [Role.SUPER_ADMIN] })
  readonly roles: Role[];

  @Prop({ type: Number, default: false })
  readonly position: number;
}

type EndpointGroupDocument = HydratedDocument<EndpointGroup>;
const EndpointGroupSchema = SchemaFactory.createForClass(EndpointGroup);

export { EndpointGroupDocument, EndpointGroupSchema };
