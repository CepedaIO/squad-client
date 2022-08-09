import {DateTime} from "luxon";
import {InputDescriptor} from "../index";
import DurationInput from "./DurationInput";

export const Duration = {
  _descriptor: {
    id: 'datetime',
    input: DurationInput,
  } as InputDescriptor<DateTime>,
};

