import {InputDescriptor} from "../index";
import DurationInput from "./DurationInput";
import {DurationLikeObject} from 'luxon';

export const Duration = {
  _descriptor: {
    id: 'datetime',
    input: DurationInput,
  } as InputDescriptor<DurationLikeObject>,
};

