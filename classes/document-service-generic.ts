import { FilterQuery, Model } from 'mongoose';

export abstract class DocumentService<T> {
    constructor(private model: Model<T>) {}
    findById(_id: string) {
        return this.model.findById(_id).exec();
    }
    updateById(_id: string, modification: Partial<Record<keyof T, unknown>>) {
        return this.model.findByIdAndUpdate(_id, modification).exec();
    }
    deleteById(_id: string) {
        return this.model.findByIdAndDelete(_id).exec();
    }
    find(
        conditions: FilterQuery<T>,
        projection: string | Record<string, unknown> = {},
        options: Record<string, unknown> = {},
    ) {
        return this.model.find(conditions, projection, options).exec();
    }
    findOne(
        conditions: FilterQuery<T>,
        projection: string | Record<string, unknown> = {},
        options: Record<string, unknown> = {},
    ) {
        return this.model.findOne(conditions, projection, options).exec();
    }
    findWithLimitAndSkip(limit: number, offset = 0) {
        return this.model.find().skip(offset).limit(limit).exec();
    }
    create(document: FilterQuery<T>) {
        return this.model.create(document);
    }
}
