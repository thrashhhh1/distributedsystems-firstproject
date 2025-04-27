import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema()
export class Alert {
    @Prop({ index: true, required: true })
    alertId: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    nThumbsUp: number;

    @Prop({ required: true })
    reportBy: string;

    @Prop({ required: true })
    reportByMunicipalityUser: boolean;

    @Prop({ required: true })
    type: string;

    @Prop({})
    subtype: string;

    @Prop({ required: true })
    roadType: number;

    @Prop({
        required: true,
        type: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
    })
    location: {
        x: number;
        y: number;
    };

    @Prop({ required: true })
    street: string;

    @Prop({ required: true })
    fromNodeId: number;

    @Prop({ required: true })
    toNodeId: number;

    @Prop({ required: true })
    speed: number;

    @Prop({ required: true })
    pubMillis: number;

    @Prop({ required: true })
    additionalInfo: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
