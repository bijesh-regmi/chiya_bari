import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);

//Mock Data collection
/*
[
    { "subscriber": "johndoe_tech", "channel": "bruce_wayne", "createdAt": "2024-02-01T11:00:00Z" },
    { "subscriber": "alice_codes", "channel": "johndoe_tech", "createdAt": "2024-02-02T09:30:00Z" },
    { "subscriber": "alice_codes", "channel": "thor_odinson", "createdAt": "2024-02-02T10:15:00Z" },
    { "subscriber": "bob_builder", "channel": "tony_stark", "createdAt": "2024-02-03T08:00:00Z" },
    { "subscriber": "charlie_brown", "channel": "dana_scully", "createdAt": "2024-02-04T14:20:00Z" },
    { "subscriber": "dana_scully", "channel": "fox_mulder", "createdAt": "2024-02-05T16:45:00Z" },
    { "subscriber": "fox_mulder", "channel": "dana_scully", "createdAt": "2024-02-06T12:00:00Z" },
    { "subscriber": "tony_stark", "channel": "bruce_wayne", "createdAt": "2024-02-07T10:10:00Z" },
    { "subscriber": "peter_parker", "channel": "tony_stark", "createdAt": "2024-02-08T11:25:00Z" },
    { "subscriber": "bruce_wayne", "channel": "clark_kent", "createdAt": "2024-02-09T09:00:00Z" },
    { "subscriber": "clark_kent", "channel": "bruce_wayne", "createdAt": "2024-02-10T15:30:00Z" },
    { "subscriber": "diana_prince", "channel": "thor_odinson", "createdAt": "2024-02-11T13:15:00Z" },
    { "subscriber": "barry_allen", "channel": "hal_jordan", "createdAt": "2024-02-12T07:45:00Z" },
    { "subscriber": "hal_jordan", "channel": "diana_prince", "createdAt": "2024-02-13T19:00:00Z" },
    { "subscriber": "arthur_curry", "channel": "victor_stone", "createdAt": "2024-02-14T22:30:00Z" },
    { "subscriber": "victor_stone", "channel": "natasha_romanoff", "createdAt": "2024-02-15T12:00:00Z" },
    { "subscriber": "natasha_romanoff", "channel": "wanda_maximoff", "createdAt": "2024-02-16T08:50:00Z" },
    { "subscriber": "wanda_maximoff", "channel": "steve_rogers", "createdAt": "2024-02-17T11:10:00Z" },
    { "subscriber": "steve_rogers", "channel": "bruce_banner", "createdAt": "2024-02-18T14:40:00Z" },
    { "subscriber": "bruce_banner", "channel": "thor_odinson", "createdAt": "2024-02-19T10:05:00Z" },
    { "subscriber": "thor_odinson", "channel": "tony_stark", "createdAt": "2024-02-20T16:20:00Z" },
    { "subscriber": "johndoe_tech", "channel": "alice_codes", "createdAt": "2024-02-21T09:00:00Z" },
    { "subscriber": "alice_codes", "channel": "bob_builder", "createdAt": "2024-02-22T13:45:00Z" },
    { "subscriber": "bob_builder", "channel": "charlie_brown", "createdAt": "2024-02-23T11:30:00Z" },
    { "subscriber": "charlie_brown", "channel": "tony_stark", "createdAt": "2024-02-24T10:15:00Z" },
    { "subscriber": "dana_scully", "channel": "tony_stark", "createdAt": "2024-02-25T08:50:00Z" },
    { "subscriber": "fox_mulder", "channel": "tony_stark", "createdAt": "2024-02-26T14:40:00Z" },
    { "subscriber": "tony_stark", "channel": "thor_odinson", "createdAt": "2024-02-27T12:00:00Z" },
    { "subscriber": "peter_parker", "channel": "bruce_wayne", "createdAt": "2024-02-28T09:10:00Z" },
    { "subscriber": "bruce_wayne", "channel": "johndoe_tech", "createdAt": "2024-03-01T11:30:00Z" },
    { "subscriber": "clark_kent", "channel": "tony_stark", "createdAt": "2024-03-02T15:20:00Z" },
    { "subscriber": "diana_prince", "channel": "bruce_wayne", "createdAt": "2024-03-03T10:05:00Z" },
    { "subscriber": "barry_allen", "channel": "tony_stark", "createdAt": "2024-03-04T12:45:00Z" },
    { "subscriber": "hal_jordan", "channel": "tony_stark", "createdAt": "2024-03-05T08:30:00Z" },
    { "subscriber": "arthur_curry", "channel": "tony_stark", "createdAt": "2024-03-06T16:15:00Z" },
    { "subscriber": "victor_stone", "channel": "bruce_wayne", "createdAt": "2024-03-07T11:55:00Z" },
    { "subscriber": "natasha_romanoff", "channel": "bruce_wayne", "createdAt": "2024-03-08T14:40:00Z" },
    { "subscriber": "wanda_maximoff", "channel": "tony_stark", "createdAt": "2024-03-09T09:20:00Z" },
    { "subscriber": "steve_rogers", "channel": "tony_stark", "createdAt": "2024-03-10T13:10:00Z" },
    { "subscriber": "bruce_banner", "channel": "tony_stark", "createdAt": "2024-03-11T10:55:00Z" },
    { "subscriber": "thor_odinson", "channel": "bruce_wayne", "createdAt": "2024-03-12T15:00:00Z" },
    { "subscriber": "johndoe_tech", "channel": "victor_stone", "createdAt": "2024-03-13T12:30:00Z" },
    { "subscriber": "alice_codes", "channel": "clark_kent", "createdAt": "2024-02-14T08:15:00Z" },
    { "subscriber": "bob_builder", "channel": "thor_odinson", "createdAt": "2024-03-15T11:45:00Z" },
    { "subscriber": "charlie_brown", "channel": "diana_prince", "createdAt": "2024-03-16T17:00:00Z" },
    { "subscriber": "dana_scully", "channel": "barry_allen", "createdAt": "2024-03-17T09:50:00Z" },
    { "subscriber": "fox_mulder", "channel": "hal_jordan", "createdAt": "2024-03-18T14:10:00Z" },
    { "subscriber": "tony_stark", "channel": "arthur_curry", "createdAt": "2024-03-19T10:30:00Z" },
    { "subscriber": "peter_parker", "channel": "victor_stone", "createdAt": "2024-03-20T11:00:00Z" }
    { "subscriber": "johndoe_tech", "channel": "tony_stark", "createdAt": "2024-02-01T10:00:00Z" },
]
*/
