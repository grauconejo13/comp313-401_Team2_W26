import { Schema, model, Document, Types } from 'mongoose';

export interface ISemester extends Document {
  user: Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Semester = model<ISemester>('Semester', SemesterSchema);
